# PHASE 1 -- FONDATIONS
# Guide ultra detaille pour deux developpeurs

---

## OBJECTIF DE CETTE PHASE

A la fin de cette phase, vous aurez :
- Un projet TypeScript configure avec Vite
- Une fenetre Electron qui lance le jeu
- Un canvas PixiJS noir (1280x720)
- Une boucle de jeu (game loop) qui tourne a 60fps avec un compteur FPS visible
- Rien de jouable. C'est normal. Ce sont les fondations.

---

## PREREQUIS -- A FAIRE PAR LES DEUX DEVS

### 1. Installer les outils

Ouvrez un terminal et verifiez que vous avez tout :

```bash
node --version
# Doit afficher v20.x.x ou superieur. Sinon : https://nodejs.org

npm --version
# Doit afficher 10.x.x ou superieur (installe avec Node)

git --version
# Doit afficher 2.x.x. Sinon : https://git-scm.com
```

### 2. Installer VS Code + extensions

Allez sur https://code.visualstudio.com et installez-le.
Puis ouvrez VS Code et installez ces extensions (Ctrl+Shift+X) :

- **ESLint** (par Microsoft) -- souligne les erreurs dans le code
- **TypeScript Importer** -- auto-complete les imports
- **GitLens** -- voir qui a modifie quoi dans Git

### 3. Cloner le repo

```bash
git clone https://github.com/aNovaely-VM/Echoes-Between-Two-Souls.git
cd Echoes-Between-Two-Souls
```

Vous etes maintenant dans le dossier du projet. Tout ce qui suit se fait ICI.

---

## REPARTITION DES ROLES

Pour tout le projet, on repartit les taches entre **Dev A** et **Dev B** :

| | Dev A -- "Le Moteur" | Dev B -- "L'Architecte" |
|---|---|---|
| **Specialite** | Gameplay, physique, entites | Infrastructure, monde, UI |
| **Phase 1** | Game.ts, GameLoop.ts, constants.ts | package.json, configs, Electron, index.html, main.ts |

**Decidez maintenant qui est Dev A et qui est Dev B. Ca ne change plus.**

---

## ETAPE 1 -- Creer les branches Git (chaque dev sur la sienne)

```bash
# Dev A fait :
git checkout -b phase1/dev-a

# Dev B fait :
git checkout -b phase1/dev-b
```

Vous travaillez chacun sur votre branche. Pas de conflits possibles.

---

## ETAPE 2 -- TRAVAIL DE DEV B (infrastructure)

Dev B fait tout dans cette etape. Dev A, passe a l'etape 3.

### 2.1 Creer le package.json

C'est le fichier qui liste toutes les dependances du projet.
A la racine du projet, creez le fichier `package.json` :

```bash
# NE PAS faire npm init. Creez le fichier a la main.
```

Ouvrez VS Code, creez un fichier `package.json` a la racine, et collez ceci :

```json
{
  "name": "echoes-between-two-souls",
  "version": "0.1.0",
  "description": "Jeu 2D cooperatif -- Electron + PixiJS",
  "type": "module",
  "main": "dist-electron/main.js",
  "scripts": {
    "dev": "vite",
    "dev:electron": "vite --mode electron",
    "build": "tsc && vite build",
    "build:electron": "vite build --mode electron && electron-builder",
    "typecheck": "tsc --noEmit",
    "preview": "vite preview"
  },
  "dependencies": {
    "pixi.js": "^8.6.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "vite": "^6.1.0",
    "electron": "^33.3.0",
    "electron-builder": "^25.1.0",
    "vite-plugin-electron": "^0.28.0",
    "vite-plugin-electron-renderer": "^0.14.0",
    "@types/node": "^22.0.0"
  }
}
```

