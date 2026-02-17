import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// En ESM, __dirname n'existe pas. On le recree :
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Detecte si on lance en mode Electron (npm run dev:electron)
// ou en mode navigateur (npm run dev)
const isElectron = process.env.npm_lifecycle_event?.includes('electron')

export default defineConfig(async () => {
  // On ne charge le plugin Electron que si necessaire
  // (en mode navigateur, pas besoin)
  const plugins = []

  if (isElectron) {
    const electron = await import('vite-plugin-electron')
    const electronRenderer = await import('vite-plugin-electron-renderer')

    plugins.push(
      electron.default([
        {
          // Fichier principal d'Electron (le process qui cree la fenetre)
          entry: resolve(__dirname, 'electron/main.ts'),
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
          // Le preload script (bridge securise)
          entry: resolve(__dirname, 'electron/preload.ts'),
          onstart(args: { reload: () => void }) {
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
    )
    plugins.push(electronRenderer.default())
  }

  return {
    root: 'src',
    plugins,
    resolve: {
      alias: {
        '@engine': resolve(__dirname, 'src/game/engine'),
        '@systems': resolve(__dirname, 'src/game/systems'),
        '@entities': resolve(__dirname, 'src/game/entities'),
        '@world': resolve(__dirname, 'src/game/world'),
        '@combat': resolve(__dirname, 'src/game/combat'),
        '@ui': resolve(__dirname, 'src/game/ui'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@scenes': resolve(__dirname, 'src/game/scenes'),
      },
    },
    server: {
      port: 3000,
    },
    build: {
      outDir: resolve(__dirname, 'dist'),
      emptyOutDir: true,
    },
  }
})