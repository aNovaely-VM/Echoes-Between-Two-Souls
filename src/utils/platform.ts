/**
 * Utilitaires plateforme
 * ----------------------
 * Detection de l'environnement d'execution (Electron vs navigateur),
 * gestion fullscreen, et informations systeme.
 */

/**
 * Detecte si on tourne dans Electron ou dans un navigateur classique
 */
export function isElectron(): boolean {
  return typeof window !== 'undefined' && window.electronAPI !== undefined
}

/**
 * Retourne la plateforme (win32, darwin, linux, ou 'web')
 */
export function getPlatform(): string {
  if (isElectron() && window.electronAPI) {
    return window.electronAPI.platform
  }
  return 'web'
}

/**
 * Bascule en plein ecran
 * - En Electron : utilise l'API Electron
 * - En navigateur : utilise l'API Fullscreen du navigateur
 */
export async function toggleFullscreen(): Promise<void> {
  if (isElectron() && window.electronAPI) {
    // TODO: implementer via IPC Electron
    return
  }

  // Fallback navigateur
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen()
  } else {
    await document.exitFullscreen()
  }
}

/**
 * Retourne true si on est en plein ecran
 */
export function isFullscreen(): boolean {
  return !!document.fullscreenElement
}
