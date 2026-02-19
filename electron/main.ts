import { app, BrowserWindow } from 'electron'
import { join } from 'path'

/**
 * Process principal d'Electron.
 *
 * Electron a deux types de process :
 * - Le MAIN process (ce fichier) : cree les fenetres, gere le cycle de vie
 * - Le RENDERER process (le jeu) : c'est la page web avec PixiJS
 *
 * Le main process a acces a Node.js (fichiers, OS, etc.)
 * Le renderer n'y a PAS acces (securite), sauf via le preload.
 */

// Taille de la fenetre du jeu
const WINDOW_WIDTH = 1280
const WINDOW_HEIGHT = 720

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    title: 'Echoes Between Two Souls',

    // Pas de barre de menu Windows
    autoHideMenuBar: true,

    // Empecher le redimensionnement pour l'instant
    // (on activera le plein ecran plus tard)
    resizable: false,

    // Le preload script fait le pont entre Node.js et le renderer
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      // SECURITE : pas d'acces direct a Node.js depuis le renderer
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // En dev, charge le serveur Vite
  // En prod, charge le fichier HTML compile
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(join(__dirname, '../dist/index.html'))
  }

  return win
}

// Quand Electron est pret, on cree la fenetre
app.whenReady().then(() => {
  createWindow()

  // Sur macOS, re-cree une fenetre si on clique sur l'icone du dock
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Quitte l'app quand toutes les fenetres sont fermees (sauf macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})