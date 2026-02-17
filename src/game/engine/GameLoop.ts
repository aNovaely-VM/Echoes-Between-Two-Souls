import { MAX_DELTA_TIME } from '../constants'

/**
 * La boucle de jeu (Game Loop).
 *
 * C'est le COEUR du moteur. Chaque jeu video a une boucle qui fait ca :
 *
 *   Tant que le jeu tourne :
 *     1. Mesurer le temps ecoule depuis la derniere frame (delta-time)
 *     2. Mettre a jour la logique du jeu (physique, IA, etc.)
 *     3. Dessiner le nouveau frame
 *
 * Le delta-time (dt) est CRUCIAL. C'est le temps en SECONDES entre deux frames.
 * A 60 FPS, dt ~= 0.0167 secondes.
 *
 * REGLE : toute vitesse doit etre multipliee par dt.
 *   position += vitesse * dt   (CORRECT : independant du framerate)
 *   position += vitesse         (FAUX : depend du framerate)
 */
type UpdateCallback = (dt: number) => void

export class GameLoop {
  
  private updateFn: UpdateCallback

  private rafId: number = 0

  private lastTime: number = 0

  private running: boolean = false

  private paused: boolean = false

  private frameCount: number = 0

  private fpsLastTime: number = 0

  private _fps: number = 0

  /**
   * @param updateFn - Fonction appelee chaque frame avec le delta-time en secondes
   */
  constructor(updateFn: UpdateCallback) {
    this.updateFn = updateFn
  }

  
  get fps(): number {
    return this._fps
  }
  start(): void {
    if (this.running) return 

    this.running = true
    this.lastTime = performance.now()
    this.fpsLastTime = this.lastTime
    this.frameCount = 0


    this.rafId = requestAnimationFrame((time) => this.loop(time))
  }

 
  stop(): void {
    this.running = false
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = 0
    }
  }

  
  pause(): void {
    this.paused = true
  }


  resume(): void {
    this.paused = false
  
    this.lastTime = performance.now()
  }

  /**
   * LA boucle. Appelee ~60 fois par seconde par le navigateur.
   * @param currentTime - Timestamp en millisecondes fourni par requestAnimationFrame
   */
  private loop(currentTime: number): void {
   
    if (!this.running) return

    this.rafId = requestAnimationFrame((time) => this.loop(time))

    
    let dt = (currentTime - this.lastTime) / 1000
    this.lastTime = currentTime

    if (dt > MAX_DELTA_TIME) {
      dt = MAX_DELTA_TIME
    }

    
    this.frameCount++
    if (currentTime - this.fpsLastTime >= 1000) {
      this._fps = this.frameCount
      this.frameCount = 0
      this.fpsLastTime = currentTime
    }

   
    if (!this.paused) {
      this.updateFn(dt)
    }
  }
}