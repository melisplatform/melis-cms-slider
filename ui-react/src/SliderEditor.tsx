import { useEffect, useState } from 'react'
import { fetchSlides, deleteSlide, reorderSlides, type SlideItem } from './slider-api'
import {
  useT, makeCan, card, btnPrimary, btnGhost, iconBtn, th, td, pageWrap,
  PencilIcon, TrashIcon, PlusIcon, GripIcon, ImageIcon, ConfirmModal,
  ColManager, makeColStore, visibleCols, type ColDef,
} from './ui'
import SlideEditor from './SlideEditor'

/* Niveau 2 — liste des slides d'un slider (slider > SLIDES > slide). Réordonnancement
 * par glisser-déposer (HTML5 DnD) → reorderSlides. Ouvre/édite une slide via SlideEditor. */

const can = makeCan('meliscms_slider_tools_section') // nœud porteur de droits (cf. react.capabilities.php)
type SlideView = { kind: 'list' } | { kind: 'new' } | { kind: 'edit'; id: number }

const COL_LABEL: Record<string, string> = { status: 's_status', image: 's_image', title: 's_title', sub1: 's_sub1', link: 's_link' }
const DEFAULT_COLS: ColDef[] = [
  { id: 'status', visible: true }, { id: 'image', visible: true }, { id: 'title', visible: true },
  { id: 'sub1', visible: true }, { id: 'link', visible: true },
]
const colStore = makeColStore('melis-slider-slides-cols-v1', DEFAULT_COLS)

export default function SliderEditor({ sliderId, sliderName, onSaved }: {
  sliderId: number
  sliderName: string
  onSaved: () => void
}) {
  const t = useT()
  const [view, setView] = useState<SlideView>({ kind: 'list' })
  const [slides, setSlides] = useState<SlideItem[]>([])
  const [loading, setLoading] = useState(false)
  const [toDelete, setToDelete] = useState<SlideItem | null>(null)
  const [dragId, setDragId] = useState<number | null>(null)
  const [overId, setOverId] = useState<number | null>(null)
  const [tick, setTick] = useState(0)
  const [cols, setCols] = useState<ColDef[]>(colStore.load)
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

  async function handleDrop(targetId: number) {
    if (dragId == null || dragId === targetId) { setDragId(null); setOverId(null); return }
    const from = slides.findIndex((s) => s.id === dragId)
    const to = slides.findIndex((s) => s.id === targetId)
    if (from === -1 || to === -1) { setDragId(null); setOverId(null); return }
    const next = [...slides]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    setSlides(next.map((s, i) => ({ ...s, order: i + 1 })))
    setDragId(null); setOverId(null)
    try { await reorderSlides(sliderId, next.map((s) => s.id)) } catch { setTick((x) => x + 1) }
  }

  if (view.kind !== 'list') {
    return (
      <SlideEditor sliderId={sliderId} slideId={view.kind === 'edit' ? view.id : 'new'}
        onBack={() => setView({ kind: 'list' })}
        onSaved={() => { setView({ kind: 'list' }); setTick((x) => x + 1); onSaved() }} />
    )
  }

  return (
    <div style={pageWrap}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{t('slides_of', { n: sliderName || ('#' + sliderId) })}</h2>
          <p style={{ fontSize: 13, color: 'var(--color-muted-foreground)', margin: '2px 0 0' }}>{t('reorder_hint')}</p>
        </div>
        {can('slides.create') && <button style={btnPrimary} onClick={() => setView({ kind: 'new' })}><PlusIcon />{t('add_slide')}</button>}
      </div>

      {!can('slides.list') ? (
        <div style={{ ...card, padding: '40px 16px', textAlign: 'center', fontSize: 14, color: 'var(--color-muted-foreground)' }}>{t('no_access')}</div>
      ) : (<>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ position: 'relative' }}>
          <button style={{ ...btnGhost, height: 36 }} onClick={() => setShowCols((v) => !v)}><GripIcon />{t('columns')}</button>
          {showCols && <ColManager cols={cols} labelFor={(id) => t(COL_LABEL[id])} onChange={setCols} onSave={colStore.save} defaults={colStore.defaults} onClose={() => setShowCols(false)} />}
        </div>
      </div>
      <div style={{ ...card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
          <thead style={{ background: 'var(--color-muted,rgba(0,0,0,.03))' }}>
            <tr>
              <th style={{ ...th, width: 40 }} />
              <th style={{ ...th, width: 50 }}>{t('s_order')}</th>
              {visibleCols(cols).map(({ id }) => (
                <th key={id} style={{ ...th, ...(id === 'status' ? { width: 70 } : id === 'image' ? { width: 80 } : {}) }}>{t(COL_LABEL[id])}</th>
              ))}
              <th style={{ ...th, width: 80 }} />
            </tr>
          </thead>
          <tbody>
            {slides.length === 0 && !loading ? (
              <tr><td style={{ ...td, textAlign: 'center', color: 'var(--color-muted-foreground)', padding: '40px 16px' }} colSpan={visibleCols(cols).length + 3}>{t('no_slides')}</td></tr>
            ) : slides.map((s) => (
              <tr key={s.id}
                draggable={can('slides.edit')}
                onDragStart={() => can('slides.edit') && setDragId(s.id)}
                onDragEnd={() => { setDragId(null); setOverId(null) }}
                onDragOver={(e) => { if (!can('slides.edit')) return; e.preventDefault(); if (overId !== s.id) setOverId(s.id) }}
                onDrop={(e) => { if (!can('slides.edit')) return; e.preventDefault(); handleDrop(s.id) }}
                style={{
                  cursor: can('slides.edit') ? 'grab' : 'default', opacity: dragId === s.id ? 0.4 : 1,
                  background: overId === s.id && dragId !== s.id ? 'color-mix(in srgb, var(--color-primary) 8%, transparent)' : 'transparent',
                }}>
                <td style={{ ...td, color: 'var(--color-muted-foreground)', textAlign: 'center' }}><GripIcon /></td>
                <td style={{ ...td, color: 'var(--color-muted-foreground)', fontVariantNumeric: 'tabular-nums' }}>{s.order}</td>
                {visibleCols(cols).map(({ id }) => (
                  <td key={id} style={{
                    ...td,
                    ...(id === 'sub1' ? { color: 'var(--color-muted-foreground)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : {}),
                    ...(id === 'link' ? { fontFamily: 'monospace', fontSize: 12, color: 'var(--color-muted-foreground)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : {}),
                  }}>
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
            ))}
          </tbody>
        </table>
        {loading && <div style={{ padding: '10px 16px', textAlign: 'center', fontSize: 12, color: 'var(--color-muted-foreground)' }}>{t('loading')}</div>}
      </div>
      </>)}

      {toDelete && (
        <ConfirmModal title={t('del_slide_title')} message={t('del_slide_confirm')}
          confirmLabel={t('del')} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
      )}
    </div>
  )
}
