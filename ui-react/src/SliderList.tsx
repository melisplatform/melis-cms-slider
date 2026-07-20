import { useEffect, useMemo, useRef, useState } from 'react'
import {
  fetchSliders, fetchSliderStats, saveSlider, deleteSlider,
  consumeSliderListStale, type SliderItem, type SliderStats,
} from './slider-api'
import {
  useT, makeCan, card, inputCss, btnPrimary, btnGhost, iconBtn, th, td, label, hint, pageWrap,
  PencilIcon, TrashIcon, PlusIcon, LayersIcon, GripIcon, ResetIcon, Kpi, ConfirmModal,
  ColManager, makeColStore, visibleCols, ghostHover, type ColDef,
} from './ui'
import { ExportModal, DownloadIcon } from './ExportModal'
import { ViewToggle, type ViewMode } from './ViewToggle'
import { PagePicker } from './PagePicker'

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
export default function SliderList({ active, onOpen, mode, onModeChange }: {
  active: boolean
  onOpen: (id: number, name: string) => void
  mode: ViewMode
  onModeChange: (m: ViewMode) => void
}) {
  const t = useT()
  const [items, setItems] = useState<SliderItem[]>([])
  const [stats, setStats] = useState<SliderStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [sortAsc, setSortAsc] = useState(false)
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
  useEffect(() => {
    setLoading(true)
    fetchSliders({ search }).then((r) => setItems(r.items)).catch(() => null).finally(() => setLoading(false))
  }, [search, tick])
  // Rafraîchir quand on revient sur la liste après un changement (flag stale).
  useEffect(() => { if (active && consumeSliderListStale()) setTick((x) => x + 1) }, [active])

  const sorted = useMemo(() => [...items].sort((a, b) => (sortAsc ? a.id - b.id : b.id - a.id)), [items, sortAsc])

  // Réinitialise recherche + tri par défaut, puis recharge. `setItems([])` est obligatoire :
  // sans ça les anciennes lignes restent affichées et le clic paraît sans effet.
  // `tick` est bumpé pour forcer le refetch même quand aucun filtre n'était posé.
  function resetFilters() {
    setSearchInput('')
    setSearch('')
    setSortAsc(false)
    setItems([])
    setTick((x) => x + 1)
  }

  async function confirmDelete() {
    if (!toDelete) return
    try { await deleteSlider(toDelete.id); setToDelete(null); setTick((x) => x + 1) }
    catch { setToDelete(null) }
  }

  return (
    <div style={pageWrap}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{t('title')}</h1>
          <p style={{ fontSize: 14, color: 'var(--color-muted-foreground)', margin: '2px 0 0' }}>{t('subtitle')}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ViewToggle mode={mode} onChange={onModeChange} />
          <button style={btnGhost} onClick={() => setTick((x) => x + 1)} title={t('refresh')}>↻</button>
          {can('create') && <button style={btnPrimary} onClick={() => setEditSlider('new')}><PlusIcon />{t('new')}</button>}
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
            <Kpi label={t('kpi_sliders')} value={stats?.sliders ?? null} />
            <Kpi label={t('kpi_slides')} value={stats?.slides ?? null} />
            <Kpi label={t('kpi_active')} value={stats?.active ?? null} />
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input style={{ ...inputCss, height: 36, flex: 1, minWidth: 220 }} value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setSearch(searchInput.trim())}
              placeholder={t('search')} />
            <button style={{ ...btnGhost, height: 36 }} onClick={resetFilters} {...ghostHover('var(--color-card)', 'var(--color-foreground)')}><ResetIcon />{t('reset_filters')}</button>
            <div ref={colsAnchorRef} style={{ position: 'relative' }}>
              <button style={{ ...btnGhost, height: 36 }} onClick={() => setShowCols((v) => !v)}><GripIcon />{t('columns')}</button>
              {showCols && <ColManager anchorRef={colsAnchorRef} cols={cols} labelFor={(id) => t(COL_LABEL[id])} onChange={setCols} onSave={colStore.save} defaults={colStore.defaults} onClose={() => setShowCols(false)} />}
            </div>
            {can('export') && <button style={{ ...btnGhost, height: 36 }} onClick={() => setShowExport(true)}><DownloadIcon />{t('export')}</button>}
          </div>

          {/* flexShrink:0 : cf. SliderEditor — sinon la carte est comprimée et rogne ses lignes. */}
          <div style={{ ...card, overflow: 'hidden', flexShrink: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
              <thead style={{ background: 'var(--color-muted,rgba(0,0,0,.03))' }}>
                <tr>
                  {visibleCols(cols).map(({ id }) => (
                    <th key={id} style={{ ...th, ...(id === 'id' ? { cursor: 'pointer', width: 70 } : {}) }}
                      onClick={id === 'id' ? () => setSortAsc((v) => !v) : undefined}>
                      {t(COL_LABEL[id])}{id === 'id' ? ` ${sortAsc ? '↑' : '↓'}` : ''}
                    </th>
                  ))}
                  <th style={{ ...th, width: 110 }} />
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 && !loading ? (
                  <tr><td style={{ ...td, textAlign: 'center', color: 'var(--color-muted-foreground)', padding: '40px 16px' }} colSpan={visibleCols(cols).length + 1}>{t('empty')}</td></tr>
                ) : sorted.map((s) => (
                  <tr key={s.id}>
                    {visibleCols(cols).map(({ id }) => (
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
                ))}
              </tbody>
            </table>
            <div style={{ padding: '10px 16px', textAlign: 'center', fontSize: 12, color: 'var(--color-muted-foreground)' }}>
              {loading ? t('loading') : t('count', { n: items.length })}
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
          onSaved={() => { setEditSlider(null); setTick((x) => x + 1) }} />
      )}

      {showExport && (
        <ExportModal<SliderItem>
          cols={cols}
          labelFor={(id) => t(COL_LABEL[id])}
          fetchAll={async () => (await fetchSliders({ search })).items}
          getCell={(s, id) => id === 'id' ? s.id : id === 'name' ? s.name : id === 'page' ? (s.pageId ?? '') : id === 'slides' ? s.slideCount : ''}
          filename="sliders" sheetName={t('title')} total={items.length}
          onClose={() => setShowExport(false)} />
      )}
    </div>
  )
}

// ── Modale créer / renommer un slider ──
function SliderModal({ slider, onClose, onSaved }: { slider: SliderItem | null; onClose: () => void; onSaved: () => void }) {
  const t = useT()
  const isEdit = !!slider
  const [name, setName] = useState(slider?.name ?? '')
  const [pageId, setPageId] = useState<number>(slider?.pageId ?? 0)
  const [pageTitle, setPageTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    setError(null)
    if (!name.trim()) { setError(t('f_name') + ' *'); return }
    setSaving(true)
    try {
      await saveSlider({ id: slider?.id ?? null, name: name.trim(), pageId: pageId ? pageId : null })
      onSaved()
    } catch (e) { setError(e instanceof Error ? e.message : t('err_save')) }
    finally { setSaving(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ ...card, width: '100%', maxWidth: 420 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{isEdit ? t('rename_slider_title') : t('new_slider_title')}</h2>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && <div style={{ ...card, borderColor: '#fca5a5', background: '#fef2f2', color: '#b91c1c', padding: '8px 12px', fontSize: 13 }}>{error}</div>}
          <div>
            <label style={label}>{t('f_name')}</label>
            <input style={inputCss} value={name} onChange={(e) => setName(e.target.value)} placeholder={t('f_name_ph')} maxLength={255} autoFocus />
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
