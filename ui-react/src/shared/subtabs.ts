/**
 * Lecture des sous-onglets ouverts publiés par l'hôte.
 *
 * Les globals `__melisOpenSubTab` / `__melisCloseSubTab` (SubTabWindowBridge, melis-core) sont
 * write-only : une brique ne pouvait pas observer une fermeture déclenchée par la croix de la
 * SubTabBar. L'hôte publie donc aussi l'état courant (`window.__melisSubTabs` + événement
 * `melis:subtabs-changed`).
 *
 * C'est ce qui permet à une brique montée en permanence (manifest `persistent: true`) de garder un
 * écran monté par enregistrement ouvert, au lieu de le remonter (et refetcher) à chaque changement
 * de sous-onglet. Copie conforme du fichier homonyme de melis-cms-user-account (les briques sont
 * des bundles séparés : pas d'import croisé possible).
 */
import { useEffect, useState } from 'react'

const SUBTABS_CHANGED = 'melis:subtabs-changed'

type SubTab = { id: string; label: string; path: string }
const host = window as unknown as { __melisSubTabs?: Record<string, { tabs: SubTab[] }> }

/** Chemins des sous-onglets actuellement ouverts pour `section` (= la route racine de l'outil). */
export function readOpenSubTabPaths(section: string): string[] {
  return host.__melisSubTabs?.[section]?.tabs.map((t) => t.path) ?? []
}

/** Variante réactive : re-rend l'appelant à chaque ouverture/fermeture de sous-onglet. */
export function useOpenSubTabPaths(section: string): string[] {
  const [paths, setPaths] = useState<string[]>(() => readOpenSubTabPaths(section))
  useEffect(() => {
    const sync = () => setPaths((prev) => {
      const next = readOpenSubTabPaths(section)
      // Même contenu → on garde la référence, pour ne pas re-rendre (ni remonter) pour rien.
      return prev.length === next.length && prev.every((p, i) => p === next[i]) ? prev : next
    })
    sync()
    window.addEventListener(SUBTABS_CHANGED, sync)
    return () => window.removeEventListener(SUBTABS_CHANGED, sync)
  }, [section])
  return paths
}
