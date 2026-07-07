import { useEffect, useRef, useState } from 'react'

/**
 * Sélecteur de page (id) pour la brique Slider — même UX que le PagePicker de l'outil Sites :
 * arbre lazy legacy (GET /melis/MelisCms/TreeSites/get-tree-pages-by-page-id), popover, clic = sélection.
 * Autonome (la brique ne peut pas importer l'hôte) : styles inline + variables CSS du thème.
 * Champ OPTIONNEL → une entrée « Aucune » remet à 0.
 */

interface TreeNode { key: number; title: string; lazy: boolean }

async function fetchTreeNodes(nodeId: number): Promise<TreeNode[]> {
  try {
    const res = await fetch(
      `/melis/MelisCms/TreeSites/get-tree-pages-by-page-id?nodeId=${encodeURIComponent(String(nodeId))}`,
      { headers: { 'X-Requested-With': 'XMLHttpRequest' }, credentials: 'include' },
    )
    if (!res.ok) return []
    const data = await res.json()
    let nodes: TreeNode[] = []
    if (Array.isArray(data)) nodes = data as TreeNode[]
    else if (Array.isArray(data?.data)) nodes = data.data as TreeNode[]
    else if (Array.isArray(data?.tree)) nodes = data.tree as TreeNode[]
    // Le listener legacy de verrou préfixe parfois une icône <i> HTML au titre : on la retire.
    nodes.forEach((n) => { if (typeof n.title === 'string') n.title = n.title.replace(/<[^>]*>/g, '').trim() })
    return nodes
  } catch { return [] }
}

const box: React.CSSProperties = { borderRadius: 8, border: '1px solid var(--color-border,#e5e7eb)', background: 'var(--color-background,#fff)' }
const btn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, height: 40, width: '100%', boxSizing: 'border-box', padding: '0 12px', cursor: 'pointer', fontSize: 14, color: 'var(--color-foreground)', ...box }

function Node({ node, depth, onPick }: { node: TreeNode; depth: number; onPick: (id: number, title: string) => void }) {
  const [open, setOpen] = useState(false)
  const [children, setChildren] = useState<TreeNode[] | null>(null)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    if (!node.lazy) return
    const next = !open
    setOpen(next)
    if (next && children === null) { setLoading(true); setChildren(await fetchTreeNodes(node.key)); setLoading(false) }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 6px', paddingLeft: 6 + depth * 16 }}>
        <button onClick={toggle} style={{ width: 18, height: 18, border: 0, background: 'transparent', cursor: node.lazy ? 'pointer' : 'default', color: 'var(--color-muted-foreground,#6b7280)', fontSize: 11 }}>{node.lazy ? (open ? '▾' : '▸') : '·'}</button>
        <button onClick={() => onPick(node.key, node.title)} style={{ flex: 1, textAlign: 'left', border: 0, background: 'transparent', cursor: 'pointer', fontSize: 13, padding: '2px 4px', borderRadius: 6, color: 'var(--color-foreground)' }}>{node.title}</button>
      </div>
      {open && (
        <div>
          {loading && <div style={{ paddingLeft: 24 + depth * 16, fontSize: 12, color: 'var(--color-muted-foreground)' }}>…</div>}
          {(children ?? []).map((c) => <Node key={c.key} node={c} depth={depth + 1} onPick={onPick} />)}
        </div>
      )}
    </div>
  )
}

export function PagePicker({ value, title, onChange, placeholder, noneLabel }: {
  value: number
  title?: string
  onChange: (id: number, title: string) => void
  placeholder?: string
  noneLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const [roots, setRoots] = useState<TreeNode[] | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  async function openPanel() {
    setOpen((o) => !o)
    if (roots === null) setRoots(await fetchTreeNodes(-1))
  }

  const display = value ? (title || `Page #${value}`) : (placeholder || '— choisir une page —')

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button style={btn} onClick={openPanel} type="button">
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: value ? 'inherit' : 'var(--color-muted-foreground)' }}>{display}</span>
        <span style={{ color: 'var(--color-muted-foreground)' }}>▾</span>
      </button>
      {open && (
        <div style={{ ...box, position: 'absolute', zIndex: 70, top: 44, left: 0, right: 0, maxHeight: 320, overflow: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,.18)', padding: 6 }}>
          {/* Champ optionnel : entrée pour retirer la page liée. */}
          <button onClick={() => { onChange(0, ''); setOpen(false) }} type="button"
            style={{ width: '100%', textAlign: 'left', border: 0, background: 'transparent', cursor: 'pointer', fontSize: 13, padding: '6px 8px', borderRadius: 6, color: 'var(--color-muted-foreground)', fontStyle: 'italic' }}>
            {noneLabel || '— Aucune —'}
          </button>
          {roots === null ? (
            <div style={{ padding: 12, fontSize: 13, color: 'var(--color-muted-foreground)' }}>Chargement…</div>
          ) : roots.length === 0 ? (
            <div style={{ padding: 12, fontSize: 13, color: 'var(--color-muted-foreground)' }}>Aucune page</div>
          ) : roots.map((n) => <Node key={n.key} node={n} depth={0} onPick={(id, t) => { onChange(id, t); setOpen(false) }} />)}
        </div>
      )}
    </div>
  )
}

export default PagePicker
