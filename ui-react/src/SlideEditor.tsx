import { useEffect, useRef, useState } from 'react'
import { fetchSlide, saveSlide, uploadSlideImage } from './slider-api'
import {
  useT, card, inputCss, textareaCss, btnPrimary, btnGhost, label, hint,
  ImageIcon, TrashIcon,
} from './ui'

/* Niveau 3 — formulaire d'une slide (slider > slides > SLIDE). Upload d'image immédiat
 * (renvoie un chemin web stocké tel quel dans mcsdetail_img). sub2/sub3 = HTML (textarea). */

export default function SlideEditor({ sliderId, slideId, onBack, onSaved }: {
  sliderId: number
  slideId: number | 'new'
  onBack: () => void
  onSaved: () => void
}) {
  const t = useT()
  const isEdit = slideId !== 'new'
  const fileRef = useRef<HTMLInputElement>(null)

  const [status, setStatus] = useState(1)
  const [title, setTitle] = useState('')
  const [sub1, setSub1] = useState('')
  const [sub2, setSub2] = useState('')
  const [sub3, setSub3] = useState('')
  const [link, setLink] = useState('')
  const [img, setImg] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    setLoading(true)
    fetchSlide(slideId as number)
      .then((s) => { setStatus(s.status); setTitle(s.title); setSub1(s.sub1); setSub2(s.sub2); setSub3(s.sub3); setLink(s.link); setImg(s.img) })
      .catch((e) => setError(e instanceof Error ? e.message : t('err_save')))
      .finally(() => setLoading(false))
  }, [slideId])

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null); setUploading(true)
    try {
      const { path } = await uploadSlideImage(sliderId, file)
      setImg(path)
    } catch (err) { setError(err instanceof Error ? err.message : t('err_save')) }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = '' }
  }

  async function submit() {
    setError(null); setSaving(true)
    try {
      await saveSlide({
        id: isEdit ? (slideId as number) : null,
        sliderId, status, title, sub1, sub2, sub3, link, img,
      })
      setSaved(true)
      setTimeout(() => onSaved(), 400)
    } catch (e) { setError(e instanceof Error ? e.message : t('err_save')) }
    finally { setSaving(false) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 24, height: '100%', boxSizing: 'border-box', overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button style={{ ...btnGhost, height: 32, padding: '0 10px' }} onClick={onBack}>← {t('back')}</button>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{isEdit ? t('edit_slide_title') : t('new_slide_title')}</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {saved && <span style={{ fontSize: 14, color: '#059669' }}>{t('saved')}</span>}
          <button style={btnPrimary} onClick={submit} disabled={saving || loading || uploading}>{saving ? '…' : t('save')}</button>
        </div>
      </div>

      {error && <div style={{ ...card, borderColor: '#fca5a5', background: '#fef2f2', color: '#b91c1c', padding: '8px 14px', fontSize: 14 }}>{error}</div>}

      {loading ? (
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--color-muted-foreground)' }}>{t('loading')}</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: 16, alignItems: 'start' }}>
          {/* Colonne contenu */}
          <div style={{ ...card, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={label}>{t('f_title')}</label>
              <input style={inputCss} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={255} />
            </div>
            <div>
              <label style={label}>{t('f_sub1')}</label>
              <input style={inputCss} value={sub1} onChange={(e) => setSub1(e.target.value)} maxLength={255} />
            </div>
            <div>
              <label style={label}>{t('f_sub2')}</label>
              <textarea style={textareaCss} value={sub2} onChange={(e) => setSub2(e.target.value)} />
            </div>
            <div>
              <label style={label}>{t('f_sub3')}</label>
              <textarea style={textareaCss} value={sub3} onChange={(e) => setSub3(e.target.value)} />
            </div>
            <div>
              <label style={label}>{t('f_link')}</label>
              <input style={{ ...inputCss, fontFamily: 'monospace' }} value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://…" />
            </div>
          </div>

          {/* Colonne options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ ...card, padding: 20 }}>
              <label style={label}>{t('f_status')}</label>
              <button onClick={() => setStatus((s) => (s ? 0 : 1))}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 36, padding: '0 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-card)', cursor: 'pointer', fontSize: 14, color: 'var(--color-foreground)' }}>
                <span style={{ width: 34, height: 20, borderRadius: 999, background: status ? '#10b981' : '#ef4444', position: 'relative', transition: 'background .15s' }}>
                  <span style={{ position: 'absolute', top: 2, left: status ? 16 : 2, width: 16, height: 16, borderRadius: 999, background: '#fff', transition: 'left .15s' }} />
                </span>
                {status ? t('active') : t('inactive')}
              </button>
            </div>

            <div style={{ ...card, padding: 20 }}>
              <label style={label}>{t('f_image')}</label>
              {img ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <img src={img} alt="" style={{ width: '100%', height: 'auto', maxHeight: 180, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-muted,#f3f4f6)' }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ ...btnGhost, height: 32 }} onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? t('uploading') : t('choose_img')}</button>
                    <button style={{ ...btnGhost, height: 32, color: 'var(--color-destructive,#ef4444)' }} onClick={() => setImg('')}><TrashIcon />{t('remove_img')}</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => fileRef.current?.click()} disabled={uploading}
                  style={{ ...card, width: '100%', minHeight: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, border: '1px dashed var(--color-border)', cursor: 'pointer', color: 'var(--color-muted-foreground)', background: 'transparent' }}>
                  <ImageIcon />{uploading ? t('uploading') : t('choose_img')}
                </button>
              )}
              <p style={hint}>{t('f_image_hint')}</p>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" style={{ display: 'none' }} onChange={onPickFile} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
