import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SliderList, { MELIS_KEY } from './SliderList'
import SliderEditor from './SliderEditor'
import SlideEditor from './SlideEditor'
import { fetchSlider, markSliderListStale } from './slider-api'
import { useOpenSubTabPaths } from './shared/subtabs'
import { useT } from './ui'
import { type ViewMode } from './ViewToggle'

declare global {
  interface Window {
    // Exposé par l'hôte (melis-core, lib/tool-view-mode) : dit quelle vue du toggle est active.
    __melisSetToolView?: (melisKey: string, view: ViewMode) => void
    // Pont vers la barre de sous-onglets NATIVE de l'hôte (SubTabWindowBridge, melis-core) : une
    // brique est un bundle séparé, elle ne peut pas importer le contexte du store — elle le pilote
    // donc via ces globals (manifest de la brique : `subTabs: true`).
    __melisOpenSubTab?: (section: string, tab: { id: string; label: string; path: string }) => void
    __melisCloseSubTab?: (section: string, id: string) => void
    __melisUpdateSubTabLabel?: (section: string, id: string, label: string) => void
  }
}

/**
 * Conteneur de l'outil Slider (brique MelisCmsSlider), monté une fois par le shell sur l'onglet
 * « Sliders ». Les enregistrements ouverts sont des SOUS-ONGLETS de la barre native de l'hôte — la
 * même que les Utilisateurs FO (melis-cms-user-account) et les outils natifs de MelisCore.
 *
 * L'outil a TROIS niveaux, et la barre les reflète tous (comme les onglets de l'outil legacy) :
 *   /[section]/slider            → la liste des sliders
 *   /[section]/slider/:sliderId  → les slides d'un slider   (sous-onglet, icône fichier)
 *   /[section]/slider/:sliderId/:slideId|new → une slide    (sous-onglet imbriqué, chevron « ↳ »)
 * Le niveau 3 était auparavant un simple écran « ← Retour » DANS le niveau 2, sans onglet : ouvrir
 * une slide faisait disparaître les slides du slider et rien ne le signalait dans la barre.
 *
 * Chaque écran ouvert reste MONTÉ (masqué en CSS quand il n'est pas actif) : passer d'un onglet à
 * l'autre ne remonte rien et ne refetche pas (formulaire de slide en cours de saisie préservé).
 * Fermer un slider ferme ses slides (l'hôte referme les sous-onglets descendants, cf. sub-tab-store)
 * et la persistance après F5 est celle de l'hôte (sessionStorage `melis-open-subtabs`).
 */

/** Découpe l'URL en (racine de l'outil, id du slider, segment de slide). */
function parsePath(pathname: string) {
  const parts = pathname.split('/')
  const tail: string[] = []
  // Au plus 2 segments d'enregistrement : /:sliderId puis /:slideId (ou `new`).
  while (parts.length > 1 && tail.length < 2 && /^(\d+|new)$/.test(parts[parts.length - 1])) tail.unshift(parts.pop()!)
  return {
    base: parts.join('/'),
    sliderId: tail[0] && /^\d+$/.test(tail[0]) ? Number(tail[0]) : null,
    slideSeg: tail.length > 1 ? tail[1] : null,
  }
}

