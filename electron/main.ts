/**
 * Electron Main Process
 * ---------------------
 * Cree la fenetre principale du jeu et gere le cycle de vie de l'application.
 * Ce fichier est le point d'entree du process principal Electron.
 *
 * Responsabilites :
 * - Creer la BrowserWindow (fenetre du jeu)
 * - Charger le renderer (Vite dev server ou fichiers builds)
 * - Gerer les evenements de l'application (ready, close, etc.)
 * - Configurer les options de la fenetre (taille, fullscreen, etc.)
 */

import { app, BrowserWindow, screen } from 'electron'
import { join } from 'path'

// Reference a la fenetre principale (evite le garbage collection)
let mainWindow: BrowserWindow | null = null

/**
 * Cree la fenetre principale du jeu
 */
function createWindow(): void {
  // Recupere la taille de l'ecran pour adapter la fenetre
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize

  // Taille par defaut : 1280x720 (720p), maximum la taille de l'ecran
  const windowWidth = Math.min(1280, screenWidth)
  const windowHeight = Math.min(720, screenHeight)

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    minWidth: 960,
    minHeight: 540,
    title: 'Echoes Between Two Souls',
    // Pas de barre de menu (jeu plein ecran)
    autoHideMenuBar: true,
    // Fond noir pendant le chargement
    backgroundColor: '#000000',
    // Centre la fenetre
    center: true,
    // Configuration du renderer
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      // Securite : pas d'acces direct a Node.js depuis le renderer
      nodeIntegration: false,
      contextIsolation: true,
      // Desactive les DevTools en production
      devTools: !app.isPackaged ? true : false,
    },
  })

  // En developpement : charge le serveur Vite
  // En production : charge les fichiers builds
  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }

  // Ouvre les DevTools en developpement
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  }

  // Nettoyage quand la fenetre est fermee
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Empeche le titre de la fenetre de changer
  mainWindow.on('page-title-updated', (event) => {
    event.preventDefault()
  })
}

// === Cycle de vie de l'application ===

// Quand Electron est pret, creer la fenetre
app.whenReady().then(() => {
  createWindow()

  // macOS : re-creer la fenetre si on clique sur l'icone du dock
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Quitter quand toutes les fenetres sont fermees (sauf macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Securite : empecher la creation de nouvelles fenetres
app.on('web-contents-created', (_, contents) => {
  contents.setWindowOpenHandler(() => {
    return { action: 'deny' }
  })
})
