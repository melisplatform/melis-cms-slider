import { useEffect, useState } from 'react'
import { fetchSlides, deleteSlide, reorderSlides, type SlideItem } from './slider-api'
import {
  useT, makeCan, card, btnPrimary, btnGhost, iconBtn, th, td, pageWrap,
  PencilIcon, TrashIcon, PlusIcon, GripIcon, ImageIcon, ConfirmModal,
} from './ui'
import SlideEditor from './SlideEditor'

/* Niveau 2 — liste des slides d'un slider (slider > SLIDES > slide). Réordonnancement
 * par glisser-déposer (HTML5 DnD) → reorderSlides. Ouvre/édite une slide via SlideEditor. */

const can = makeCan('meliscms_slider_tools_section') // nœud porteur de droits (cf. react.capabilities.php)
type SlideView = { kind: 'list' } | { kind: 'new' } | { kind: 'edit'; id: number }

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
      ) : (
      <div style={{ ...card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
          <thead style={{ background: 'var(--color-muted,rgba(0,0,0,.03))' }}>
            <tr>
              <th style={{ ...th, width: 40 }} />
              <th style={{ ...th, width: 50 }}>{t('s_order')}</th>
              <th style={{ ...th, width: 70 }}>{t('s_status')}</th>
              <th style={{ ...th, width: 80 }}>{t('s_image')}</th>
              <th style={th}>{t('s_title')}</th>
              <th style={th}>{t('s_sub1')}</th>
              <th style={th}>{t('s_link')}</th>
              <th style={{ ...th, width: 80 }} />
            </tr>
          </thead>
          <tbody>
            {slides.length === 0 && !loading ? (
              <tr><td style={{ ...td, textAlign: 'center', color: 'var(--color-muted-foreground)', padding: '40px 16px' }} colSpan={8}>{t('no_slides')}</td></tr>
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
                <td style={td}>
                  <span title={s.status ? t('active') : t('inactive')} style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 999, background: s.status ? '#22c55e' : '#ef4444' }} />
                </td>
                <td style={td}>
                  {s.img
                    ? <img src={s.img} alt="" style={{ width: 56, height: 34, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--color-border)' }} />
                    : <span style={{ color: 'var(--color-muted-foreground)', display: 'inline-flex' }}><ImageIcon /></span>}
                </td>
                <td style={td}>{s.title || <span style={{ color: 'var(--color-muted-foreground)' }}>—</span>}</td>
                <td style={{ ...td, color: 'var(--color-muted-foreground)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.sub1}</td>
                <td style={{ ...td, fontFamily: 'monospace', fontSize: 12, color: 'var(--color-muted-foreground)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.link}</td>
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
      )}

      {toDelete && (
        <ConfirmModal title={t('del_slide_title')} message={t('del_slide_confirm')}
          confirmLabel={t('del')} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
      )}
    </div>
  )
}
