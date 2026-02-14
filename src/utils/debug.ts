/**
 * Utilitaires de debug
 * --------------------
 * Outils pour le developpement : affichage hitboxes, logs conditionels, etc.
 * Tout est desactive en production automatiquement.
 */

const IS_DEV = import.meta.env.DEV

/**
 * Log conditionnel -- n'affiche rien en production
 */
export function debugLog(category: string, ...args: unknown[]): void {
  if (IS_DEV) {
    console.log(`[${category}]`, ...args)
  }
}

/**
 * Warning conditionnel
 */
export function debugWarn(category: string, ...args: unknown[]): void {
  if (IS_DEV) {
    console.warn(`[${category}]`, ...args)
  }
}

/**
 * Mesure le temps d'execution d'une fonction
 */
export function measureTime<T>(label: string, fn: () => T): T {
  if (!IS_DEV) return fn()

  const start = performance.now()
  const result = fn()
  const end = performance.now()
  console.log(`[Perf] ${label}: ${(end - start).toFixed(2)}ms`)
  return result
}

/**
 * Compteur simple pour le profiling
 */
export class DebugCounter {
  private counts: Map<string, number> = new Map()

  increment(key: string): void {
    this.counts.set(key, (this.counts.get(key) || 0) + 1)
  }

  reset(): void {
    this.counts.clear()
  }

  log(): void {
    if (!IS_DEV) return
    this.counts.forEach((count, key) => {
      console.log(`[Counter] ${key}: ${count}`)
    })
  }
}