**Explication ligne par ligne :**
- `"type": "module"` : on utilise les imports ES6 (`import/export`), pas les vieux `require()`
- `"main"` : pointe vers le fichier Electron compile (on verra plus tard)
- `"dev"` : lance Vite en mode navigateur (pour tester sans Electron)
- `"dev:electron"` : lance Vite + Electron ensemble
- `"pixi.js"` : le moteur de rendu 2D (c'est lui qui dessine tout)
- `"electron"` : le wrapper qui transforme une page web en app desktop
- `"vite"` : le bundler ultra-rapide qui compile le TypeScript
- `"vite-plugin-electron"` : fait le pont entre Vite et Electron

### 2.2 Installer les dependances

Dans le terminal, a la racine du projet :

```bash
npm install
```

Ca va creer un dossier `node_modules/` (enorme, ~500 Mo, c'est normal) et un `package-lock.json`.

**IMPORTANT** : `node_modules` ne doit JAMAIS etre dans Git. On va s'en occuper bientot.

### 2.3 Creer le tsconfig.json

Creez le fichier `tsconfig.json` a la racine :

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "baseUrl": ".",
    "paths": {
      "@engine/*": ["src/game/engine/*"],
      "@systems/*": ["src/game/systems/*"],
      "@entities/*": ["src/game/entities/*"],
      "@world/*": ["src/game/world/*"],
      "@combat/*": ["src/game/combat/*"],
      "@ui/*": ["src/game/ui/*"],
      "@utils/*": ["src/utils/*"],
      "@scenes/*": ["src/game/scenes/*"]
    }
  },
  "include": ["src/**/*.ts", "electron/**/*.ts"],
  "exclude": ["node_modules", "dist", "dist-electron"]
}
```

**Explication des points cles :**
- `"strict": true` : TypeScript est en mode strict. Ca force a typer correctement tout le code. C'est penible au debut mais ca evite des dizaines de bugs.
- `"paths"` : les alias. Au lieu d'ecrire `import { Game } from '../../../game/engine/Game'` vous ecrirez `import { Game } from '@engine/Game'`. Beaucoup plus lisible.
- `"target": "ES2022"` : on cible un JavaScript moderne (car Electron embarque un Chromium recent).

### 2.4 Creer le vite.config.ts

Creez le fichier `vite.config.ts` a la racine :

```typescript
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
```

**Explication :**
- `root: 'src'` : Vite cherche le `index.html` dans `src/`, pas a la racine.
- Le plugin Electron n'est charge que quand on fait `npm run dev:electron`. En mode `npm run dev`, le jeu tourne dans le navigateur.
- Les `alias` correspondent aux `paths` du tsconfig. Vite en a besoin aussi pour resoudre les imports.

### 2.5 Creer le .gitignore

Creez le fichier `.gitignore` a la racine :

```
# Dependances
node_modules/

# Build
dist/
dist-electron/

# Fichiers systeme
.DS_Store
Thumbs.db

# Editeur
.vscode/settings.json
*.swp
*.swo

# Electron
release/

# Environnement
.env
.env.local

# Steam (ne pas partager votre appid en public si c'est un vrai projet)
steam_appid.txt
```

### 2.6 Creer l'index.html

Creez le dossier `src/` puis le fichier `src/index.html` :

```bash
mkdir src
```

Contenu de `src/index.html` :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Echoes Between Two Souls</title>
  <style>
    /* Reset complet : aucun espace, aucune marge, fond noir */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;       /* Pas de scrollbar */
      background-color: #000; /* Fond noir */
    }

    #game {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /* Le canvas PixiJS sera injecte dans #game par le code */
    canvas {
      display: block;
    }
  </style>
</head>
<body>
  <div id="game"></div>
  <!-- Ce script charge tout le jeu -->
  <script type="module" src="/main.ts"></script>
</body>
</html>
```

**Explication :**
- Le `<div id="game">` est le conteneur ou PixiJS va injecter son `<canvas>`.
- Le `<script type="module" src="/main.ts">` dit au navigateur de charger le point d'entree TypeScript. Vite le compile a la volee.
- Le CSS fait en sorte que le canvas prenne tout l'ecran sans marges.

### 2.7 Creer le point d'entree src/main.ts

Creez le fichier `src/main.ts` :

```typescript
import { Game } from './game/engine/Game'

/**
 * Point d'entree du jeu.
 *
 * Ce fichier fait UNE seule chose :
 * 1. Cree une instance de Game
 * 2. L'initialise (creation du canvas PixiJS)
 * 3. Demarre la boucle de jeu
 *
 * Toute la logique est dans Game.ts. Ce fichier reste minimaliste.
 */
async function bootstrap(): Promise<void> {
  // Trouve le conteneur HTML
  const container = document.getElementById('game')
  if (!container) {
    throw new Error('Element #game introuvable dans le HTML')
  }

  // Cree et initialise le jeu
  const game = new Game()
  await game.init(container)

  // Lance la boucle de jeu
  game.start()

  // Log pour confirmer que tout fonctionne
  console.log('[Echoes] Jeu demarre avec succes')
}

// Lance le bootstrap et attrape les erreurs
bootstrap().catch((error) => {
  console.error('[Echoes] Erreur fatale au demarrage :', error)
})
```

