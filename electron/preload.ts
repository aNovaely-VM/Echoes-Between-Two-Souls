import { contextBridge } from 'electron'

/**
 * Preload script.
 *
 * Ce fichier s'execute AVANT la page web, dans un contexte isole.
 * Il sert de pont securise entre Node.js et le renderer.
 *
 * Pour l'instant il est presque vide.
 * Plus tard on y exposera :
 * - L'acces au systeme de fichiers (sauvegarde)
 * - Les infos de la plateforme (OS, chemins)
 * - L'API Steam
 */

// Expose des fonctions au renderer via window.electronAPI
contextBridge.exposeInMainWorld('electronAPI', {
  // Pour l'instant, juste une fonction pour savoir si on est dans Electron
  isElectron: () => true,

  // Infos de la plateforme
  platform: process.platform, // 'win32', 'darwin', ou 'linux'
})

console.log('[Echoes] Preload charge - Electron bridge pret')