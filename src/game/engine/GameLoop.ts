/**
 * GameLoop
 * --------
 * Gere la boucle principale du jeu avec un delta-time stable.
 *
 * Fonctionnement :
 * - Utilise le ticker de PixiJS (requestAnimationFrame interne)
 * - Calcule le delta-time en secondes (pas en millisecondes)
 * - Clamp le delta pour eviter les "spirales de la mort" (si le jeu freeze)
 * - Supporte pause/resume
 *
 * Le delta-time (dt) represente le temps ecoule depuis la derniere frame.
 * Toutes les vitesses du jeu sont en "pixels par seconde", donc on multiplie
 * toujours par dt :   position += vitesse * dt
 */

import { Ticker } from 'pixi.js'

/** Callback appele a chaque frame avec le delta-time en secondes */
export type UpdateCallback = (dt: number) => void

export class GameLoop {
  /** Ticker PixiJS qui gere le requestAnimationFrame */
  private ticker: Ticker
  /** Liste des callbacks a appeler chaque frame */
  private updateCallbacks: UpdateCallback[] = []
  /** Est-ce que le jeu est en pause ? */
  private paused: boolean = false
  /** Compteur FPS */
  private frameCount: number = 0
  /** Timestamp du dernier calcul FPS */
  private fpsTime: number = 0
  /** FPS actuel */
  public currentFPS: number = 0
  /** Delta-time max en secondes (evite les gros sauts) */
  private readonly MAX_DELTA: number = 1 / 20 // 50ms max

  constructor() {
    this.ticker = new Ticker()
    this.ticker.maxFPS = 60
  }

  /**
   * Demarre la boucle de jeu
   */
  start(): void {
    this.ticker.add(() => {
      if (this.paused) return

      // Le ticker de PixiJS donne le delta en "frames" (1 = 16.67ms a 60fps)
      // On le convertit en secondes
      let dt = this.ticker.deltaMS / 1000

      // Clamp pour eviter les gros delta-time (lag, changement d'onglet, etc.)
      if (dt > this.MAX_DELTA) {
        dt = this.MAX_DELTA
      }

      // Calcul du FPS
      this.frameCount++
      this.fpsTime += dt
      if (this.fpsTime >= 1) {
        this.currentFPS = this.frameCount
        this.frameCount = 0
        this.fpsTime -= 1
      }

      // Appelle tous les callbacks enregistres
      for (const callback of this.updateCallbacks) {
        callback(dt)
      }
    })

    this.ticker.start()
  }

  /**
   * Arrete la boucle de jeu
   */
  stop(): void {
    this.ticker.stop()
  }

  /**
   * Met le jeu en pause (le ticker tourne toujours, mais les updates sont ignorees)
   */
  pause(): void {
    this.paused = true
  }

  /**
   * Reprend le jeu apres une pause
   */
  resume(): void {
    this.paused = false
  }

  /**
   * Retourne l'etat de pause
   */
  isPaused(): boolean {
    return this.paused
  }

  /**
   * Enregistre un callback qui sera appele a chaque frame
   * @param callback - Fonction recevant le delta-time en secondes
   */
  onUpdate(callback: UpdateCallback): void {
    this.updateCallbacks.push(callback)
  }

  /**
   * Retire un callback de la boucle
   */
  offUpdate(callback: UpdateCallback): void {
    const index = this.updateCallbacks.indexOf(callback)
    if (index !== -1) {
      this.updateCallbacks.splice(index, 1)
    }
  }

  /**
   * Detruit la boucle de jeu et libere les ressources
   */
  destroy(): void {
    this.ticker.stop()
    this.ticker.destroy()
    this.updateCallbacks = []
  }
}