### 2.8 Creer le dossier Electron

Creez le dossier `electron/` a la racine et le fichier `electron/main.ts` :

```bash
mkdir electron
```

Contenu de `electron/main.ts` :

```typescript
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
```

Puis creez `electron/preload.ts` :

```typescript
import { contextBridge } from 'electron'

/**
 * Preload script.
 *
 * Ce fichier s'execute AVANT la page web, dans un contexte isole.
 * Il sert de pont securise entre Node.js et le renderer.
 *
 * Pour l'instant il est presque vide.
 * Plus tard on y exposera :
 * - L'acces au systeme de fichiers (sauvegarde)
 * - Les infos de la plateforme (OS, chemins)
 * - L'API Steam
 */

// Expose des fonctions au renderer via window.electronAPI
contextBridge.exposeInMainWorld('electronAPI', {
  // Pour l'instant, juste une fonction pour savoir si on est dans Electron
  isElectron: () => true,

  // Infos de la plateforme
  platform: process.platform, // 'win32', 'darwin', ou 'linux'
})

console.log('[Echoes] Preload charge - Electron bridge pret')
```

### 2.9 Commit de Dev B

Quand tout est fait :

```bash
git add .
git commit -m "phase1: infrastructure (package.json, configs, electron, html, main.ts)"
```

---

## ETAPE 3 -- TRAVAIL DE DEV A (moteur de jeu)

Dev A fait tout dans cette etape. Dev B, attends ou relis le code de l'etape 2.

**IMPORTANT** : Dev A, tu as besoin des fichiers de Dev B pour que ca compile.
Deux options :
- **Option 1 (recommandee)** : Dev B push sa branche, Dev A merge avant de commencer
- **Option 2** : Dev A cree aussi le package.json minimal juste pour installer les deps, puis supprime quand on merge

On recommande l'option 1. Dev B push d'abord :

```bash
# Dev B fait :
git push origin phase1/dev-b
```

Puis Dev A recupere le travail de Dev B :

```bash
# Dev A fait :
git fetch origin
git merge origin/phase1/dev-b
npm install
```

Maintenant Dev A a toutes les deps installees et peut commencer.

### 3.1 Creer le fichier de constantes

Creez les dossiers et le fichier `src/game/constants.ts` :

```bash
mkdir -p src/game/engine
```

Contenu de `src/game/constants.ts` :

```typescript
/**
 * CONSTANTES DU JEU
 *
 * REGLE D'OR : aucun chiffre "magique" dans le code.
 * Toute valeur numerique du jeu est definie ICI.
 *
 * Pourquoi ?
 * 1. On sait ou trouver chaque valeur
 * 2. On peut tout modifier sans chercher dans 50 fichiers
 * 3. Ca documente le code (GRAVITY = 980 est plus clair que juste 980)
 *
 * Les unites :
 * - Distances : en PIXELS
 * - Vitesses : en PIXELS PAR SECONDE
 * - Temps : en SECONDES
 * - Angles : en RADIANS
 */

// === RENDU ===

/** Largeur du canvas en pixels */
export const GAME_WIDTH = 1280

/** Hauteur du canvas en pixels */
export const GAME_HEIGHT = 720

/** Couleur de fond du canvas (noir) */
export const BG_COLOR = 0x000000

/** FPS cible. Le jeu essaie de tourner a cette vitesse. */
export const TARGET_FPS = 60

/**
 * Delta-time maximum autorise (en secondes).
 * Si une frame prend plus que ca (ex: alt-tab), on "clamp" le dt
 * pour eviter que le joueur traverse les murs d'un coup.
 * 0.05s = 50ms = equivalent de 20 FPS minimum.
 */
export const MAX_DELTA_TIME = 0.05

// === PHYSIQUE ===

/**
 * Gravite en pixels/seconde^2.
 * 980 donne un feeling proche de la realite (9.8 m/s^2 * 100 pixels/metre).
 * Augmentez pour un jeu plus "lourd", diminuez pour plus "flottant".
 */
export const GRAVITY = 980

/**
 * Vitesse terminale (chute max) en pixels/seconde.
 * Empeche le joueur de tomber infiniment vite.
 */
export const TERMINAL_VELOCITY = 600

// === JOUEUR (on les utilisera en Phase 3) ===

/** Vitesse de deplacement horizontal en pixels/seconde */
export const PLAYER_SPEED = 200

/** Force du saut (vitesse verticale initiale) en pixels/seconde */
export const JUMP_FORCE = 400

/** Acceleration horizontale en pixels/seconde^2 */
export const PLAYER_ACCEL = 1200

/** Friction au sol (multiplicateur par frame, 0-1). Plus bas = plus de friction. */
export const GROUND_FRICTION = 0.85

/** Friction en l'air (moins de friction pour plus de controle aerien) */
export const AIR_FRICTION = 0.95

/** Duree du coyote time en secondes (peut sauter apres avoir quitte le sol) */
export const COYOTE_TIME = 0.08

/** Duree du jump buffer en secondes (saut enregistre avant l'atterrissage) */
export const JUMP_BUFFER_TIME = 0.1

// === MONDE (on les utilisera en Phase 4) ===

/** Taille d'une tile en pixels (les tiles sont des carres) */
export const TILE_SIZE = 32
```

