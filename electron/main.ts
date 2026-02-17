import { app, BrowserWindow } from 'electron'
import { join } from 'path'

const WINDOW_WIDTH = 1280
const WINDOW_HEIGHT = 720

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    title: 'Echoes Between Two Souls',
    autoHideMenuBar: true,
    resizable: false,


      preload: join(__dirname, 'preload.js'),
      
      nodeIntegration: false,
      contextIsolation: true,
    },
  })
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(join(__dirname, '../dist/index.html'))
  }

  return win
}
app.whenReady().then(() => {
  createWindow()

  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})