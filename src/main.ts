import { Game } from './game/engine/Game'
async function bootstrap(): Promise<void> {
  const container = document.getElementById('game')
  if (!container) {
    throw new Error('Element #game introuvable dans le HTML')
  }
  const game = new Game()
  await game.init(container)
  game.start()

  console.log('[Echoes] Jeu demarre avec succes')
}

bootstrap().catch((error) => {
  console.error('[Echoes] Erreur fatale au demarrage :', error)
})