### 3.2 Creer le GameLoop

Creez le fichier `src/game/engine/GameLoop.ts` :

```typescript
import { MAX_DELTA_TIME } from '../constants'

/**
 * La boucle de jeu (Game Loop).
 *
 * C'est le COEUR du moteur. Chaque jeu video a une boucle qui fait ca :
 *
 *   Tant que le jeu tourne :
 *     1. Mesurer le temps ecoule depuis la derniere frame (delta-time)
 *     2. Mettre a jour la logique du jeu (physique, IA, etc.)
 *     3. Dessiner le nouveau frame
 *
 * Le delta-time (dt) est CRUCIAL. C'est le temps en SECONDES entre deux frames.
 * A 60 FPS, dt ~= 0.0167 secondes.
 *
 * REGLE : toute vitesse doit etre multipliee par dt.
 *   position += vitesse * dt   (CORRECT : independant du framerate)
 *   position += vitesse         (FAUX : depend du framerate)
 */

/** Type de la fonction de mise a jour appelee chaque frame */
type UpdateCallback = (dt: number) => void

export class GameLoop {
  /** La fonction a appeler chaque frame avec le delta-time */
  private updateFn: UpdateCallback

  /** ID du requestAnimationFrame (pour pouvoir l'annuler) */
  private rafId: number = 0

  /** Timestamp de la frame precedente en millisecondes */
  private lastTime: number = 0

  /** Est-ce que la boucle tourne ? */
  private running: boolean = false

  /** Est-ce que le jeu est en pause ? */
  private paused: boolean = false

  // --- Compteur FPS ---

  /** Nombre de frames depuis le dernier calcul FPS */
  private frameCount: number = 0

  /** Timestamp du dernier calcul FPS */
  private fpsLastTime: number = 0

  /** FPS actuel (mis a jour chaque seconde) */
  private _fps: number = 0

  /**
   * @param updateFn - Fonction appelee chaque frame avec le delta-time en secondes
   */
  constructor(updateFn: UpdateCallback) {
    this.updateFn = updateFn
  }

  /** FPS actuel (lecture seule) */
  get fps(): number {
    return this._fps
  }

  /**
   * Demarre la boucle.
   * Appelle requestAnimationFrame qui demandera au navigateur
   * d'appeler notre fonction `loop` ~60 fois par seconde.
   */
  start(): void {
    if (this.running) return // Deja en cours

    this.running = true
    this.lastTime = performance.now()
    this.fpsLastTime = this.lastTime
    this.frameCount = 0

    // Lance la boucle
    this.rafId = requestAnimationFrame((time) => this.loop(time))
  }

  /** Arrete completement la boucle. */
  stop(): void {
    this.running = false
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = 0
    }
  }

  /** Met en pause (la boucle tourne mais n'appelle plus updateFn). */
  pause(): void {
    this.paused = true
  }

  /** Reprend apres une pause. */
  resume(): void {
    this.paused = false
    // Reset le lastTime pour eviter un enorme dt au retour de pause
    this.lastTime = performance.now()
  }

  /**
   * LA boucle. Appelee ~60 fois par seconde par le navigateur.
   * @param currentTime - Timestamp en millisecondes fourni par requestAnimationFrame
   */
  private loop(currentTime: number): void {
    // Si on a arrete, on sort
    if (!this.running) return

    // Demande la prochaine frame immediatement
    // (comme ca meme si le code plante, on continue)
    this.rafId = requestAnimationFrame((time) => this.loop(time))

    // Calcul du delta-time en SECONDES
    let dt = (currentTime - this.lastTime) / 1000
    this.lastTime = currentTime

    // Clamp le dt pour eviter les sauts enormes
    // (quand on alt-tab ou que le PC lag)
    if (dt > MAX_DELTA_TIME) {
      dt = MAX_DELTA_TIME
    }

    // Calcul du FPS (une fois par seconde)
    this.frameCount++
    if (currentTime - this.fpsLastTime >= 1000) {
      this._fps = this.frameCount
      this.frameCount = 0
      this.fpsLastTime = currentTime
    }

    // Appelle la logique du jeu (si pas en pause)
    if (!this.paused) {
      this.updateFn(dt)
    }
  }
}
```

