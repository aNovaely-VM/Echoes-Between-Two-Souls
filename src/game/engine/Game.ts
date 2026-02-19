import { Application, Graphics, Text, TextStyle } from 'pixi.js'
import { GAME_WIDTH, GAME_HEIGHT, BG_COLOR } from '../constants'
import { GameLoop } from './GameLoop'

export class Game {
  private app!: Application
  private gameLoop!: GameLoop
  private fpsText!: Text
  private testSquare!: Graphics // Pour le test visuel

  async init(container: HTMLElement): Promise<void> {
    this.app = new Application()

    await this.app.init({
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: BG_COLOR,
      antialias: false,
      resolution: 1,
    })

    container.appendChild(this.app.canvas)
    this.createFPSCounter()
    this.gameLoop = new GameLoop((dt: number) => this.update(dt))
  }

  start(): void {
    this.gameLoop.start()
  }

  private update(_dt: number): void {
    if (this.fpsText) {
      this.fpsText.text = `FPS: ${this.gameLoop.fps}`
    }
  }

  private createFPSCounter(): void {
    const style = new TextStyle({
      fontFamily: 'Arial', // Changé pour une police plus standard
      fontSize: 24,        // Plus gros pour être sûr
      fill: 0x00ff00,      // Vert
    })

    this.fpsText = new Text({ text: 'FPS: 0', style })
    this.fpsText.x = 20
    this.fpsText.y = 20
    this.app.stage.addChild(this.fpsText)
  }
}