export default function SliderPage() {
  const t = useT()
  const location = useLocation()
  const navigate = useNavigate()
  // Route racine de l'outil (= section des sous-onglets), dérivée de l'URL courante : la brique est
  // montée à son URL d'arbre, qui dépend du menu — on ne peut pas la coder en dur.
  const { base, sliderId, slideSeg } = parsePath(location.pathname)
  const currentPath = sliderId != null ? (slideSeg != null ? `${base}/${sliderId}/${slideSeg}` : `${base}/${sliderId}`) : null

  // Sous-onglets ouverts publiés par l'hôte + celui en cours (son enregistrement dans le store se
  // fait dans un effet → l'ajouter ici monte son écran immédiatement, sans frame de retard).
  const openPaths = useOpenSubTabPaths(base)
  const editorPaths = useMemo(() => {
    const paths = openPaths.slice()
    if (currentPath && !paths.includes(currentPath)) paths.push(currentPath)
    return paths
  }, [openPaths, currentPath])

  // Noms des sliders ouverts (titre de l'écran des slides). Connus quand on ouvre depuis la liste ;
  // à (re)charger pour un sous-onglet restauré après F5 ou atteint par deep-link.
  const [names, setNames] = useState<Record<number, string>>({})
  const requested = useRef<Set<number>>(new Set())
  // Rafraîchissement de la liste des slides d'un slider après un enregistrement/suppression de slide
  // (les deux écrans sont désormais des FRÈRES, pas un parent et son enfant).
  const [slidesTick, setSlidesTick] = useState<Record<number, number>>({})
  const bumpSlides = (sid: number) => setSlidesTick((prev) => ({ ...prev, [sid]: (prev[sid] ?? 0) + 1 }))

  // Vue du toggle New/Old, portée ICI (et non dans SliderList) : l'hôte masque les sous-onglets
  // React quand la vue « Old » est active (c'est alors la ToolTabBar, alimentée par l'iframe legacy,
  // qui pilote les onglets) — sinon deux onglets pour le même slider.
  const [mode, setMode] = useState<ViewMode>('react')
  useEffect(() => { window.__melisSetToolView?.(MELIS_KEY, mode) }, [mode])

  /**
   * Deep-link (URL saisie/partagée, storage vide) : l'écran est affiché mais aucun sous-onglet
   * n'existe côté hôte → la barre resterait invisible. On enregistre alors le chemin courant — ET
   * celui de son parent quand on arrive directement sur une slide, sinon la slide serait orpheline.
   *
   * ⚠️ Uniquement à l'ARRIVÉE sur un chemin (`arrivedAt`), jamais « dès qu'il manque dans
   * `openPaths` » : fermer un onglet met `openPaths` à jour AVANT que la navigation de repli de
   * l'hôte ne soit visible ici, et un effet réactif RESSUSCITAIT alors l'onglet qu'on vient de
   * fermer (avec une étiquette générique en prime). Les ouvertures depuis l'UI passent par
   * `openSlider`/`openSlide`, qui marquent aussi `arrivedAt`.
   */
  const arrivedAt = useRef<string | null>(null)
  useEffect(() => {
    if (!currentPath || sliderId == null) { arrivedAt.current = null; return }
    if (arrivedAt.current === currentPath) return
    arrivedAt.current = currentPath
    const parentPath = `${base}/${sliderId}`
    if (!openPaths.includes(parentPath)) {
      window.__melisOpenSubTab?.(base, { id: parentPath, label: names[sliderId] || `#${sliderId}`, path: parentPath })
    }
    if (currentPath !== parentPath && !openPaths.includes(currentPath)) {
      window.__melisOpenSubTab?.(base, { id: currentPath, label: slideSeg === 'new' ? t('new_slide_title') : t('edit_slide_title'), path: currentPath })
    }
  }, [currentPath, openPaths, base, sliderId, slideSeg, names, t])

  // Slider ouvert dont on ignore le nom → on le charge, et on rafraîchit l'étiquette du sous-onglet
  // (un onglet restauré peut porter un nom périmé si le slider a été renommé ailleurs). Slider
  // supprimé entre-temps ou id bidon dans l'URL → on referme le sous-onglet et on revient à la liste.
  useEffect(() => {
    for (const path of editorPaths) {
      const sid = parsePath(path).sliderId
      if (sid == null || requested.current.has(sid)) continue
      requested.current.add(sid)
      fetchSlider(sid)
        .then((s) => {
          setNames((prev) => ({ ...prev, [sid]: s.name }))
          window.__melisUpdateSubTabLabel?.(base, `${base}/${sid}`, s.name || `#${sid}`)
        })
        .catch(() => {
          requested.current.delete(sid)
          window.__melisCloseSubTab?.(base, `${base}/${sid}`) // ferme aussi ses slides (descendants)
          if (window.location.pathname.includes(`${base}/${sid}`)) navigate(base, { replace: true })
        })
    }
  }, [editorPaths, base, navigate])

  // Passer en vue Old ramène sur la liste : c'est SliderList qui porte l'iframe, elle doit donc être
  // visible (un écran React ouvert la masquerait).
  function changeMode(m: ViewMode) {
    setMode(m)
    if (m === 'iframe' && currentPath) navigate(base)
  }

  // ── Niveau 2 : un slider (ses slides) ───────────────────────────────────────
  function openSlider(id: number, name: string) {
    const path = `${base}/${id}`
    setNames((prev) => ({ ...prev, [id]: name }))
    requested.current.add(id) // nom déjà connu : pas de fetch inutile
    arrivedAt.current = path  // ouvert ICI, avec son vrai nom : l'effet ne doit pas le ré-étiqueter
    window.__melisOpenSubTab?.(base, { id: path, label: name || `#${id}`, path })
    navigate(path)
  }

  /** Slider supprimé depuis la liste → son sous-onglet (et ceux de ses slides) n'ont plus d'objet. */
  function handleSliderDeleted(id: number) {
    requested.current.delete(id)
    window.__melisCloseSubTab?.(base, `${base}/${id}`)
  }

  /** Slider renommé depuis la liste → l'étiquette du sous-onglet et le titre de l'écran suivent. */
  function handleSliderRenamed(id: number, name: string) {
    setNames((prev) => (prev[id] === undefined ? prev : { ...prev, [id]: name }))
    window.__melisUpdateSubTabLabel?.(base, `${base}/${id}`, name || `#${id}`)
  }

  // ── Niveau 3 : une slide ────────────────────────────────────────────────────
  function openSlide(sid: number, slide: number | 'new', title: string) {
    const path = `${base}/${sid}/${slide}`
    const label = slide === 'new' ? t('new_slide_title') : (title || `#${slide}`)
    arrivedAt.current = path // idem : étiquette = le titre de la slide, pas le libellé générique
    window.__melisOpenSubTab?.(base, { id: path, label, path })
    navigate(path)
  }

  function closeSlideTab(sid: number, slide: number | 'new') {
    window.__melisCloseSubTab?.(base, `${base}/${sid}/${slide}`)
  }

  /** Retour aux slides du slider depuis une slide : on referme son onglet, comme la croix. */
  function backToSlides(sid: number, slide: number | 'new') {
    closeSlideTab(sid, slide)
    navigate(`${base}/${sid}`)
  }

  /**
   * Slide enregistrée. Une slide CRÉÉE change d'identité : l'onglet transitoire « Nouvelle slide »
   * est refermé au profit de celui de la slide réelle (même règle que le formulaire des
   * Utilisateurs FO), sinon un second enregistrement rejouerait une création.
   */
  function handleSlideSaved(sid: number, slide: number | 'new', newId: number, title: string) {
    bumpSlides(sid)
    markSliderListStale() // le compteur de slides de la liste a bougé
    if (slide === 'new') {
      closeSlideTab(sid, 'new')
      openSlide(sid, newId, title)
    } else {
      window.__melisUpdateSubTabLabel?.(base, `${base}/${sid}/${slide}`, title || `#${slide}`)
    }
  }

  /** Slide supprimée depuis la liste des slides → son sous-onglet n'a plus d'objet. */
  function handleSlideDeleted(sid: number, slideId: number) {
    const path = `${base}/${sid}/${slideId}`
    window.__melisCloseSubTab?.(base, path)
    if (location.pathname === path) navigate(`${base}/${sid}`)
    bumpSlides(sid)
  }

  // ── Vue « Old » (iframe legacy) ──────────────────────────────────────────────────
  // Elle reste 100% LEGACY : ouvrir un slider depuis la liste legacy ouvre l'écran legacy DANS
  // l'iframe (tabOpen), et la barre d'onglets de l'hôte (ToolTabBar, alimentée par le pont
  // __melisToolTabs) permet de revenir à la liste — comme pour tout autre outil de la plateforme.

  return (
    <>
      {/* La liste reste TOUJOURS montée (visibilité togglée) : sinon revenir d'un slider vers la
          liste la recrée → recherche/tri/scroll perdus et re-fetch systématique. */}
      <div style={{ height: '100%', display: currentPath ? 'none' : 'block' }}>
        <SliderList active={!currentPath} onOpen={openSlider} onDeleted={handleSliderDeleted} onRenamed={handleSliderRenamed}
          mode={mode} onModeChange={changeMode} />
      </div>

      {/* Un écran monté par sous-onglet ouvert ; seul l'actif est visible. Keyé par le chemin →
          React préserve l'instance (et son état) tant que le sous-onglet reste ouvert ; fermer le
          sous-onglet (croix de la barre de l'hôte) le retire de `openPaths` → démontage propre. */}
      {editorPaths.map((path) => {
        const { sliderId: sid, slideSeg: seg } = parsePath(path)
        if (sid == null) return null
        const visible = { height: '100%', display: path === currentPath ? 'block' : 'none' } as const
        if (seg == null) {
          return (
            <div key={path} style={visible}>
              <SliderEditor sliderId={sid} sliderName={names[sid] ?? ''} tick={slidesTick[sid] ?? 0}
                onOpenSlide={(slide, title) => openSlide(sid, slide, title)}
                onSlideDeleted={(slideId) => handleSlideDeleted(sid, slideId)}
                onSaved={() => markSliderListStale()} />
            </div>
          )
        }
        const slide = seg === 'new' ? 'new' : Number(seg)
        return (
          <div key={path} style={visible}>
            <SlideEditor sliderId={sid} slideId={slide}
              onBack={() => backToSlides(sid, slide)}
              onSaved={(newId, title) => handleSlideSaved(sid, slide, newId, title)} />
          </div>
        )
      })}
    </>
  )
}
