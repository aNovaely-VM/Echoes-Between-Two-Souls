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