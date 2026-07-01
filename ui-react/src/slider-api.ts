/**
 * Client de l'API Slider pour la brique MelisCmsSlider.
 *
 * Appelle la couche REST partagée (module MelisReactApi) :
 *   /melis/react-api/sliders[/...]
 * Contrat `{ success, data, error }` (comme les outils natifs). La brique ne peut pas
 * importer les modules de l'hôte (`@/lib/...`) — ce client est donc autonome.
 *
 * Deux niveaux imbriqués : SLIDER (conteneur) > SLIDE (détail).
 */

const XHR_HEADER = { 'X-Requested-With': 'XMLHttpRequest' } as const

export interface SliderItem {
  id: number
  name: string
  pageId: number | null
  slideCount: number
}
export interface SliderStats { sliders: number; slides: number; active: number }
export interface SliderListResult { items: SliderItem[]; total: number }

export interface SlideItem {
  id: number
  sliderId: number
  status: number
  title: string
  sub1: string
  sub2: string
  sub3: string
  link: string
  img: string
  order: number
}
export interface SlideListResult { items: SlideItem[]; total: number }

export interface SliderSavePayload { id?: number | null; name: string; pageId?: number | null }
export interface SlideSavePayload {
  id?: number | null
  sliderId: number
  status: number
  title: string
  sub1: string
  sub2: string
  sub3: string
  link: string
  img: string
  order?: number | null
}

async function apiFetch<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...opts,
    headers: { ...XHR_HEADER, ...(opts?.headers ?? {}) },
    credentials: 'include',
  })
  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try {
      const d = (await res.json()) as { error?: string }
      if (d.error) msg = d.error
    } catch { /* ignore */ }
    throw new Error(msg)
  }
  const data = (await res.json()) as { success: boolean; data?: T; error?: string }
  if (!data.success) throw new Error(data.error ?? 'API error')
  return data.data as T
}

const BASE = '/melis/react-api/sliders'

// ── Sliders ──────────────────────────────────────────────────────────────────
export async function fetchSliders(params: { search?: string } = {}): Promise<SliderListResult> {
  const qs = new URLSearchParams()
  if (params.search) qs.set('search', params.search)
  const q = qs.toString()
  return apiFetch<SliderListResult>(`${BASE}${q ? `?${q}` : ''}`)
}
export async function fetchSliderStats(): Promise<SliderStats> {
  return apiFetch<SliderStats>(`${BASE}/stats`)
}
export async function fetchSlider(id: number): Promise<SliderItem> {
  return apiFetch<SliderItem>(`${BASE}/${id}`)
}
export async function saveSlider(payload: SliderSavePayload): Promise<{ id: number }> {
  return apiFetch<{ id: number }>(`${BASE}/save`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  })
}
export async function deleteSlider(id: number): Promise<void> {
  await apiFetch<null>(`${BASE}/delete/${id}`, { method: 'DELETE' })
}

// ── Slides ───────────────────────────────────────────────────────────────────
export async function fetchSlides(sliderId: number): Promise<SlideListResult> {
  return apiFetch<SlideListResult>(`${BASE}/${sliderId}/slides`)
}
export async function fetchSlide(id: number): Promise<SlideItem> {
  return apiFetch<SlideItem>(`${BASE}/slide/${id}`)
}
export async function saveSlide(payload: SlideSavePayload): Promise<{ id: number }> {
  return apiFetch<{ id: number }>(`${BASE}/slide/save`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  })
}
export async function deleteSlide(id: number): Promise<void> {
  await apiFetch<null>(`${BASE}/slide/delete/${id}`, { method: 'DELETE' })
}
export async function reorderSlides(sliderId: number, ids: number[]): Promise<void> {
  await apiFetch<null>(`${BASE}/slides/reorder`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sliderId, ids }),
  })
}
/** Upload multipart d'une image de slide → chemin web stocké (/media/sliders/<id>/<fichier>). */
export async function uploadSlideImage(sliderId: number, file: File): Promise<{ path: string }> {
  const fd = new FormData()
  fd.append('image', file)
  return apiFetch<{ path: string }>(`${BASE}/slide/upload?sliderId=${sliderId}`, { method: 'POST', body: fd })
}

// ── Stale-flag (la liste des sliders est montée une fois ; rafraîchir au retour) ──
let _stale = false
export function markSliderListStale() { _stale = true }
export function consumeSliderListStale() { const s = _stale; _stale = false; return s }
