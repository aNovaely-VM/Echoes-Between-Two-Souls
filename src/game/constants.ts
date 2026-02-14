/**
 * Constants du jeu
 * ----------------
 * Toutes les valeurs numeriques du jeu centralisees ici.
 * JAMAIS de "magic numbers" dans le code -- tout passe par ce fichier.
 *
 * Convention de nommage :
 * - MAJUSCULES_AVEC_UNDERSCORES pour les constantes
 * - Groupees par categorie (rendu, physique, joueur, etc.)
 */

// === RENDU ===
/** Largeur de base du jeu en pixels (resolution interne) */
export const GAME_WIDTH = 1280
/** Hauteur de base du jeu en pixels (resolution interne) */
export const GAME_HEIGHT = 720
/** Couleur de fond du canvas */
export const BACKGROUND_COLOR = 0x0a0a1a
/** FPS cible */
export const TARGET_FPS = 60
/** Delta-time fixe en secondes (1/60) */
export const FIXED_DELTA = 1 / TARGET_FPS

// === PHYSIQUE ===
/** Force de gravite en pixels/seconde^2 */
export const GRAVITY = 980
/** Vitesse terminale (chute max) en pixels/seconde */
export const TERMINAL_VELOCITY = 600
/** Friction au sol (multiplicateur par frame, 1 = aucune friction) */
export const GROUND_FRICTION = 0.85
/** Friction en l'air (moins de friction qu'au sol) */
export const AIR_FRICTION = 0.95

// === MONDE ===
/** Taille d'une tile en pixels */
export const TILE_SIZE = 32
/** Nombre de tiles visibles en largeur */
export const TILES_X = Math.ceil(GAME_WIDTH / TILE_SIZE)
/** Nombre de tiles visibles en hauteur */
export const TILES_Y = Math.ceil(GAME_HEIGHT / TILE_SIZE)

// === JOUEUR (Le Corps) ===
/** Vitesse maximale horizontale en pixels/seconde */
export const PLAYER_SPEED = 200
/** Acceleration horizontale en pixels/seconde^2 */
export const PLAYER_ACCEL = 1200
/** Force de saut (vitesse initiale vers le haut) */
export const JUMP_FORCE = 380
/** Duree du coyote time en millisecondes */
export const COYOTE_TIME = 80
/** Duree du jump buffer en millisecondes */
export const JUMP_BUFFER = 100
/** Multiplicateur de saut variable (quand on relache la touche) */
export const JUMP_CUT_MULTIPLIER = 0.5
/** Vitesse du dash en pixels/seconde */
export const DASH_SPEED = 400
/** Duree du dash en millisecondes */
export const DASH_DURATION = 150
/** Cooldown du dash en millisecondes */
export const DASH_COOLDOWN = 800

// === L'ANCRE (Joueur 2) ===
/** Vitesse de deplacement de l'Ancre */
export const ANCHOR_SPEED = 160
/** Rayon du scan en pixels */
export const ANCHOR_SCAN_RADIUS = 200
/** Duree du bouclier en millisecondes */
export const ANCHOR_SHIELD_DURATION = 2000
/** Cooldown du bouclier en millisecondes */
export const ANCHOR_SHIELD_COOLDOWN = 5000

// === COMBAT ===
/** Degats de base du combo melee (coup 1, 2, 3) */
export const MELEE_DAMAGE = [10, 12, 18]
/** Timing max entre les coups du combo en millisecondes */
export const COMBO_WINDOW = 400
/** Duree d'invincibilite apres un coup en millisecondes */
export const INVINCIBILITY_FRAMES = 500
/** Force du knockback en pixels/seconde */
export const KNOCKBACK_FORCE = 250

// === CAMERA ===
/** Facteur de lerp pour le suivi de camera (0 = fixe, 1 = instantane) */
export const CAMERA_LERP = 0.08
/** Decalage look-ahead en pixels */
export const CAMERA_LOOKAHEAD = 50
/** Taille de la dead-zone en pixels (largeur, hauteur) */
export const CAMERA_DEADZONE = { width: 60, height: 40 }

// === DEBUG ===
/** Afficher les hitboxes en mode debug */
export const DEBUG_HITBOXES = false
/** Afficher le compteur FPS */
export const DEBUG_FPS = true
/** Afficher les infos de collision */
export const DEBUG_COLLISIONS = false