### 3.3 Creer le Game.ts

Creez le fichier `src/game/engine/Game.ts` :

```typescript
import { Application, Text, TextStyle } from 'pixi.js'
import { GAME_WIDTH, GAME_HEIGHT, BG_COLOR } from '../constants'
import { GameLoop } from './GameLoop'

/**
 * Classe principale du jeu.
 *
 * C'est le "chef d'orchestre". Il :
 * 1. Cree l'application PixiJS (le canvas, le renderer)
 * 2. Cree la boucle de jeu (GameLoop)
 * 3. A chaque frame, met a jour tous les systemes
 *
 * Pour l'instant c'est minimaliste :
 * - Un canvas noir
 * - Un compteur FPS
 * Plus tard on ajoutera : SceneManager, InputManager, PhysicsSystem, etc.
 */
export class Game {
  /** L'application PixiJS (contient le renderer, le stage, etc.) */
  private app!: Application

  /** La boucle de jeu */
  private gameLoop!: GameLoop

  /** Texte FPS affiche a l'ecran */
  private fpsText!: Text

  /**
   * Initialise PixiJS et prepare le jeu.
   * C'est une methode async car PixiJS 8 necessite une initialisation asynchrone.
   *
   * @param container - L'element HTML dans lequel injecter le canvas
   */
  async init(container: HTMLElement): Promise<void> {
    // Cree l'application PixiJS
    this.app = new Application()

    // Initialise avec nos parametres
    // (PixiJS 8 utilise init() au lieu du constructeur)
    await this.app.init({
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: BG_COLOR,
      // antialias: false pour le pixel art (garder les pixels nets)
      antialias: false,
      // resolution 1 pour du pixel art
      resolution: 1,
    })

    // Ajoute le canvas au DOM
    container.appendChild(this.app.canvas)

    // Cree le compteur FPS
    this.createFPSCounter()

    // Cree la boucle de jeu
    // On lui passe notre methode update (avec le bon `this`)
    this.gameLoop = new GameLoop((dt: number) => this.update(dt))

    console.log(`[Echoes] PixiJS initialise (${GAME_WIDTH}x${GAME_HEIGHT})`)
  }

  /**
   * Demarre la boucle de jeu.
   * Apres cet appel, update() sera appelee ~60 fois par seconde.
   */
  start(): void {
    this.gameLoop.start()
    console.log('[Echoes] Game loop demarree')
  }

  /**
   * Mise a jour du jeu. Appelee chaque frame.
   *
   * @param dt - Delta-time en secondes (~0.0167 a 60fps)
   *
   * Plus tard cette methode fera :
   *   1. Lire les inputs
   *   2. Mettre a jour la physique
   *   3. Mettre a jour les entites
   *   4. Mettre a jour la camera
   *   5. Detecter les collisions
   *
   * Pour l'instant, on met juste a jour le FPS.
   */
  private update(_dt: number): void {
    // Met a jour l'affichage FPS
    this.fpsText.text = `FPS: ${this.gameLoop.fps}`
  }

  /**
   * Cree le compteur FPS en haut a gauche.
   * Utile pour verifier que le jeu tourne bien a 60fps.
   * On le retirera ou le cachera plus tard.
   */
  private createFPSCounter(): void {
    const style = new TextStyle({
      fontFamily: 'monospace',
      fontSize: 14,
      fill: 0x00ff00, // Vert (comme dans la tradition des debug overlays)
      stroke: { color: 0x000000, width: 2 },
    })

    this.fpsText = new Text({ text: 'FPS: 0', style })
    this.fpsText.x = 8
    this.fpsText.y = 8

    // Ajoute le texte au "stage" (la scene racine de PixiJS)
    this.app.stage.addChild(this.fpsText)
  }
}
```

