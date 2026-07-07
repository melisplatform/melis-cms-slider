import { useState, type CSSProperties } from 'react'

/* ──────────────────────────────────────────────────────────────────────────
 * Briques partagées de l'outil Slider (brique MelisCmsSlider) : i18n FR/EN,
 * styles inline (variables CSS du thème de l'hôte), icônes SVG, gestionnaire
 * de colonnes (masquer + réordonner) et carte KPI. La brique ne peut PAS
 * importer les modules de l'hôte (Tailwind/shadcn/lucide/i18n).
 * ────────────────────────────────────────────────────────────────────────── */

// ── i18n ──
export type Lang = 'fr' | 'en'
export function currentLang(): Lang {
  return (document.documentElement.lang || 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en'
}
const DICT: Record<Lang, Record<string, string>> = {
  fr: {
    title: 'Sliders', subtitle: 'Carrousels et leurs slides',
    new: 'Nouveau slider', search: 'Rechercher un slider…',
    empty: 'Aucun slider trouvé', count: '{n} sliders — fin de la liste',
    kpi_sliders: 'Sliders', kpi_slides: 'Slides', kpi_active: 'Slides actives',
    col_id: 'ID', col_name: 'Nom', col_page: 'Page liée', col_slides: 'Slides',
    columns: 'Colonnes', export: 'Exporter', cols_visible: 'Visibles', cols_hidden: 'Masquées', drag_here: 'Glisser ici', reset: 'Réinitialiser',
    edit: 'Modifier', open: 'Ouvrir les slides', rename: 'Renommer', del: 'Supprimer', cancel: 'Annuler', save: 'Enregistrer', back: 'Retour',
    refresh: 'Rafraîchir', loading: 'Chargement…', saved: 'Enregistré ✓', none: '—',
    del_slider_title: 'Supprimer le slider', del_slider_confirm: 'Supprimer « {n} » et toutes ses slides ? Action irréversible.',
    new_slider_title: 'Nouveau slider', rename_slider_title: 'Renommer le slider',
    f_name: 'Nom du slider', f_name_ph: 'Mon slider', f_page: 'Page liée (optionnel)', f_page_ph: '— Choisir une page —', f_page_none: '— Aucune —',
    err_save: 'Erreur lors de la sauvegarde', no_access: 'Vous n’avez pas les droits pour consulter cette liste.',
    // niveau slides
    slides_of: 'Slides de « {n} »', add_slide: 'Ajouter une slide', no_slides: 'Aucune slide. Cliquez sur « Ajouter une slide ».',
    s_order: 'Ordre', s_status: 'Statut', s_image: 'Image', s_title: 'Titre', s_sub1: 'Sous-titre', s_link: 'Lien',
    active: 'Active', inactive: 'Inactive', reorder_hint: 'Glissez une ligne pour réordonner.',
    del_slide_title: 'Supprimer la slide', del_slide_confirm: 'Supprimer cette slide ? Action irréversible.',
    // niveau slide (form)
    new_slide_title: 'Nouvelle slide', edit_slide_title: 'Modifier la slide',
    f_status: 'Active', f_title: 'Titre', f_sub1: 'Sous-titre 1', f_sub2: 'Description 1 (HTML)', f_sub3: 'Description 2 (HTML)',
    f_link: 'Lien', f_image: 'Image', f_image_hint: 'JPG, PNG, GIF ou WebP.', uploading: 'Envoi…', remove_img: 'Retirer l’image', choose_img: 'Choisir une image',
  },
  en: {
    title: 'Sliders', subtitle: 'Carousels and their slides',
    new: 'New slider', search: 'Search a slider…',
    empty: 'No slider found', count: '{n} sliders — end of list',
    kpi_sliders: 'Sliders', kpi_slides: 'Slides', kpi_active: 'Active slides',
    col_id: 'ID', col_name: 'Name', col_page: 'Linked page', col_slides: 'Slides',
    columns: 'Columns', export: 'Export', cols_visible: 'Visible', cols_hidden: 'Hidden', drag_here: 'Drag here', reset: 'Reset',
    edit: 'Edit', open: 'Open slides', rename: 'Rename', del: 'Delete', cancel: 'Cancel', save: 'Save', back: 'Back',
    refresh: 'Refresh', loading: 'Loading…', saved: 'Saved ✓', none: '—',
    del_slider_title: 'Delete slider', del_slider_confirm: 'Delete “{n}” and all its slides? This is irreversible.',
    new_slider_title: 'New slider', rename_slider_title: 'Rename slider',
    f_name: 'Slider name', f_name_ph: 'My slider', f_page: 'Linked page (optional)', f_page_ph: '— Choose a page —', f_page_none: '— None —',
    err_save: 'Error while saving', no_access: 'You do not have permission to view this list.',
    slides_of: 'Slides of “{n}”', add_slide: 'Add a slide', no_slides: 'No slide yet. Click “Add a slide”.',
    s_order: 'Order', s_status: 'Status', s_image: 'Image', s_title: 'Title', s_sub1: 'Subtitle', s_link: 'Link',
    active: 'Active', inactive: 'Inactive', reorder_hint: 'Drag a row to reorder.',
    del_slide_title: 'Delete slide', del_slide_confirm: 'Delete this slide? This is irreversible.',
    new_slide_title: 'New slide', edit_slide_title: 'Edit slide',
    f_status: 'Active', f_title: 'Title', f_sub1: 'Subtitle 1', f_sub2: 'Description 1 (HTML)', f_sub3: 'Description 2 (HTML)',
    f_link: 'Link', f_image: 'Image', f_image_hint: 'JPG, PNG, GIF or WebP.', uploading: 'Uploading…', remove_img: 'Remove image', choose_img: 'Choose an image',
  },
}
export function useT() {
  const lang = currentLang()
  return (key: string, vars?: Record<string, string | number>) => {
    let s = DICT[lang][key] ?? key
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v))
    return s
  }
}

