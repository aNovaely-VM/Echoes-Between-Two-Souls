/**
 * Game
 * ----
 * Classe principale du jeu. C'est le "chef d'orchestre" qui :
 * - Initialise PixiJS (le moteur de rendu)
 * - Cree le game loop
 * - Gere les scenes (via le SceneManager, ajoute en Phase 2)
 * - Donne acces a tous les systemes du jeu
 *
 * Il n'y a qu'UNE SEULE instance de Game (singleton de fait).
 * Toutes les parties du jeu y accedent pour recuperer les systemes.
 */

import { Application, Container, Text, TextStyle } from 'pixi.js'
import { GameLoop } from './GameLoop'
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  BACKGROUND_COLOR,
  DEBUG_FPS,
} from '../constants'

export class Game {
  /** L'application PixiJS (contient le renderer, le stage, etc.) */
  public app: Application
  /** La boucle de jeu */
  public gameLoop: GameLoop
  /** Le container racine du jeu (tout est enfant de ce container) */
  public stage: Container
  /** Texte d'affichage FPS (debug) */
  private fpsText: Text | null = null
  /** Le jeu est-il initialise ? */
  private initialized: boolean = false

  constructor() {
    this.app = new Application()
    this.gameLoop = new GameLoop()
    this.stage = new Container()
  }

  /**
   * Initialise le jeu et attache le canvas au DOM
   * @param container - L'element HTML qui contiendra le canvas
   */
  async init(container: HTMLElement): Promise<void> {
    if (this.initialized) {
      console.warn('[Game] Deja initialise')
      return
    }

    // Initialise PixiJS avec les parametres du jeu
    await this.app.init({
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: BACKGROUND_COLOR,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      antialias: false, // Pixel art = pas d'antialiasing
      roundPixels: true, // Pixels nets pour le pixel art
    })

    // Ajoute le canvas au DOM
    container.appendChild(this.app.canvas as HTMLCanvasElement)

    // Le stage du jeu est un enfant du stage PixiJS
    this.app.stage.addChild(this.stage)

    // Adapte la taille du canvas a la fenetre
    this.setupResize(container)

    // Affichage FPS en mode debug
    if (DEBUG_FPS) {
      this.setupFPSCounter()
    }

    // Enregistre l'update principal dans le game loop
    this.gameLoop.onUpdate((dt: number) => this.update(dt))

    // Demarre le game loop
    this.gameLoop.start()

    this.initialized = true
    console.log(`[Game] Initialise - ${GAME_WIDTH}x${GAME_HEIGHT}`)
  }

  /**
   * Fonction appelee a chaque frame par le GameLoop
   * @param dt - Delta-time en secondes
   */
  private update(dt: number): void {
    // Phase 1 : pas grand-chose a mettre a jour
    // Phase 2+ : le SceneManager mettra a jour la scene active ici

    // Met a jour le compteur FPS
    if (this.fpsText) {
      this.fpsText.text = `FPS: ${this.gameLoop.currentFPS}`
    }

    // Placeholder pour les futurs systemes
    void dt
  }

  /**
   * Configure le redimensionnement automatique du canvas
   */
  private setupResize(container: HTMLElement): void {
    const resize = (): void => {
      const { clientWidth, clientHeight } = container

      // Calcule le ratio pour garder les proportions du jeu
      const scaleX = clientWidth / GAME_WIDTH
      const scaleY = clientHeight / GAME_HEIGHT
      const scale = Math.min(scaleX, scaleY)

      // Applique le scale au canvas
      const canvas = this.app.canvas as HTMLCanvasElement
      canvas.style.width = `${GAME_WIDTH * scale}px`
      canvas.style.height = `${GAME_HEIGHT * scale}px`

      // Centre le canvas
      canvas.style.position = 'absolute'
      canvas.style.left = `${(clientWidth - GAME_WIDTH * scale) / 2}px`
      canvas.style.top = `${(clientHeight - GAME_HEIGHT * scale) / 2}px`
    }

    window.addEventListener('resize', resize)
    resize() // Appel initial
  }

  /**
   * Cree le compteur FPS (coin superieur gauche)
   */
  private setupFPSCounter(): void {
    const style = new TextStyle({
      fontFamily: 'monospace',
      fontSize: 14,
      fill: 0x00ff00,
      stroke: { color: 0x000000, width: 2 },
    })

    this.fpsText = new Text({ text: 'FPS: 0', style })
    this.fpsText.x = 8
    this.fpsText.y = 8
    this.fpsText.zIndex = 9999

    // Le FPS est toujours par-dessus tout
    this.app.stage.addChild(this.fpsText)
  }

  /**
   * Detruit le jeu et libere toutes les ressources
   */
  destroy(): void {
    this.gameLoop.destroy()
    this.app.destroy(true, { children: true, texture: true })
    this.initialized = false
    console.log('[Game] Detruit')
  }
}
