import { Game } from './game/engine/Game'

/**
 * Point d'entree du jeu.
 *
 * Ce fichier fait UNE seule chose :
 * 1. Cree une instance de Game
 * 2. L'initialise (creation du canvas PixiJS)
 * 3. Demarre la boucle de jeu
 *
 * Toute la logique est dans Game.ts. Ce fichier reste minimaliste.
 */
async function bootstrap(): Promise<void> {
  const container = document.getElementById('game')
  if (!container) {
    throw new Error('Element #game introuvable dans le HTML')
  }

  // Cree et initialise le jeu
  const game = new Game()
  await game.init(container)

  // Lance la boucle de jeu
  game.start()

  // Log pour confirmer que tout fonctionne
  console.log('[Echoes] Jeu demarre avec succes')
}

// Lance le bootstrap et attrape les erreurs
bootstrap().catch((error) => {
  console.error('[Echoes] Erreur fatale au demarrage :', error)
})