### 3.4 Commit de Dev A

```bash
git add .
git commit -m "phase1: game engine (constants, GameLoop, Game)"
```

---

## ETAPE 4 -- FUSION (les deux devs ensemble)

C'est le moment de fusionner vos deux branches.

### 4.1 Dev B merge dans main d'abord

```bash
# Dev B fait :
git checkout main
git merge phase1/dev-b
git push origin main
```

### 4.2 Dev A rebase et merge

```bash
# Dev A fait :
git checkout main
git pull origin main
git merge phase1/dev-a
git push origin main
```

Il ne devrait y avoir AUCUN conflit car vous avez travaille sur des fichiers differents.

### 4.3 Les deux devs se mettent a jour

```bash
# Les deux font :
git checkout main
git pull origin main
```

---

## ETAPE 5 -- TESTER (les deux devs)

### 5.1 Test en navigateur

```bash
npm run dev
```

Ouvrez `http://localhost:3000` dans Chrome.

**Vous devez voir :**
- Un canvas noir de 1280x720 pixels
- Un texte vert "FPS: 60" en haut a gauche (ou ~60)
- AUCUNE erreur dans la console (F12 > Console)

Si ca ne marche pas :
- Verifiez que `npm install` a bien ete fait
- Ouvrez la console (F12) et lisez l'erreur
- Verifiez que tous les fichiers sont au bon endroit

### 5.2 Test Electron

```bash
npm run dev:electron
```

Une fenetre desktop doit s'ouvrir avec le meme contenu.
Si Electron plante, ce n'est pas grave pour l'instant. Le mode navigateur suffit pour developper.

### 5.3 Test TypeScript

```bash
npm run typecheck
```

Doit afficher... rien. Aucune erreur = tout est bien type.

---

## ETAPE 6 -- CREER LES UTILITAIRES (bonus, les deux devs)

Ces fichiers ne sont pas obligatoires pour valider la Phase 1, mais ils seront utiles des la Phase 2.
Vous pouvez vous les repartir ou les faire ensemble.

### 6.1 src/utils/math.ts (Dev A)

```typescript
/**
 * Utilitaires mathematiques pour le jeu.
 * Ces fonctions seront utilisees PARTOUT (physique, camera, combat...).
 */

/**
 * Clamp : force une valeur entre un min et un max.
 *
 * Exemple : clamp(150, 0, 100) retourne 100
 * Exemple : clamp(-10, 0, 100) retourne 0
 * Exemple : clamp(50, 0, 100) retourne 50
 *
 * Usage typique : limiter la vitesse du joueur
 *   vx = clamp(vx, -MAX_SPEED, MAX_SPEED)
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Lerp (Linear Interpolation) : interpole entre deux valeurs.
 *
 * t = 0 retourne `a`
 * t = 1 retourne `b`
 * t = 0.5 retourne le milieu
 *
 * Usage typique : mouvement fluide de la camera
 *   camera.x = lerp(camera.x, cible.x, 0.08)
 *   (chaque frame, la camera se rapproche de 8% de la cible)
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * Distance entre deux points.
 * Utilise le theoreme de Pythagore : sqrt(dx^2 + dy^2)
 *
 * Usage typique : verifier si un ennemi est proche du joueur
 *   if (distance(enemy.x, enemy.y, player.x, player.y) < DETECT_RANGE) { ... }
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1
  const dy = y2 - y1
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Verifie si deux rectangles AABB se chevauchent.
 * AABB = Axis-Aligned Bounding Box (rectangle non-tourne).
 *
 * C'est la detection de collision la plus simple et la plus rapide.
 * On l'utilisera pour TOUTES les collisions du jeu.
 *
 * Chaque rectangle est defini par : x, y (coin haut-gauche), width, height
 */
export interface AABB {
  x: number
  y: number
  width: number
  height: number
}

export function aabbOverlap(a: AABB, b: AABB): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}
```

### 6.2 src/utils/debug.ts (Dev B)

