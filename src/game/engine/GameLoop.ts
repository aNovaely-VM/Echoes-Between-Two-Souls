import { MAX_DELTA_TIME } from '../constants'

/** */
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

  constructor(updateFn: UpdateCallback) {
    this.updateFn = updateFn
  }

  get fps(): number {
    return this._fps
  }

  /** Demarre la boucle et initialise le temps */
  start(): void {
    if (this.running) return 

    this.running = true
    this.lastTime = performance.now()
    this.fpsLastTime = this.lastTime
    this.frameCount = 0

    this.rafId = requestAnimationFrame((time) => this.loop(time))
  }

  private loop(currentTime: number): void {
    if (!this.running) return

    // Demande la frame suivante immediatement
    this.rafId = requestAnimationFrame((time) => this.loop(time))

    let dt = (currentTime - this.lastTime) / 1000
    this.lastTime = currentTime

    if (dt > MAX_DELTA_TIME) {
      dt = MAX_DELTA_TIME
    }

    // Calcul du FPS
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