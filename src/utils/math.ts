/**
 * Utilitaires mathematiques
 * -------------------------
 * Fonctions utilisees partout dans le jeu.
 * Pas de dependances externes -- que du TypeScript pur.
 */

/**
 * Clamp une valeur entre un minimum et un maximum
 * @example clamp(150, 0, 100) // retourne 100
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Interpolation lineaire entre deux valeurs
 * @param a - Valeur de depart
 * @param b - Valeur d'arrivee
 * @param t - Facteur d'interpolation (0 = a, 1 = b)
 * @example lerp(0, 100, 0.5) // retourne 50
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * Distance entre deux points
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1
  const dy = y2 - y1
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Distance au carre (plus rapide, utile pour les comparaisons)
 */
export function distanceSquared(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1
  const dy = y2 - y1
  return dx * dx + dy * dy
}

/**
 * Convertit des degres en radians
 */
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Convertit des radians en degres
 */
export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI)
}

/**
 * Retourne un nombre aleatoire entre min (inclus) et max (exclus)
 */
export function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

/**
 * Retourne un entier aleatoire entre min (inclus) et max (inclus)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Verifie si deux rectangles AABB se chevauchent
 */
export function aabbOverlap(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by
}

/**
 * Signe d'un nombre (-1, 0, ou 1)
 */
export function sign(value: number): number {
  if (value > 0) return 1
  if (value < 0) return -1
  return 0
}

/**
 * Approche une valeur vers une cible (utile pour la deceleration)
 * @param current - Valeur actuelle
 * @param target - Valeur cible
 * @param step - Pas d'approche (toujours positif)
 */
export function approach(current: number, target: number, step: number): number {
  if (current < target) {
    return Math.min(current + step, target)
  } else if (current > target) {
    return Math.max(current - step, target)
  }
  return target
}