```typescript
/**
 * Utilitaires de debug.
 *
 * Toutes les fonctions ici ne s'activent qu'en mode debug.
 * En production, elles ne font rien (zero impact sur les performances).
 */

/** Active/desactive le mode debug */
let debugEnabled = true

/** Active le mode debug */
export function enableDebug(): void {
  debugEnabled = true
  console.log('[Debug] Mode debug ACTIVE')
}

/** Desactive le mode debug */
export function disableDebug(): void {
  debugEnabled = false
}

/** Log conditionnel (n'affiche rien si debug desactive) */
export function debugLog(category: string, message: string, ...args: unknown[]): void {
  if (!debugEnabled) return
  console.log(`[${category}] ${message}`, ...args)
}

/**
 * Mesure le temps d'execution d'une fonction.
 *
 * Usage :
 *   const result = measureTime('Physics', () => updatePhysics(dt))
 *   // Affiche : [Perf] Physics: 0.42ms
 */
export function measureTime<T>(label: string, fn: () => T): T {
  if (!debugEnabled) return fn()

  const start = performance.now()
  const result = fn()
  const elapsed = performance.now() - start

  if (elapsed > 2) {
    // N'affiche que si ca prend plus de 2ms (pour ne pas spammer)
    console.warn(`[Perf] ${label}: ${elapsed.toFixed(2)}ms`)
  }

  return result
}
```

### 6.3 src/utils/platform.ts (Dev B)

```typescript
/**
 * Detection de la plateforme.
 * Permet de savoir si on tourne dans Electron ou dans un navigateur.
 */

/** Verifie si le jeu tourne dans Electron */
export function isElectron(): boolean {
  // Le preload expose window.electronAPI
  return typeof window !== 'undefined'
    && 'electronAPI' in window
}

/** Verifie si le jeu tourne dans un navigateur classique */
export function isBrowser(): boolean {
  return !isElectron()
}

/** Retourne l'OS ('win32', 'darwin', 'linux', ou 'unknown') */
export function getPlatform(): string {
  if (isElectron()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).electronAPI?.platform ?? 'unknown'
  }
  // En navigateur, on peut deviner depuis le user agent
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('win')) return 'win32'
  if (ua.includes('mac')) return 'darwin'
  if (ua.includes('linux')) return 'linux'
  return 'unknown'
}
```

### 6.4 Commit des utilitaires

```bash
# Chaque dev commit et push ses fichiers
git add .
git commit -m "phase1: utilitaires (math, debug, platform)"
git push origin main
```

---

## CHECKLIST FINALE -- PHASE 1 VALIDEE

Les deux devs verifient ensemble :

- [ ] `npm run dev` ouvre le navigateur avec un canvas noir
- [ ] Le compteur FPS affiche ~60 en vert
- [ ] Aucune erreur dans la console (F12)
- [ ] `npm run typecheck` n'affiche aucune erreur
- [ ] Le code est sur `main` et les deux devs ont la meme version
- [ ] Vous comprenez ce que fait chaque fichier

---

## CE QU'ON A CONSTRUIT (resume)

```
echoes-between-two-souls/
├── electron/
│   ├── main.ts              # Dev B -- Fenetre Electron
│   └── preload.ts           # Dev B -- Bridge securise
├── src/
│   ├── index.html           # Dev B -- Page HTML
│   ├── main.ts              # Dev B -- Point d'entree
│   ├── game/
│   │   ├── constants.ts     # Dev A -- Toutes les constantes
│   │   └── engine/
│   │       ├── Game.ts      # Dev A -- Chef d'orchestre PixiJS
│   │       └── GameLoop.ts  # Dev A -- Boucle 60fps + delta-time
│   └── utils/
│       ├── math.ts          # Dev A -- Clamp, lerp, distance, AABB
│       ├── debug.ts         # Dev B -- Logs conditionnels
│       └── platform.ts      # Dev B -- Detection Electron/navigateur
├── package.json             # Dev B -- Dependances
├── tsconfig.json            # Dev B -- Config TypeScript
├── vite.config.ts           # Dev B -- Config Vite
└── .gitignore               # Dev B -- Fichiers ignores par Git
```

---

## PROCHAINE ETAPE

Quand la Phase 1 est validee, on passe a la **Phase 2 : Scenes et navigation**.
Vous pourrez basculer entre un ecran de chargement, un menu principal, et la scene de jeu.

Dites-moi quand vous etes prets.
