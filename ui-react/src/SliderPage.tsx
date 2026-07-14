import { useState, useEffect } from 'react'
import SliderList, { MELIS_KEY } from './SliderList'
import SliderEditor from './SliderEditor'
import { markSliderListStale } from './slider-api'
import { useT } from './ui'
import { type ViewMode } from './ViewToggle'

declare global {
  interface Window {
    // Exposé par l'hôte (melis-core, lib/tool-view-mode) : dit quelle vue du toggle est active.
    __melisSetToolView?: (melisKey: string, view: ViewMode) => void
  }
}

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
 * état local). Le host (ToolTabBar) ne réécrit pas l'URL de cet outil (SELF_MANAGED_URL).
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
  // Vue du toggle New/Old, portée ICI (et non dans SliderList) : elle conditionne aussi la barre de
  // sous-onglets React ci-dessous. Les deux vues ont chacune leur propre barre d'onglets — celle de
  // la vue Old est la ToolTabBar de l'hôte, alimentée par l'iframe legacy — et elles ne doivent
  // JAMAIS s'afficher ensemble (sinon deux onglets pour le même slider).
  const [mode, setMode] = useState<ViewMode>('react')

  // 1) On dit à l'hôte quelle vue est active : il masque les onglets de l'iframe legacy en vue React
  //    (l'iframe reste montée en display:none et continue de les publier).
  useEffect(() => { window.__melisSetToolView?.(MELIS_KEY, mode) }, [mode])

  // 2) Passer en vue Old ramène sur la liste : c'est SliderList qui porte l'iframe, elle doit donc
  //    être visible (un SliderEditor React ouvert la masquerait).
  function changeMode(m: ViewMode) {
    setMode(m)
    if (m === 'iframe') setView({ kind: 'list' })
  }

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

  // ── Vue « Old » (iframe legacy) ──────────────────────────────────────────────────
  // Elle reste 100% LEGACY : ouvrir un slider depuis la liste legacy ouvre l'écran legacy DANS
  // l'iframe (tabOpen), et la barre d'onglets de l'hôte (ToolTabBar, alimentée par le pont
  // __melisToolTabs) permet de revenir à la liste — comme pour tout autre outil de la plateforme.
  // On ne détourne PLUS ces onglets vers le SliderEditor React : c'était le but du toggle de pouvoir
  // comparer les deux interfaces, et le détournement rendait la vue Old inutilisable.

  const activeId = view.kind === 'edit' ? view.id : null

  // URL = /[section]/[tool]/:id, reflétée à chaque changement de sous-onglet actif.
  useEffect(() => { reflectSubTabUrl(activeId) }, [activeId])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {mode === 'react' && open.length > 0 && (
        <SubTabBar tabs={open} activeId={activeId}
          onBack={() => setView({ kind: 'list' })} onSelect={(id) => setView({ kind: 'edit', id })} onClose={closeEditor} />
      )}

      <div style={{ flex: 1, minHeight: 0 }}>
        <div style={{ height: '100%', display: view.kind === 'list' ? 'block' : 'none' }}>
          <SliderList active={view.kind === 'list'} onOpen={openEditor} mode={mode} onModeChange={changeMode} />
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
