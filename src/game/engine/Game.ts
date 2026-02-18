import { Application, Text, TextStyle } from 'pixi.js'
import { GAME_WIDTH, GAME_HEIGHT, BG_COLOR } from '../constants'
import { GameLoop } from './GameLoop'
export class Game {
  private app!: Application
  private gameLoop!: GameLoop
  private fpsText!: Text
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

    console.log(`[Echoes] PixiJS initialise (${GAME_WIDTH}x${GAME_HEIGHT})`)
  }

  start(): void {
    this.gameLoop.start()
    console.log('[Echoes] Game loop demarree')
  }

  private update(_dt: number): void {
    this.fpsText.text = `FPS: ${this.gameLoop.fps}`
  }


  private createFPSCounter(): void {
    const style = new TextStyle({
      fontFamily: 'monospace',
      fontSize: 14,
      fill: 0x00ff00, 
      stroke: { color: 0x000000, width: 2 },
    })

    this.fpsText = new Text({ text: 'FPS: 0', style })
    this.fpsText.x = 8
    this.fpsText.y = 8

    this.app.stage.addChild(this.fpsText)
  }
}