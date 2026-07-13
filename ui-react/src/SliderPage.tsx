import { useState, useEffect, useRef } from 'react'
import SliderList from './SliderList'
import SliderEditor from './SliderEditor'
import { markSliderListStale } from './slider-api'
import { useT } from './ui'

/**
 * Conteneur de l'outil Slider (brique MelisCmsSlider), monté une fois par le shell sur
 * l'onglet « Sliders ». Reproduit le système de SOUS-ONGLETS des Utilisateurs/Sites :
 * on reste sur l'unique onglet de shell « Sliders » et on affiche une barre de sous-onglets
 * DANS l'outil (← Retour + un onglet par slider ouvert). Chaque slider ouvert garde son
 * SliderEditor monté (état préservé) → double niveau d'édition slider > slides > slide.
 */

type View = { kind: 'list' } | { kind: 'edit'; id: number }
interface OpenTab { id: number; name: string }

/**
 * Reflète le sous-onglet actif dans l'URL : /[section]/[tool]/:id (comme l'outil Utilisateurs).
 * COSMÉTIQUE (history.replaceState) — PAS de navigation React Router (pattern sous-onglets in-tool,
 * état local). Le host (ToolTabBar) ne réécrit pas l'URL de cet outil (SELF_MANAGED_SUBTABS).
 */
function reflectSubTabUrl(seg: string | number | null) {
  const base = window.location.pathname.replace(/\/(?:new|\d+)$/, '')
  const next = seg != null && seg !== '' ? `${base}/${seg}` : base
  if (window.location.pathname !== next) window.history.replaceState(window.history.state, '', next)
}

const LayersIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" />
  </svg>
)

function SubTabBar({ tabs, activeId, onBack, onSelect, onClose }: {
  tabs: OpenTab[]; activeId: number | null; onBack: () => void; onSelect: (id: number) => void; onClose: (id: number) => void
}) {
  const t = useT()
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', borderBottom: '1px solid var(--color-border,#e5e7eb)', background: 'var(--color-background,#fff)', padding: '0 8px', overflowX: 'auto', flexShrink: 0 }}>
      <button onClick={onBack}
        style={{ marginRight: 4, flexShrink: 0, display: 'inline-flex', alignItems: 'center', padding: '6px 8px', fontSize: 12, color: 'var(--color-muted-foreground,#6b7280)', background: 'transparent', border: 0, cursor: 'pointer', whiteSpace: 'nowrap' }}>
        ← {t('back')}
      </button>
      {tabs.map((tab) => {
        const isActive = activeId === tab.id
        return (
          <div key={tab.id} onClick={() => onSelect(tab.id)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 10px', fontSize: 12, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none',
              borderBottom: isActive ? '2px solid var(--color-primary,#cb4040)' : '2px solid transparent',
              color: isActive ? 'var(--color-foreground)' : 'var(--color-muted-foreground,#6b7280)',
              background: isActive ? 'var(--color-background,#fff)' : 'transparent' }}>
            <LayersIcon />
            <span style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>{tab.name || ('#' + tab.id)}</span>
            <button onClick={(e) => { e.stopPropagation(); onClose(tab.id) }}
              style={{ marginLeft: 2, borderRadius: 4, padding: 2, border: 0, background: 'transparent', cursor: 'pointer', color: 'inherit', lineHeight: 0 }} title={t('back')}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default function SliderPage() {
  const [view, setView] = useState<View>({ kind: 'list' })
  const [open, setOpen] = useState<OpenTab[]>([])

  function openEditor(id: number, name: string) {
    setOpen((prev) => (prev.some((o) => o.id === id) ? prev.map((o) => (o.id === id ? { ...o, name } : o)) : [...prev, { id, name }]))
    setView({ kind: 'edit', id })
  }
  function closeEditor(id: number) {
    setOpen((prev) => {
      const rest = prev.filter((o) => o.id !== id)
      setView((v) => (v.kind === 'edit' && v.id === id ? (rest.length ? { kind: 'edit', id: rest[rest.length - 1].id } : { kind: 'list' }) : v))
      return rest
    })
  }

  // ── Vue « Old » (iframe legacy) : router l'édition vers l'ÉDITEUR REACT ─────────
  // La liste legacy en iframe (SliderList mode Old) ouvre l'édition d'un slider dans SA propre
  // pile d'onglets (postée à l'hôte via __melisToolTabs). Plutôt que de laisser l'hôte afficher
  // une 2ᵉ barre (ToolTabBar) empilée sur notre SubTabBar, on intercepte le message ici : on ouvre
  // le SliderEditor React (même sous-onglet unique) et on referme l'onglet dans l'iframe pour
  // qu'elle revienne à sa liste (le SliderEditor React prend le relais). Même pattern que Sites.
  const seenEditTabs = useRef<Set<string>>(new Set())
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      const d = e.data as { __melisToolTabs?: boolean; melisKey?: string; tabs?: { id: string; label: string; active: boolean; primary?: boolean }[] } | null
      if (!d || !d.__melisToolTabs || d.melisKey !== 'MelisCmsSlider_left_menu') return
      const tabs = Array.isArray(d.tabs) ? d.tabs : []
      const primary = tabs.find((t) => t.primary)
      const present = new Set<string>()
      for (const t of tabs) {
        if (t.primary) continue
        present.add(t.id)
        if (seenEditTabs.current.has(t.id)) continue
        seenEditTabs.current.add(t.id)
        // id des onglets d'édition : "<sliderId>_id_MelisCmsSlider_page" (cf. slider.tool.js tabOpen).
        const m = t.id.match(/^(\d+)_id_MelisCmsSlider_page$/)
        if (!m) continue
        const sliderId = Number(m[1])
        openEditor(sliderId, t.label || `#${sliderId}`)
        // Referme l'onglet dans l'iframe legacy → elle repasse sur sa liste.
        const frame = document.querySelector('iframe[title="Slider — Vue Melis"]') as HTMLIFrameElement | null
        try { frame?.contentWindow?.postMessage({ __melisToolTabCmd: true, melisKey: 'MelisCmsSlider_left_menu', cmd: 'close', id: t.id, next: primary?.id ?? null }, '*') } catch { /* ignore */ }
      }
      // Purge les ids d'onglets fermés (pour re-router une prochaine édition du même slider).
      for (const id of Array.from(seenEditTabs.current)) if (!present.has(id)) seenEditTabs.current.delete(id)
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
    // openEditor n'utilise que des setters stables → capture initiale suffisante.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activeId = view.kind === 'edit' ? view.id : null

  // URL = /[section]/[tool]/:id, reflétée à chaque changement de sous-onglet actif.
  useEffect(() => { reflectSubTabUrl(activeId) }, [activeId])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {open.length > 0 && (
        <SubTabBar tabs={open} activeId={activeId}
          onBack={() => setView({ kind: 'list' })} onSelect={(id) => setView({ kind: 'edit', id })} onClose={closeEditor} />
      )}

      <div style={{ flex: 1, minHeight: 0 }}>
        <div style={{ height: '100%', display: view.kind === 'list' ? 'block' : 'none' }}>
          <SliderList active={view.kind === 'list'} onOpen={openEditor} />
        </div>

        {open.map((o) => (
          <div key={o.id} style={{ height: '100%', display: activeId === o.id ? 'block' : 'none' }}>
            <SliderEditor sliderId={o.id} sliderName={o.name} onSaved={() => markSliderListStale()} />
          </div>
        ))}
      </div>
    </div>
  )
}