// ── Capacités (droits avancés) — lit le global window.MelisCan (default-allow) ──
export function makeCan(melisKey: string) {
  return (cap: string): boolean =>
    (window as unknown as { MelisCan?: (k: string, c: string) => boolean }).MelisCan?.(melisKey, cap) ?? true
}

// ── Styles (variables CSS du thème) ──
export const card: CSSProperties = { border: '1px solid var(--color-border)', background: 'var(--color-card)', borderRadius: 12, boxShadow: '0 1px 2px rgba(0,0,0,.04)' }
export const inputCss: CSSProperties = { height: 40, width: '100%', boxSizing: 'border-box', borderRadius: 8, border: '1px solid var(--color-input,var(--color-border))', background: 'var(--color-card)', color: 'var(--color-foreground)', padding: '0 12px', fontSize: 14, outline: 'none' }
export const textareaCss: CSSProperties = { ...inputCss, height: 'auto', minHeight: 90, padding: '10px 12px', resize: 'vertical', fontFamily: 'inherit' }
export const btnPrimary: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, height: 36, padding: '0 14px', borderRadius: 8, border: 0, background: 'var(--color-primary)', color: 'var(--color-primary-foreground,#fff)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }
export const btnGhost: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, height: 36, padding: '0 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-card)', color: 'var(--color-foreground)', fontSize: 14, cursor: 'pointer' }
export const iconBtn: CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 6, border: 0, background: 'transparent', color: 'var(--color-muted-foreground)', cursor: 'pointer' }
export const th: CSSProperties = { textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--color-muted-foreground)', whiteSpace: 'nowrap' }
export const td: CSSProperties = { padding: '10px 16px', fontSize: 14, color: 'var(--color-foreground)', borderTop: '1px solid var(--color-border)' }
export const label: CSSProperties = { display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4, color: 'var(--color-foreground)' }
export const hint: CSSProperties = { marginTop: 4, fontSize: 12, color: 'var(--color-muted-foreground)' }
export const pageWrap: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 20, padding: 24, height: '100%', boxSizing: 'border-box', overflow: 'auto' }

