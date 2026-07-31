import { Fragment, useEffect, useRef, useState, type DragEvent } from 'react'
import { fetchSlides, deleteSlide, reorderSlides, type SlideItem } from './slider-api'
import {
  useT, makeCan, card, btnPrimary, btnGhost, iconBtn, th, td, pageWrap,
  PencilIcon, TrashIcon, PlusIcon, GripIcon, ImageIcon, ConfirmModal,
  ColManager, makeColStore, visibleCols, type ColDef,
} from './ui'
import SlideEditor from './SlideEditor'
import { useIsNarrow } from './shared/useIsNarrow'
import { ExpandToggle, HiddenColsRow } from './shared/ExpandableRow'

/* Niveau 2 — liste des slides d'un slider (slider > SLIDES > slide). Réordonnancement
 * par glisser-déposer (HTML5 DnD) → reorderSlides. Ouvre/édite une slide via SlideEditor. */

const can = makeCan('meliscms_slider_tools_section') // nœud porteur de droits (cf. react.capabilities.php)
type SlideView = { kind: 'list' } | { kind: 'new' } | { kind: 'edit'; id: number }

const COL_LABEL: Record<string, string> = { id: 'col_id', status: 's_status', image: 's_image', title: 's_title', sub1: 's_sub1', link: 's_link', order: 's_order' }
const DEFAULT_COLS: ColDef[] = [
  { id: 'id', visible: true }, { id: 'status', visible: true }, { id: 'image', visible: true },
  { id: 'title', visible: true }, { id: 'sub1', visible: true }, { id: 'link', visible: true },
]
// v2 : ajout de la colonne ID. Bump de la clé → l'ordre par défaut s'applique (sinon `loadCols`
// appenderait la nouvelle colonne EN FIN de la liste déjà persistée en localStorage).
const colStore = makeColStore('melis-slider-slides-cols-v2', DEFAULT_COLS)

// Mobile : une seule colonne essentielle (le titre identifie la slide) → [poignée][+][titre][actions].
// La colonne « Ordre » n'est pas gérée par le ColManager : on l'ajoute en colonne MASQUÉE virtuelle
// sur mobile pour qu'elle reste consultable dans le détail dépliable.
const ESSENTIAL_COLS = new Set(['title'])

