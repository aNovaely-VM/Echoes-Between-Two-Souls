/**
 * Electron Preload Script
 * -----------------------
 * Bridge securise entre le process principal (Node.js) et le renderer (PixiJS).
 * 
 * IMPORTANT : Ce fichier s'execute dans un contexte isole.
 * On utilise `contextBridge` pour exposer UNIQUEMENT les API dont le jeu a besoin,
 * sans donner un acces complet a Node.js (securite).
 *
 * Le renderer accede a ces API via `window.electronAPI`.
 */

import { contextBridge, ipcRenderer } from 'electron'

// API exposees au renderer de facon securisee
contextBridge.exposeInMainWorld('electronAPI', {
  // === Informations plateforme ===
  platform: process.platform,
  isPackaged: process.argv.includes('--packaged'),

  // === Gestion de la fenetre ===
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close'),
    setFullscreen: (fullscreen: boolean) =>
      ipcRenderer.send('window:fullscreen', fullscreen),
    getSize: () => ipcRenderer.invoke('window:getSize'),
  },

  // === Systeme de fichiers (pour les sauvegardes) ===
  save: {
    write: (filename: string, data: string) =>
      ipcRenderer.invoke('save:write', filename, data),
    read: (filename: string) =>
      ipcRenderer.invoke('save:read', filename),
    exists: (filename: string) =>
      ipcRenderer.invoke('save:exists', filename),
    list: () => ipcRenderer.invoke('save:list'),
  },

  // === Communication generale ===
  on: (channel: string, callback: (...args: unknown[]) => void) => {
    const validChannels = ['game:pause', 'game:resume', 'game:focus', 'game:blur']
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => callback(...args))
    }
  },

  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel)
  },
})

// Declaration TypeScript pour que le renderer connaisse les types
declare global {
  interface Window {
    electronAPI?: {
      platform: string
      isPackaged: boolean
      window: {
        minimize: () => void
        maximize: () => void
        close: () => void
        setFullscreen: (fullscreen: boolean) => void
        getSize: () => Promise<{ width: number; height: number }>
      }
      save: {
        write: (filename: string, data: string) => Promise<boolean>
        read: (filename: string) => Promise<string | null>
        exists: (filename: string) => Promise<boolean>
        list: () => Promise<string[]>
      }
      on: (channel: string, callback: (...args: unknown[]) => void) => void
      removeAllListeners: (channel: string) => void
    }
  }
}
