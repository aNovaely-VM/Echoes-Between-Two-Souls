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

export const GAME_WIDTH = 1280

export const GAME_HEIGHT = 720

export const BG_COLOR = 0x000000

export const TARGET_FPS = 60

export const MAX_DELTA_TIME = 0.05

export const GRAVITY = 980

export const TERMINAL_VELOCITY = 600

export const PLAYER_SPEED = 200

export const JUMP_FORCE = 400

export const PLAYER_ACCEL = 1200

export const GROUND_FRICTION = 0.85

export const AIR_FRICTION = 0.95

export const COYOTE_TIME = 0.08

export const JUMP_BUFFER_TIME = 0.1

export const TILE_SIZE = 32