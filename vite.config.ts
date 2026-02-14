import { defineConfig } from 'vite'
import { resolve } from 'path'

// Electron plugins are only loaded when building for Electron
// In dev mode (browser), we skip them so the game runs in the browser too
const isElectron = process.env.npm_lifecycle_event?.includes('electron')

export default defineConfig(async () => {
  const plugins = []

  if (isElectron) {
    const electron = await import('vite-plugin-electron')
    const electronRenderer = await import('vite-plugin-electron-renderer')
    plugins.push(
      electron.default([
        {
          entry: 'electron/main.ts',
          vite: {
            build: {
              outDir: 'dist-electron',
              rollupOptions: {
                external: ['electron'],
              },
            },
          },
        },
        {
          entry: 'electron/preload.ts',
          onstart(args) {
            args.reload()
          },
          vite: {
            build: {
              outDir: 'dist-electron',
              rollupOptions: {
                external: ['electron'],
              },
            },
          },
        },
      ]),
      electronRenderer.default()
    )
  }

  return {
    root: 'src',
    publicDir: resolve(__dirname, 'public'),
    plugins,
    resolve: {
      alias: {
        '@engine': resolve(__dirname, 'src/game/engine'),
        '@systems': resolve(__dirname, 'src/game/systems'),
        '@entities': resolve(__dirname, 'src/game/entities'),
        '@world': resolve(__dirname, 'src/game/world'),
        '@combat': resolve(__dirname, 'src/game/combat'),
        '@ai': resolve(__dirname, 'src/game/ai'),
        '@ui': resolve(__dirname, 'src/game/ui'),
        '@scenes': resolve(__dirname, 'src/game/scenes'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@': resolve(__dirname, 'src'),
      },
    },
    build: {
      outDir: resolve(__dirname, 'dist'),
      emptyOutDir: true,
    },
    server: {
      port: 3000,
    },
  }
})