export default function SliderEditor({ sliderId, sliderName, onSaved }: {
  sliderId: number
  sliderName: string
  onSaved: () => void
}) {
  const t = useT()
  const narrow = useIsNarrow()
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const [view, setView] = useState<SlideView>({ kind: 'list' })
  const [slides, setSlides] = useState<SlideItem[]>([])
  const [loading, setLoading] = useState(false)
  const [toDelete, setToDelete] = useState<SlideItem | null>(null)
  const [dragId, setDragId] = useState<number | null>(null)
  const [overId, setOverId] = useState<number | null>(null)
  const [tick, setTick] = useState(0)
  const [cols, setCols] = useState<ColDef[]>(colStore.load)
  const colsAnchorRef = useRef<HTMLDivElement>(null)
  const [showCols, setShowCols] = useState(false)

  useEffect(() => {
    if (view.kind !== 'list') return
    setLoading(true)
    fetchSlides(sliderId).then((r) => setSlides(r.items)).catch(() => null).finally(() => setLoading(false))
  }, [sliderId, view.kind, tick])

  async function confirmDelete() {
    if (!toDelete) return
    try { await deleteSlide(toDelete.id); setToDelete(null); setTick((x) => x + 1); onSaved() }
    catch { setToDelete(null) }
  }

  async function handleDrop(targetId: number, e: DragEvent<HTMLTableRowElement>) {
    // `dragId` (état React) suffit en pratique, mais on retombe sur la charge du dataTransfer :
    // c'est la source de vérité du navigateur, et elle survit à un remount pendant le drag.
    const srcId = dragId ?? (Number(e.dataTransfer.getData('text/plain')) || null)
    if (srcId == null || srcId === targetId) { setDragId(null); setOverId(null); return }
    const from = slides.findIndex((s) => s.id === srcId)
    const to = slides.findIndex((s) => s.id === targetId)
    if (from === -1 || to === -1) { setDragId(null); setOverId(null); return }
    const next = [...slides]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    setSlides(next.map((s, i) => ({ ...s, order: i + 1 })))
    setDragId(null); setOverId(null)
    try { await reorderSlides(sliderId, next.map((s) => s.id)) } catch { setTick((x) => x + 1) }
  }

  // cf. SliderList : `hasHidden` dépend de `narrow` SEUL — un utilisateur desktop qui masque une
  // colonne via le ColManager ne doit pas voir surgir une colonne « + » inexistante jusque-là.
  const displayCols = narrow
    ? [...cols.map((c) => ({ ...c, visible: ESSENTIAL_COLS.has(c.id) })), { id: 'order', visible: false }]
    : cols
  const hasHidden = narrow
  const toggleExpand = (id: number) => setExpanded((prev) => {
    const next = new Set(prev)
    if (!next.delete(id)) next.add(id)
    return next
  })

  if (view.kind !== 'list') {
    return (
      <SlideEditor sliderId={sliderId} slideId={view.kind === 'edit' ? view.id : 'new'}
        onBack={() => setView({ kind: 'list' })}
        onSaved={() => { setView({ kind: 'list' }); setTick((x) => x + 1); onSaved() }} />
    )
  }

  return (
    <div style={{ ...pageWrap, ...(narrow ? { padding: 16 } : {}) }}>
      {/* Titre à gauche + « Ajouter une slide » à droite, une seule ligne. Sur mobile le titre
          tronque et le bouton garde sa place (flexShrink:0) plutôt que d'empiler deux barres. */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={narrow ? { minWidth: 0 } : undefined}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, ...(narrow ? { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : {}) }}>{t('slides_of', { n: sliderName || ('#' + sliderId) })}</h2>
          <p style={{ fontSize: 13, color: 'var(--color-muted-foreground)', margin: '2px 0 0', ...(narrow ? { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : {}) }}>{t('reorder_hint')}</p>
        </div>
        {can('slides.create') && <button style={{ ...btnPrimary, ...(narrow ? { flexShrink: 0, padding: '0 10px' } : {}) }} onClick={() => setView({ kind: 'new' })}><PlusIcon />{t('add_slide')}</button>}
      </div>

      {!can('slides.list') ? (
        <div style={{ ...card, padding: '40px 16px', textAlign: 'center', fontSize: 14, color: 'var(--color-muted-foreground)' }}>{t('no_access')}</div>
      ) : (<>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div ref={colsAnchorRef} style={{ position: 'relative', ...(narrow ? { flex: 1 } : {}) }}>
          <button style={{ ...btnGhost, height: 36, ...(narrow ? { width: '100%', justifyContent: 'center' } : {}) }} onClick={() => setShowCols((v) => !v)}><GripIcon />{t('columns')}</button>
          {showCols && <ColManager anchorRef={colsAnchorRef} cols={cols} labelFor={(id) => t(COL_LABEL[id])} onChange={setCols} onSave={colStore.save} defaults={colStore.defaults} onClose={() => setShowCols(false)} />}
        </div>
      </div>
      {/* flexShrink:0 — sans lui, la carte (flex-item de `pageWrap`, en colonne) se COMPRIME à la
          hauteur restante et, comme elle est `overflow:hidden`, les lignes en trop sont ROGNÉES au
          lieu de faire défiler la page. */}
      <div style={{ ...card, overflow: 'hidden', flexShrink: 0 }}>
        {/* minWidth retiré sur mobile (sinon scroll horizontal malgré le repli de colonnes) ; la
            colonne « Ordre » y passe dans le détail dépliable. */}
        <table style={{ width: '100%', borderCollapse: 'collapse', ...(narrow ? {} : { minWidth: 640 }) }}>
          <thead style={{ background: 'var(--color-muted,rgba(0,0,0,.03))' }}>
            <tr>
              <th style={{ ...th, width: 40 }} />
              {hasHidden && <th style={{ ...th, width: 32 }} />}
              {!narrow && <th style={{ ...th, width: 50 }}>{t('s_order')}</th>}
              {visibleCols(displayCols).map(({ id }) => (
                <th key={id} style={{ ...th, ...(id === 'id' ? { width: 70 } : id === 'status' ? { width: 70 } : id === 'image' ? { width: 80 } : {}) }}>{t(COL_LABEL[id])}</th>
              ))}
              <th style={{ ...th, width: 80 }} />
            </tr>
          </thead>
          <tbody>
            {slides.length === 0 && !loading ? (
              <tr><td style={{ ...td, textAlign: 'center', color: 'var(--color-muted-foreground)', padding: '40px 16px' }} colSpan={visibleCols(displayCols).length + (hasHidden ? 1 : 0) + (narrow ? 2 : 3)}>{t('no_slides')}</td></tr>
            ) : slides.map((s) => (
              <Fragment key={s.id}>
              <tr
                draggable={can('slides.edit')}
                // ⚠️ setData() est OBLIGATOIRE : sans au moins une entrée dans le drag data store,
                // Firefox et Safari ANNULENT le drag au dragstart → dragover/drop ne se déclenchent
                // jamais et le réordonnancement ne partait pas (Chromium, lui, tolère l'oubli).
                onDragStart={(e) => {
                  if (!can('slides.edit')) return
                  e.dataTransfer.effectAllowed = 'move'
                  e.dataTransfer.setData('text/plain', String(s.id))
                  setDragId(s.id)
                }}
                onDragEnd={() => { setDragId(null); setOverId(null) }}
                onDragOver={(e) => { if (!can('slides.edit')) return; e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (overId !== s.id) setOverId(s.id) }}
                onDrop={(e) => { if (!can('slides.edit')) return; e.preventDefault(); handleDrop(s.id, e) }}
                style={{
                  cursor: can('slides.edit') ? 'grab' : 'default', opacity: dragId === s.id ? 0.4 : 1,
                  background: overId === s.id && dragId !== s.id ? 'color-mix(in srgb, var(--color-primary) 8%, transparent)' : 'transparent',
                }}>
                <td style={{ ...td, color: 'var(--color-muted-foreground)', textAlign: 'center' }}><GripIcon /></td>
                {hasHidden && <td style={td}><ExpandToggle expanded={expanded.has(s.id)} onClick={() => toggleExpand(s.id)} /></td>}
                {!narrow && <td style={{ ...td, color: 'var(--color-muted-foreground)', fontVariantNumeric: 'tabular-nums' }}>{s.order}</td>}
                {visibleCols(displayCols).map(({ id }) => (
                  <td key={id} style={{
                    ...td,
                    ...(id === 'id' ? { color: 'var(--color-muted-foreground)', fontVariantNumeric: 'tabular-nums' } : {}),
                    ...(id === 'sub1' ? { color: 'var(--color-muted-foreground)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : {}),
                    ...(id === 'link' ? { fontFamily: 'monospace', fontSize: 12, color: 'var(--color-muted-foreground)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : {}),
                  }}>
                    {id === 'id' && s.id}
                    {id === 'status' && (
                      <span title={s.status ? t('active') : t('inactive')} style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 999, background: s.status ? '#22c55e' : '#ef4444' }} />
                    )}
                    {id === 'image' && (
                      s.img
                        ? <img src={s.img} alt="" style={{ width: 56, height: 34, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--color-border)' }} />
                        : <span style={{ color: 'var(--color-muted-foreground)', display: 'inline-flex' }}><ImageIcon /></span>
                    )}
                    {id === 'title' && (s.title || <span style={{ color: 'var(--color-muted-foreground)' }}>—</span>)}
                    {id === 'sub1' && s.sub1}
                    {id === 'link' && s.link}
                  </td>
                ))}
                <td style={td}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                    {can('slides.edit') && <button style={iconBtn} title={t('edit')} onClick={() => setView({ kind: 'edit', id: s.id })}><PencilIcon /></button>}
                    {can('slides.delete') && <button style={{ ...iconBtn, color: 'var(--color-destructive,#ef4444)' }} title={t('del')} onClick={() => setToDelete(s)}><TrashIcon /></button>}
                  </div>
                </td>
              </tr>
              {hasHidden && expanded.has(s.id) && (
                <HiddenColsRow cols={displayCols} labelFor={(id) => t(COL_LABEL[id])}
                  renderValue={(id) => (
                    id === 'id' ? s.id
                      : id === 'order' ? s.order
                      : id === 'status' ? (s.status ? t('active') : t('inactive'))
                      : id === 'image' ? (s.img ? <img src={s.img} alt="" style={{ width: 56, height: 34, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--color-border)' }} /> : '—')
                      : id === 'title' ? (s.title || '—')
                      : id === 'sub1' ? s.sub1
                      : id === 'link' ? s.link
                      : ''
                  )}
                  colSpan={visibleCols(displayCols).length + 3} narrow={narrow} />
              )}
              </Fragment>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '10px 16px', textAlign: 'center', fontSize: 12, color: 'var(--color-muted-foreground)' }}>
          {loading ? t('loading') : t('count_slides', { n: slides.length })}
        </div>
      </div>
      </>)}

      {toDelete && (
        <ConfirmModal title={t('del_slide_title')} message={t('del_slide_confirm')}
          confirmLabel={t('del')} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
      )}
    </div>
  )
}
