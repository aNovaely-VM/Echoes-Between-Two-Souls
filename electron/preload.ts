import { contextBridge } from 'electron'
contextBridge.exposeInMainWorld('electronAPI', {
 
  isElectron: () => true,
  platform: process.platform,
})

console.log('[Echoes] Preload charge - Electron bridge pret')