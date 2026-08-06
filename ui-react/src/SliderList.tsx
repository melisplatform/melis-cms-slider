import { Fragment, useEffect, useRef, useState } from 'react'
import {
  fetchSliders, fetchSliderStats, saveSlider, deleteSlider,
  consumeSliderListStale, type SliderItem, type SliderStats,
} from './slider-api'
import {
  useT, makeCan, card, inputCss, btnPrimary, btnGhost, iconBtn, th, td, label, hint, pageWrap,
  PencilIcon, TrashIcon, PlusIcon, LayersIcon, GripIcon, ResetIcon, Kpi, ConfirmModal,
  GalleryIcon, ImagesIcon, CheckCircleIcon,
  ColManager, makeColStore, visibleCols, ghostHover, type ColDef,
} from './ui'
import { ExportModal, DownloadIcon } from './ExportModal'
import { ViewToggle, type ViewMode } from './ViewToggle'
import { PagePicker } from './PagePicker'
import { useKeysetList } from './use-keyset-list'
import { useIsNarrow } from './shared/useIsNarrow'
import { ExpandToggle, HiddenColsRow } from './shared/ExpandableRow'
import { FormErrorBanner, okNotify, koNotify, type FormIssue } from './shared/melis-form-errors'

/** Icône de tri neutre/asc/desc — mêmes tracés que lucide ArrowUpDown/ArrowUp/ArrowDown. */
function SortIcon({ dir }: { dir: 'asc' | 'desc' | null }) {
  const p = { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none' as const, stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, style: { flexShrink: 0, opacity: dir ? 1 : 0.3 } }
  if (dir === 'asc')  return <svg {...p}><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></svg>
  if (dir === 'desc') return <svg {...p}><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></svg>
  return <svg {...p}><path d="m21 16-4 4-4-4" /><path d="M17 20V4" /><path d="m3 8 4-4 4 4" /><path d="M7 4v16" /></svg>
}

// Outil Slider legacy (vue « Old » en iframe). melisKey = zone rendable (follow_regular_rendering:false).
export const MELIS_KEY = 'MelisCmsSlider_left_menu'
// Clé de capacités = melisKey du nœud porteur de droits du menu (cf. react.capabilities.php),
// PAS le melisKey d'accès `melis_cms_slider_tool` du contrôleur.
const CAPS_KEY = 'meliscms_slider_tools_section'
const can = makeCan(CAPS_KEY)

const COL_LABEL: Record<string, string> = { id: 'col_id', name: 'col_name', page: 'col_page', slides: 'col_slides' }
const DEFAULT_COLS: ColDef[] = [
  { id: 'id', visible: false }, { id: 'name', visible: true }, { id: 'page', visible: true }, { id: 'slides', visible: true },
]
const colStore = makeColStore('melis-slider-cols-v1', DEFAULT_COLS)

// Icône « renommer » (étiquette) — distincte du crayon, qui sert à éditer les slides.
const RenameIcon = () => <svg style={{ width: 15, height: 15, flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.41 2.41 0 0 0 3.414 0l6.586-6.586a2.41 2.41 0 0 0 0-3.414z" /><circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" /></svg>

// `mode` est piloté par SliderPage (il conditionne aussi la barre de sous-onglets React) — cf. SliderPage.
export default function SliderList({ active, onOpen, onDeleted, onRenamed, mode, onModeChange }: {
  active: boolean
  onOpen: (id: number, name: string) => void
  /** Slider supprimé → SliderPage referme son sous-onglet s'il était ouvert. */
  onDeleted: (id: number) => void
  /** Slider renommé → SliderPage met à jour l'étiquette de son sous-onglet. */
  onRenamed: (id: number, name: string) => void
  mode: ViewMode
  onModeChange: (m: ViewMode) => void
}) {
  const t = useT()
  const narrow = useIsNarrow()
  const [stats, setStats] = useState<SliderStats | null>(null)
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [toDelete, setToDelete] = useState<SliderItem | null>(null)
  const [editSlider, setEditSlider] = useState<SliderItem | 'new' | null>(null)
  const [tick, setTick] = useState(0)
  const [cols, setCols] = useState<ColDef[]>(colStore.load)
  const colsAnchorRef = useRef<HTMLDivElement>(null)
  const [showCols, setShowCols] = useState(false)
  const [showExport, setShowExport] = useState(false)
  // L'iframe « Old » est montée à la 1ʳᵉ activation puis GARDÉE montée (display:none) — état préservé.
  const [frameLoaded, setFrameLoaded] = useState(false)
  useEffect(() => { if (mode === 'iframe') setFrameLoaded(true) }, [mode])

  useEffect(() => { fetchSliderStats().then(setStats).catch(() => null) }, [tick])

  // Scroll infini + tri server-side + keyset (le tri client `sorted` est supprimé).
  const {
    items, total, loading, hasMore, sentinelRef, sortCol, sortDir, toggleSort, reload, removeLocal,
  } = useKeysetList<SliderItem>({
    fetcher: (a) => fetchSliders({ ...a, search }),
    deps: [search, tick],
    defaultSort: 'id',
    defaultDir: 'desc',
  })

  // Rafraîchir quand on revient sur la liste après un changement (flag stale).
  useEffect(() => { if (active && consumeSliderListStale()) setTick((x) => x + 1) }, [active])

  // A Hidden column disappears entirely on both desktop and mobile — same rule everywhere, no "+"
  // peek at Hidden ones. Desktop shows every Visible column inline. Mobile can't fit many columns,
  // so only the FIRST Visible column (by the user's dragged order in ColManager) anchors inline;
  // every OTHER Visible column surfaces behind the per-row "+" instead, in that same order.
  const shownColsList = cols.filter((c) => c.visible)
  const displayCols = narrow ? shownColsList.map((c, i) => ({ ...c, visible: i === 0 })) : shownColsList
  const hasHidden = narrow && shownColsList.length > 1
  const toggleExpand = (id: number) => setExpanded((prev) => {
    const next = new Set(prev)
    if (!next.delete(id)) next.add(id)
    return next
  })

  // Réinitialise recherche puis recharge depuis le début (`reload`).
  function resetFilters() {
    setSearchInput('')
    setSearch('')
    reload()
  }

  async function confirmDelete() {
    if (!toDelete) return
    try { await deleteSlider(toDelete.id); removeLocal((s) => s.id === toDelete.id); onDeleted(toDelete.id); setToDelete(null); setTick((x) => x + 1) }
    catch { setToDelete(null) }
  }

  return (
    <div style={{ ...pageWrap, ...(narrow ? { padding: 16 } : {}) }}>
      {/* En-tête : titre à gauche + contrôles à droite, TOUJOURS sur une seule ligne (un
          flex-wrap donnerait 2-3 barres pleine largeur empilées, pire que le desktop). Sur
          mobile le titre tronque (minWidth:0) et les contrôles passent en colonne : rangée
          d'icônes puis bouton « Nouveau » étiré à la largeur de cette rangée (width:100%). */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={narrow ? { minWidth: 0 } : undefined}>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, ...(narrow ? { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : {}) }}>{t('title')}</h1>
          <p style={{ fontSize: 14, color: 'var(--color-muted-foreground)', margin: '2px 0 0', ...(narrow ? { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : {}) }}>{t('subtitle')}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...(narrow ? { flexShrink: 0, flexDirection: 'column' } : {}) }}>
          <div style={narrow ? { display: 'flex', alignItems: 'center', gap: 8 } : { display: 'contents' }}>
            <ViewToggle mode={mode} compact={narrow} onChange={onModeChange} labels={{ react: t('view_new'), iframe: t('view_old') }} />
            <button style={btnGhost} onClick={() => setTick((x) => x + 1)} title={t('refresh')}>↻</button>
          </div>
          {can('create') && <button style={{ ...btnPrimary, ...(narrow ? { width: '100%', justifyContent: 'center' } : {}) }} onClick={() => setEditSlider('new')}><PlusIcon />{t('new')}</button>}
        </div>
      </div>

      {/* Vue « Old » : outil legacy en iframe */}
      {frameLoaded && (
        <div style={{ ...card, display: mode === 'iframe' ? 'flex' : 'none', flex: 1, minHeight: 480, overflow: 'hidden' }}>
          <iframe src={`/melis/react-tool-page?key=${encodeURIComponent(MELIS_KEY)}`}
            style={{ flex: 1, width: '100%', border: 0 }} title="Slider — Vue Melis"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals" />
        </div>
      )}

      {/* Vue « New » : liste React native */}
      <div style={{ display: mode === 'react' ? 'flex' : 'none', flexDirection: 'column', gap: 20 }}>
        {!can('list') ? (
          <div style={{ ...card, padding: '40px 16px', textAlign: 'center', fontSize: 14, color: 'var(--color-muted-foreground)' }}>{t('no_access')}</div>
        ) : (<>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Kpi label={t('kpi_sliders')} value={stats?.sliders ?? null} icon={<GalleryIcon />} tint="var(--color-primary)" />
            <Kpi label={t('kpi_slides')} value={stats?.slides ?? null} icon={<ImagesIcon />} tint="#2563eb" />
            <Kpi label={t('kpi_active')} value={stats?.active ?? null} icon={<CheckCircleIcon />} tint="#059669" />
          </div>

          {/* Barre de filtres — mobile : recherche pleine largeur, « Réinitialiser les filtres »
              seul sur sa ligne (libellé long en FR), puis Colonnes / Exporter à 50 % chacun. */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input style={{ ...inputCss, height: 36, flex: 1, minWidth: narrow ? 0 : 220, ...(narrow ? { flexBasis: '100%' } : {}) }} value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setSearch(searchInput.trim())}
              placeholder={t('search')} />
            <button style={{ ...btnGhost, height: 36, ...(narrow ? { flex: '1 1 100%', justifyContent: 'center' } : {}) }} onClick={resetFilters} {...ghostHover('var(--color-card)', 'var(--color-foreground)')}><ResetIcon />{t('reset_filters')}</button>
            <div ref={colsAnchorRef} style={{ position: 'relative', ...(narrow ? { flex: '1 1 calc(50% - 4px)' } : {}) }}>
              <button style={{ ...btnGhost, height: 36, ...(narrow ? { width: '100%', justifyContent: 'center' } : {}) }} onClick={() => setShowCols((v) => !v)}><GripIcon />{t('columns')}</button>
              {showCols && <ColManager anchorRef={colsAnchorRef} cols={cols} labelFor={(id) => t(COL_LABEL[id])} onChange={setCols} onSave={colStore.save} defaults={colStore.defaults} onClose={() => setShowCols(false)} />}
            </div>
            {can('export') && <button style={{ ...btnGhost, height: 36, ...(narrow ? { flex: '1 1 calc(50% - 4px)', justifyContent: 'center' } : {}) }} onClick={() => setShowExport(true)}><DownloadIcon />{t('export')}</button>}
          </div>

          {/* flexShrink:0 : cf. SliderEditor — sinon la carte est comprimée et rogne ses lignes. */}
          <div style={{ ...card, overflow: 'hidden', flexShrink: 0 }}>
            {/* minWidth retiré sur mobile : sinon le repli sur la colonne essentielle forcerait
                quand même un scroll horizontal. */}
            <table style={{ width: '100%', borderCollapse: 'collapse', ...(narrow ? {} : { minWidth: 560 }) }}>
              <thead style={{ background: 'var(--color-muted,rgba(0,0,0,.03))' }}>
                <tr>
                  {hasHidden && <th style={{ ...th, width: 32 }} />}
                  {visibleCols(displayCols).map(({ id }) => (
                    <th key={id} style={{ ...th, cursor: 'pointer', ...(id === 'id' ? { width: 70 } : {}), ...(sortCol === id ? { color: 'var(--color-primary)' } : {}) }}
                      onClick={() => toggleSort(id)}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>{t(COL_LABEL[id])}<SortIcon dir={sortCol === id ? sortDir : null} /></span>
                    </th>
                  ))}
                  <th style={{ ...th, width: 110 }} />
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && !loading ? (
                  <tr><td style={{ ...td, textAlign: 'center', color: 'var(--color-muted-foreground)', padding: '40px 16px' }} colSpan={visibleCols(displayCols).length + (hasHidden ? 1 : 0) + 1}>{t('empty')}</td></tr>
                ) : items.map((s) => (
                  <Fragment key={s.id}>
                  <tr>
                    {hasHidden && <td style={td}><ExpandToggle expanded={expanded.has(s.id)} onClick={() => toggleExpand(s.id)} /></td>}
                    {visibleCols(displayCols).map(({ id }) => (
                      <td key={id} style={{ ...td, ...(id === 'id' ? { color: 'var(--color-muted-foreground)', fontVariantNumeric: 'tabular-nums' } : {}) }}>
                        {id === 'id' && s.id}
                        {id === 'name' && (
                          <button onClick={() => onOpen(s.id, s.name)}
                            style={{ background: 'transparent', border: 0, padding: 0, color: 'var(--color-foreground)', fontSize: 14, fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
                            {s.name || t('none')}
                          </button>
                        )}
                        {id === 'page' && (s.pageId ?? t('none'))}
                        {id === 'slides' && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-muted-foreground)' }}>
                            <LayersIcon />{s.slideCount}
                          </span>
                        )}
                      </td>
                    ))}
                    <td style={td}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                        {can('open') && <button style={iconBtn} title={t('open')} onClick={() => onOpen(s.id, s.name)}><PencilIcon /></button>}
                        {can('rename') && <button style={iconBtn} title={t('rename')} onClick={() => setEditSlider(s)}><RenameIcon /></button>}
                        {can('delete') && <button style={{ ...iconBtn, color: 'var(--color-destructive,#ef4444)' }} title={t('del')} onClick={() => setToDelete(s)}><TrashIcon /></button>}
                      </div>
                    </td>
                  </tr>
                  {hasHidden && expanded.has(s.id) && (
                    <HiddenColsRow cols={displayCols} labelFor={(id) => t(COL_LABEL[id])}
                      renderValue={(id) => (id === 'id' ? s.id : id === 'name' ? (s.name || t('none')) : id === 'page' ? (s.pageId ?? t('none')) : id === 'slides' ? s.slideCount : '')}
                      colSpan={visibleCols(displayCols).length + 2} narrow={narrow} />
                  )}
                  </Fragment>
                ))}
              </tbody>
            </table>
            {/* Sentinel scroll infini : sa visibilité déclenche le lot suivant (keyset). */}
            <div ref={sentinelRef} style={{ height: 1 }} />
            <div style={{ padding: '10px 16px', textAlign: 'center', fontSize: 12, color: 'var(--color-muted-foreground)' }}>
              {loading ? t('loading') : (!hasMore && items.length > 0 ? t('count', { n: total }) : '')}
            </div>
          </div>
        </>)}
      </div>

      {toDelete && (
        <ConfirmModal title={t('del_slider_title')} message={t('del_slider_confirm', { n: toDelete.name || ('#' + toDelete.id) })}
          confirmLabel={t('del')} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
      )}

      {editSlider && (
        <SliderModal slider={editSlider === 'new' ? null : editSlider}
          onClose={() => setEditSlider(null)}
          onSaved={(name) => {
            // Renommage d'un slider déjà ouvert : son sous-onglet porte l'ancien nom → on le remonte.
            if (editSlider !== 'new') onRenamed(editSlider.id, name)
            setEditSlider(null); setTick((x) => x + 1)
          }} />
      )}

      {showExport && (
        <ExportModal<SliderItem>
          cols={cols}
          labelFor={(id) => t(COL_LABEL[id])}
          fetchAll={async () => {
            // Export = tout le jeu filtré : on boucle sur nextCursor (keyset) au lieu de limit:9999.
            const all: SliderItem[] = []
            let after: string | undefined
            for (;;) {
              const r = await fetchSliders({ search, sort: sortCol, dir: sortDir, after, limit: 100 })
              all.push(...r.items)
              if (!r.nextCursor) break
              after = r.nextCursor
            }
            return all
          }}
          getCell={(s, id) => id === 'id' ? s.id : id === 'name' ? s.name : id === 'page' ? (s.pageId ?? '') : id === 'slides' ? s.slideCount : ''}
          filename="sliders" sheetName={t('title')} total={total}
          onClose={() => setShowExport(false)} />
      )}
    </div>
  )
}

// ── Modale créer / renommer un slider ──
function SliderModal({ slider, onClose, onSaved }: { slider: SliderItem | null; onClose: () => void; onSaved: (name: string) => void }) {
  const t = useT()
  const isEdit = !!slider
  const [name, setName] = useState(slider?.name ?? '')
  const [pageId, setPageId] = useState<number>(slider?.pageId ?? 0)
  const [pageTitle, setPageTitle] = useState('')
  const [saving, setSaving] = useState(false)
  // Bannière d'erreur unifiée : `title` = en-tête traduit, `issues` = liste des champs fautifs
  // (validation client) OU l'erreur serveur (string), normalisée par collectIssues.
  const [err, setErr] = useState<{ title: string; issues?: unknown } | null>(null)
  const nameInvalid = !!err && !name.trim()

  async function submit() {
    // On collecte TOUS les champs manquants (ici : le nom) avant de sortir, pour que la
    // bannière les liste tous d'un coup plutôt qu'au premier échec rencontré.
    const issues: FormIssue[] = []
    if (!name.trim()) issues.push({ label: t('f_name'), message: t('field_required') })
    if (issues.length) { setErr({ title: t('check_fields'), issues }); return }
    setErr(null); setSaving(true)
    try {
      await saveSlider({ id: slider?.id ?? null, name: name.trim(), pageId: pageId ? pageId : null })
      okNotify(t('save_ok'))
      onSaved(name.trim())
    } catch (e) {
      const msg = e instanceof Error ? e.message : t('err_save')
      setErr({ title: t('err_save'), issues: msg })
      koNotify(t('err_save'), msg)
    }
    finally { setSaving(false) }
  }

  return (
    // padding sur l'overlay : sur mobile la carte collerait sinon aux bords (cf. ConfirmModal).
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, boxSizing: 'border-box', background: 'rgba(0,0,0,.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ ...card, width: '100%', maxWidth: 420 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{isEdit ? t('rename_slider_title') : t('new_slider_title')}</h2>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {err && <FormErrorBanner title={err.title} issues={err.issues} />}
          <div>
            <label style={label}>{t('f_name')}</label>
            <input style={{ ...inputCss, ...(nameInvalid ? { borderColor: '#ef4444' } : {}) }} value={name} onChange={(e) => setName(e.target.value)} placeholder={t('f_name_ph')} maxLength={255} autoFocus />
          </div>
          <div>
            <label style={label}>{t('f_page')}</label>
            <PagePicker value={pageId} title={pageTitle} onChange={(id, ttl) => { setPageId(id); setPageTitle(ttl) }}
              placeholder={t('f_page_ph')} noneLabel={t('f_page_none')} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '12px 16px', borderTop: '1px solid var(--color-border)' }}>
          <button style={btnGhost} onClick={onClose} disabled={saving}>{t('cancel')}</button>
          <button style={btnPrimary} onClick={submit} disabled={saving}>{saving ? '…' : t('save')}</button>
        </div>
      </div>
    </div>
  )
}
