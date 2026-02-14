/**
 * Point d'entree du Renderer
 * --------------------------
 * Ce fichier est charge par index.html.
 * Il cree l'instance du jeu et la lance.
 *
 * C'est le SEUL fichier qui touche au DOM directement.
 * Tout le reste du jeu passe par PixiJS.
 */

import { Game } from './game/engine/Game'

// === Demarrage du jeu ===

async function main(): Promise<void> {
  // Recupere le container HTML
  const container = document.getElementById('game')
  if (!container) {
    throw new Error('[main] Element #game introuvable dans le DOM')
  }

  // Supprime le message de chargement
  const loading = document.getElementById('loading')
  if (loading) {
    loading.remove()
  }

  // Cree et initialise le jeu
  const game = new Game()

  try {
    await game.init(container)
    console.log('[main] Jeu demarre avec succes')
  } catch (error) {
    console.error('[main] Erreur au demarrage du jeu:', error)

    // Affiche un message d'erreur a l'utilisateur
    container.innerHTML = `
      <div style="color: #ff4444; font-family: monospace; padding: 20px; text-align: center;">
        <h2>Erreur de chargement</h2>
        <p>${error instanceof Error ? error.message : 'Erreur inconnue'}</p>
        <p style="color: #666; margin-top: 10px;">Verifiez la console pour plus de details (F12)</p>
      </div>
    `
  }

  // Gestion de la fermeture propre
  window.addEventListener('beforeunload', () => {
    game.destroy()
  })

  // Expose le jeu en mode developpement (pour debug dans la console)
  if (import.meta.env.DEV) {
    ;(window as unknown as Record<string, unknown>).game = game
  }
}

// Lance le jeu quand le DOM est pret
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main)
} else {
  main()
}