// ── Icônes ──
const sIcon = { width: 15, height: 15, flexShrink: 0 } as const
export const PencilIcon = () => <svg style={sIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
export const TrashIcon = () => <svg style={sIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
export const PlusIcon = () => <svg style={sIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
export const ImageIcon = () => <svg style={sIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" /></svg>
export const LayersIcon = () => <svg style={sIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" /></svg>
export const GripIcon = () => <svg style={{ width: 13, height: 13, flexShrink: 0, color: 'var(--color-muted-foreground)' }} viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" /><circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" /><circle cx="9" cy="18" r="1.5" /><circle cx="15" cy="18" r="1.5" /></svg>

// ── KPI ──
export function Kpi({ label: lbl, value }: { label: string; value: number | null }) {
  return (
    <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 2, padding: 16, flex: 1, minWidth: 140 }}>
      <span style={{ fontSize: 12, color: 'var(--color-muted-foreground)' }}>{lbl}</span>
      <span style={{ fontSize: 22, fontWeight: 700 }}>{value == null ? '…' : value}</span>
    </div>
  )
}

// ── Gestionnaire de colonnes (masquer + réordonner, persisté) ──
export type ColDef = { id: string; visible: boolean }
export const visibleCols = (c: ColDef[]) => c.filter((x) => x.visible)
export function makeColStore(key: string, defaults: ColDef[]) {
  const load = (): ColDef[] => {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return defaults
      const saved: ColDef[] = JSON.parse(raw)
      const ordered = saved.map((s) => { const d = defaults.find((c) => c.id === s.id); return d ? { id: d.id, visible: s.visible } : null }).filter(Boolean) as ColDef[]
      const missing = defaults.filter((d) => !saved.find((s) => s.id === d.id))
      return [...ordered, ...missing]
    } catch { return defaults }
  }
  const save = (c: ColDef[]) => { try { localStorage.setItem(key, JSON.stringify(c)) } catch { /* */ } }
  return { load, save, defaults }
}

const panelCss: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 2, minHeight: 130, borderRadius: 8, border: '1px dashed var(--color-border)', padding: 6 }
const panelTitle: CSSProperties = { padding: '0 6px 4px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--color-muted-foreground)' }

export function ColManager({ cols, labelFor, onChange, onSave, defaults, onClose }: {
  cols: ColDef[]; labelFor: (id: string) => string; onChange: (c: ColDef[]) => void
  onSave: (c: ColDef[]) => void; defaults: ColDef[]; onClose: () => void
}) {
  const t = useT()
  const [dragId, setDragId] = useState<string | null>(null)
  const [over, setOver] = useState<{ id: string; panel: 'visible' | 'hidden' } | null>(null)
  const shown = cols.filter((c) => c.visible)
  const hidden = cols.filter((c) => !c.visible)

  function drop(panel: 'visible' | 'hidden') {
    if (!dragId) return
    const src = cols.find((c) => c.id === dragId)!
    const upd = { ...src, visible: panel === 'visible' }
    let vList = shown.filter((c) => c.id !== dragId)
    const hList = hidden.filter((c) => c.id !== dragId)
    if (panel === 'visible') {
      const dst = over?.id
      if (!dst || dst === '__panel__') vList = [...vList, upd]
      else { const i = vList.findIndex((c) => c.id === dst); vList = i === -1 ? [...vList, upd] : [...vList.slice(0, i), upd, ...vList.slice(i)] }
      const next = [...vList, ...hList]; onChange(next); onSave(next)
    } else { const next = [...vList, ...hList, upd]; onChange(next); onSave(next) }
    setDragId(null); setOver(null)
  }

  function item(col: ColDef, panel: 'visible' | 'hidden') {
    const isOver = over?.id === col.id && over?.panel === panel
    return (
      <div key={col.id} draggable
        onDragStart={() => setDragId(col.id)} onDragEnd={() => { setDragId(null); setOver(null) }}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); if (over?.id !== col.id || over?.panel !== panel) setOver({ id: col.id, panel }) }}
        onDrop={(e) => { e.preventDefault(); drop(panel) }}
        style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 8, padding: '6px 8px', fontSize: 14, cursor: 'grab', userSelect: 'none', opacity: dragId === col.id ? 0.4 : 1, background: isOver ? 'color-mix(in srgb, var(--color-primary) 12%, transparent)' : 'transparent', boxShadow: isOver ? '0 0 0 1px color-mix(in srgb, var(--color-primary) 35%, transparent)' : 'none' }}>
        <GripIcon /><span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{labelFor(col.id)}</span>
      </div>
    )
  }

  return (
    <div style={{ ...card, position: 'absolute', right: 0, top: '100%', marginTop: 6, zIndex: 50, width: 380, maxWidth: 'calc(100vw - 1rem)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '1px solid var(--color-border)' }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>{t('columns')}</span>
        <button style={{ ...iconBtn, width: 22, height: 22 }} onClick={onClose}>✕</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: 12 }}>
        <div style={panelCss}
          onDragOver={(e) => { e.preventDefault(); if (over?.id !== '__panel__' || over?.panel !== 'hidden') setOver({ id: '__panel__', panel: 'hidden' }) }}
          onDrop={(e) => { e.preventDefault(); drop('hidden') }}>
          <p style={panelTitle}>{t('cols_hidden')}</p>
          {hidden.length === 0 ? <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--color-muted-foreground)', opacity: 0.5, padding: '16px 0' }}>{t('drag_here')}</div> : hidden.map((c) => item(c, 'hidden'))}
        </div>
        <div style={panelCss}
          onDragOver={(e) => { e.preventDefault(); if (over?.id !== '__panel__' || over?.panel !== 'visible') setOver({ id: '__panel__', panel: 'visible' }) }}
          onDrop={(e) => { e.preventDefault(); drop('visible') }}>
          <p style={panelTitle}>{t('cols_visible')}</p>
          {shown.length === 0 ? <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--color-muted-foreground)', opacity: 0.5, padding: '16px 0' }}>{t('drag_here')}</div> : shown.map((c) => item(c, 'visible'))}
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--color-border)', padding: 6 }}>
        <button style={{ ...btnGhost, width: '100%', height: 30, border: 0, justifyContent: 'center', color: 'var(--color-muted-foreground)' }}
          onClick={() => { onChange(defaults); onSave(defaults) }}>{t('reset')}</button>
      </div>
    </div>
  )
}

// ── Modale de confirmation ──
export function ConfirmModal({ title, message, confirmLabel, onConfirm, onCancel }: {
  title: string; message: string; confirmLabel: string; onConfirm: () => void; onCancel: () => void
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <div style={{ ...card, padding: 24, width: '100%', maxWidth: 380 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{title}</h3>
        <p style={{ fontSize: 14, color: 'var(--color-muted-foreground)', marginTop: 8 }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <button style={btnGhost} onClick={onCancel}>{useT()('cancel')}</button>
          <button style={{ ...btnGhost, borderColor: '#fca5a5', color: '#dc2626' }} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
