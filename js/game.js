// =============================================================================
// Space Invaders for Even Realities G2 Glasses
// Core Game Engine
// =============================================================================

const CONFIG = {
  // Game canvas matches G2 display: 576×288
  WIDTH: 576,
  HEIGHT: 288,

  // Game area (below score bar)
  SCORE_BAR_HEIGHT: 20,

  // Timing
  TARGET_FPS: 20,

  // Player
  PLAYER_SPEED: 4,
  PLAYER_FIRE_COOLDOWN: 300,
  PLAYER_Y_OFFSET: 22,
  PLAYER_LIVES: 3,

  // Aliens
  ALIEN_COLS: 11,
  ALIEN_ROWS: 5,
  ALIEN_H_SPACING: 16,
  ALIEN_V_SPACING: 16,
  ALIEN_START_X: 60,
  ALIEN_START_Y: 50,
  ALIEN_BASE_SPEED: 0.4,
  ALIEN_SPEED_INCREASE: 0.03,
  ALIEN_DROP: 10,
  ALIEN_FIRE_CHANCE: 0.002,
  ALIEN_ANIM_INTERVAL: 800,

  // UFO
  UFO_SPEED: 1.5,
  UFO_CHANCE: 0.001,
  UFO_SCORES: [50, 100, 150, 200, 300],

  // Bullets
  PLAYER_BULLET_SPEED: 5,
  ALIEN_BULLET_SPEED: 2.5,
  MAX_PLAYER_BULLETS: 3,
  MAX_ALIEN_BULLETS: 5,

  // Shields
  SHIELD_COUNT: 4,
  SHIELD_Y: 220,

  // Greyscale levels (0-15 for G2 4-bit)
  COLORS: {
    BG: 0,
    PLAYER: 15,
    ALIEN_1: 13,
    ALIEN_2: 11,
    ALIEN_3: 9,
    BULLET_PLAYER: 15,
    BULLET_ALIEN: 12,
    SHIELD: 10,
    UFO: 14,
    TEXT: 15,
    EXPLOSION: 15,
    SCORE_BAR_BG: 1,
  }
};

// =============================================================================
// SPRITES - Classic pixel art defined as 2D arrays (1 = filled, 0 = empty)
// =============================================================================

const SPRITES = {
  player: [
    [0,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],

  // Squid alien - 2 animation frames
  alien1: [
    [ // Frame 0
      [0,0,0,0,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,0,0],
      [0,1,1,0,1,1,0,1,1,0],
      [0,1,1,1,1,1,1,1,1,0],
      [0,0,0,1,0,0,1,0,0,0],
      [0,0,1,0,0,0,0,1,0,0],
      [0,0,0,1,0,0,1,0,0,0],
    ],
    [ // Frame 1
      [0,0,0,0,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,0,0],
      [0,1,1,0,1,1,0,1,1,0],
      [0,1,1,1,1,1,1,1,1,0],
      [0,0,1,0,0,0,0,1,0,0],
      [0,1,0,0,0,0,0,0,1,0],
      [0,0,1,0,0,0,0,1,0,0],
    ],
  ],

  // Crab alien - 2 animation frames
  alien2: [
    [ // Frame 0
      [0,0,1,0,0,0,0,0,1,0,0],
      [0,0,0,1,0,0,0,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,0,0],
      [0,1,1,0,1,1,1,0,1,1,0],
      [1,1,1,1,1,1,1,1,1,1,1],
      [1,0,1,1,1,1,1,1,1,0,1],
      [1,0,1,0,0,0,0,0,1,0,1],
      [0,0,0,1,1,0,1,1,0,0,0],
    ],
    [ // Frame 1
      [0,0,1,0,0,0,0,0,1,0,0],
      [1,0,0,1,0,0,0,1,0,0,1],
      [1,0,1,1,1,1,1,1,1,0,1],
      [1,1,1,0,1,1,1,0,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,1,1,1,0],
      [0,0,1,0,0,0,0,0,1,0,0],
      [0,1,0,0,0,0,0,0,0,1,0],
    ],
  ],

  // Octopus alien - 2 animation frames
  alien3: [
    [ // Frame 0
      [0,0,0,0,1,1,1,1,0,0,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,0,0,1,1,0,0,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [0,0,0,1,1,0,0,1,1,0,0,0],
      [0,0,1,1,0,1,1,0,1,1,0,0],
      [1,1,0,0,0,0,0,0,0,0,1,1],
    ],
    [ // Frame 1
      [0,0,0,0,1,1,1,1,0,0,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,0,0,1,1,0,0,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [0,0,1,1,0,0,0,0,1,1,0,0],
      [0,1,0,0,1,1,1,1,0,0,1,0],
      [0,0,1,1,0,0,0,0,1,1,0,0],
    ],
  ],

  ufo: [
    [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,1,1,1,0,0,0,0,0,1,1,1,0,0],
    [0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
  ],

  shield: [
    [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
    [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],
    [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],
  ],

  explosion: [
    [0,0,0,1,0,0,0,1,0,0,0],
    [1,0,0,0,1,0,1,0,0,0,1],
    [0,1,0,0,0,0,0,0,0,1,0],
    [0,0,1,0,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,0,0,0,0,0,1,0,0],
    [0,1,0,0,0,0,0,0,0,1,0],
    [1,0,0,0,1,0,1,0,0,0,1],
    [0,0,0,1,0,0,0,1,0,0,0],
  ],

  // Tiny 4x5 font for score display
  font: {
    '0': [[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
    '1': [[0,1,0],[1,1,0],[0,1,0],[0,1,0],[1,1,1]],
    '2': [[1,1,1],[0,0,1],[1,1,1],[1,0,0],[1,1,1]],
    '3': [[1,1,1],[0,0,1],[1,1,1],[0,0,1],[1,1,1]],
    '4': [[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]],
    '5': [[1,1,1],[1,0,0],[1,1,1],[0,0,1],[1,1,1]],
    '6': [[1,1,1],[1,0,0],[1,1,1],[1,0,1],[1,1,1]],
    '7': [[1,1,1],[0,0,1],[0,0,1],[0,0,1],[0,0,1]],
    '8': [[1,1,1],[1,0,1],[1,1,1],[1,0,1],[1,1,1]],
    '9': [[1,1,1],[1,0,1],[1,1,1],[0,0,1],[1,1,1]],
    'A': [[0,1,0],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
    'B': [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,1,0]],
    'C': [[0,1,1],[1,0,0],[1,0,0],[1,0,0],[0,1,1]],
    'D': [[1,1,0],[1,0,1],[1,0,1],[1,0,1],[1,1,0]],
    'E': [[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,1,1]],
    'F': [[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,0,0]],
    'G': [[0,1,1],[1,0,0],[1,0,1],[1,0,1],[0,1,1]],
    'H': [[1,0,1],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
    'I': [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],
    'L': [[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,1,1]],
    'N': [[1,0,1],[1,1,1],[1,1,1],[1,0,1],[1,0,1]],
    'O': [[0,1,0],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
    'P': [[1,1,0],[1,0,1],[1,1,0],[1,0,0],[1,0,0]],
    'R': [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,0,1]],
    'S': [[0,1,1],[1,0,0],[0,1,0],[0,0,1],[1,1,0]],
    'T': [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[0,1,0]],
    'U': [[1,0,1],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
    'V': [[1,0,1],[1,0,1],[1,0,1],[0,1,0],[0,1,0]],
    'W': [[1,0,1],[1,0,1],[1,1,1],[1,1,1],[1,0,1]],
    'X': [[1,0,1],[1,0,1],[0,1,0],[1,0,1],[1,0,1]],
    'Y': [[1,0,1],[1,0,1],[0,1,0],[0,1,0],[0,1,0]],
    'Z': [[1,1,1],[0,0,1],[0,1,0],[1,0,0],[1,1,1]],
    ' ': [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
    ':': [[0],[1],[0],[1],[0]],
    '-': [[0,0,0],[0,0,0],[1,1,1],[0,0,0],[0,0,0]],
    '!': [[1],[1],[1],[0],[1]],
    '?': [[1,1,0],[0,0,1],[0,1,0],[0,0,0],[0,1,0]],
  }
};

// =============================================================================
// SOUND ENGINE - Simple Web Audio bleeps matching arcade aesthetic
// =============================================================================

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      this.enabled = false;
    }
  }

  _beep(freq, duration, type = 'square', volume = 0.1) {
    if (!this.enabled || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  shoot() { this._beep(880, 0.1, 'square', 0.08); }
  alienHit() { this._beep(200, 0.15, 'square', 0.1); }
  playerHit() {
    this._beep(100, 0.4, 'sawtooth', 0.12);
    setTimeout(() => this._beep(80, 0.3, 'sawtooth', 0.1), 150);
  }
  ufoSound() { this._beep(400, 0.08, 'triangle', 0.06); }
  ufoHit() { this._beep(600, 0.3, 'square', 0.1); }

  marchBeat(step) {
    const freq = [120, 100, 80, 60][step % 4];
    this._beep(freq, 0.06, 'square', 0.06);
  }
}

// =============================================================================
// PARTICLE SYSTEM - Simple pixel explosions
// =============================================================================

class Particle {
  constructor(x, y, brightness) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = 1.0;
    this.decay = 0.02 + Math.random() * 0.04;
    this.brightness = brightness;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.03; // gravity
    this.life -= this.decay;
    return this.life > 0;
  }
}

// =============================================================================
// GAME ENGINE
// =============================================================================

class SpaceInvadersGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.canvas.width = CONFIG.WIDTH;
    this.canvas.height = CONFIG.HEIGHT;

    this.sound = new SoundEngine();
    this.frameBuffer = new Uint8Array(CONFIG.WIDTH * CONFIG.HEIGHT);

    this.state = 'title'; // title, playing, paused, gameover
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('g2invaders_hi') || '0');
    this.lives = CONFIG.PLAYER_LIVES;
    this.wave = 1;
    this.lastTime = 0;
    this.alienAnimFrame = 0;
    this.alienAnimTimer = 0;
    this.marchStep = 0;
    this.marchTimer = 0;
    this.marchInterval = 600;
    this.titleBlink = 0;

    // Input state
    this.keys = {};
    this.touchLeft = false;
    this.touchRight = false;
    this.touchFire = false;

    // Entities
    this.player = null;
    this.aliens = [];
    this.playerBullets = [];
    this.alienBullets = [];
    this.shields = [];
    this.ufo = null;
    this.particles = [];
    this.explosions = [];

    this._initInput();
  }

  _initInput() {
    document.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (this.state === 'title' || this.state === 'gameover') {
        if (e.code === 'Space' || e.code === 'Enter') {
          this.sound.init();
          this._startGame();
        }
      }
      if (e.code === 'KeyP' && this.state === 'playing') {
        this.state = 'paused';
      } else if (e.code === 'KeyP' && this.state === 'paused') {
        this.state = 'playing';
      }
      e.preventDefault();
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }

  handleG2Gesture(gesture) {
    this.sound.init();
    switch (gesture) {
      case 'swipe_left':
        this.touchLeft = true;
        setTimeout(() => { this.touchLeft = false; }, 200);
        break;
      case 'swipe_right':
        this.touchRight = true;
        setTimeout(() => { this.touchRight = false; }, 200);
        break;
      case 'tap':
        if (this.state === 'title' || this.state === 'gameover') {
          this._startGame();
        } else {
          this.touchFire = true;
          setTimeout(() => { this.touchFire = false; }, 100);
        }
        break;
      case 'double_tap':
        if (this.state === 'playing') this.state = 'paused';
        else if (this.state === 'paused') this.state = 'playing';
        break;
      case 'hold':
        // Move to center
        if (this.player) this.player.x = CONFIG.WIDTH / 2 - 6;
        break;
    }
  }

  handleRingInput(action) {
    this.sound.init();
    switch (action) {
      case 'scroll_left':
        if (this.player) this.player.x -= CONFIG.PLAYER_SPEED * 2;
        break;
      case 'scroll_right':
        if (this.player) this.player.x += CONFIG.PLAYER_SPEED * 2;
        break;
      case 'press':
        if (this.state === 'title' || this.state === 'gameover') {
          this._startGame();
        } else {
          this.touchFire = true;
          setTimeout(() => { this.touchFire = false; }, 100);
        }
        break;
    }
  }

  _startGame() {
    this.state = 'playing';
    this.score = 0;
    this.lives = CONFIG.PLAYER_LIVES;
    this.wave = 1;
    this.marchInterval = 600;
    this._initWave();
  }

  _initWave() {
    this.player = {
      x: CONFIG.WIDTH / 2 - 6,
      y: CONFIG.HEIGHT - CONFIG.PLAYER_Y_OFFSET,
      width: 13,
      height: 8,
      fireCooldown: 0,
      invincible: 0,
      alive: true,
    };

    this.aliens = [];
    const types = [0, 1, 1, 2, 2]; // row type mapping (alien3, alien2, alien2, alien1, alien1)
    const scores = [30, 20, 20, 10, 10];
    for (let row = 0; row < CONFIG.ALIEN_ROWS; row++) {
      for (let col = 0; col < CONFIG.ALIEN_COLS; col++) {
        const spriteKey = ['alien3', 'alien2', 'alien2', 'alien1', 'alien1'][row];
        const w = SPRITES[spriteKey][0][0].length;
        const h = SPRITES[spriteKey][0].length;
        this.aliens.push({
          x: CONFIG.ALIEN_START_X + col * (w + CONFIG.ALIEN_H_SPACING),
          y: CONFIG.ALIEN_START_Y + row * (h + CONFIG.ALIEN_V_SPACING),
          width: w,
          height: h,
          type: spriteKey,
          score: scores[row],
          alive: true,
          row: row,
          col: col,
        });
      }
    }

    this.alienDirection = 1;
    this.alienAnimFrame = 0;
    this.alienAnimTimer = 0;
    this.marchStep = 0;
    this.marchTimer = 0;
    this.marchInterval = Math.max(100, 600 - (this.wave - 1) * 50);

    this.playerBullets = [];
    this.alienBullets = [];
    this.particles = [];
    this.explosions = [];
    this.ufo = null;

    // Only create shields on first wave
    if (this.wave === 1) {
      this._initShields();
    }
  }

  _initShields() {
    this.shields = [];
    const shieldW = SPRITES.shield[0].length;
    const totalWidth = CONFIG.SHIELD_COUNT * shieldW;
    const spacing = (CONFIG.WIDTH - 100 - totalWidth) / (CONFIG.SHIELD_COUNT - 1);
    for (let i = 0; i < CONFIG.SHIELD_COUNT; i++) {
      // Deep copy shield sprite as mutable pixel array
      const pixels = SPRITES.shield.map(row => [...row]);
      this.shields.push({
        x: 50 + i * (shieldW + spacing),
        y: CONFIG.SHIELD_Y,
        width: shieldW,
        height: pixels.length,
        pixels: pixels,
      });
    }
  }

  // -------------------------------------------------------------------------
  // UPDATE
  // -------------------------------------------------------------------------

  update(dt) {
    if (this.state === 'title') {
      this.titleBlink += dt;
      return;
    }
    if (this.state === 'paused' || this.state === 'gameover') {
      this.titleBlink += dt;
      return;
    }

    this._updatePlayer(dt);
    this._updateAliens(dt);
    this._updateBullets(dt);
    this._updateUFO(dt);
    this._updateParticles();
    this._updateExplosions(dt);
    this._checkCollisions();
    this._checkWaveComplete();
  }

  _updatePlayer(dt) {
    if (!this.player || !this.player.alive) return;

    const p = this.player;
    if (p.invincible > 0) p.invincible -= dt;
    if (p.fireCooldown > 0) p.fireCooldown -= dt;

    // Movement
    let moving = false;
    if (this.keys['ArrowLeft'] || this.keys['KeyA'] || this.touchLeft) {
      p.x -= CONFIG.PLAYER_SPEED;
      moving = true;
    }
    if (this.keys['ArrowRight'] || this.keys['KeyD'] || this.touchRight) {
      p.x += CONFIG.PLAYER_SPEED;
      moving = true;
    }

    // Clamp position
    p.x = Math.max(5, Math.min(CONFIG.WIDTH - p.width - 5, p.x));

    // Fire
    if ((this.keys['Space'] || this.keys['ArrowUp'] || this.touchFire) &&
        p.fireCooldown <= 0 &&
        this.playerBullets.length < CONFIG.MAX_PLAYER_BULLETS) {
      this.playerBullets.push({
        x: p.x + Math.floor(p.width / 2),
        y: p.y - 2,
        width: 2,
        height: 6,
      });
      p.fireCooldown = CONFIG.PLAYER_FIRE_COOLDOWN;
      this.sound.shoot();
    }
  }

  _updateAliens(dt) {
    const alive = this.aliens.filter(a => a.alive);
    if (alive.length === 0) return;

    // Animation
    this.alienAnimTimer += dt;
    if (this.alienAnimTimer >= CONFIG.ALIEN_ANIM_INTERVAL) {
      this.alienAnimTimer -= CONFIG.ALIEN_ANIM_INTERVAL;
      this.alienAnimFrame = 1 - this.alienAnimFrame;
    }

    // March timing
    this.marchTimer += dt;
    if (this.marchTimer >= this.marchInterval) {
      this.marchTimer -= this.marchInterval;
      this.marchStep++;

      // Speed increases as fewer aliens remain
      const speedMultiplier = 1 + (CONFIG.ALIEN_COLS * CONFIG.ALIEN_ROWS - alive.length) * CONFIG.ALIEN_SPEED_INCREASE;
      const moveAmount = CONFIG.ALIEN_BASE_SPEED * speedMultiplier * 8;

      // Check edges
      let hitEdge = false;
      for (const a of alive) {
        if (this.alienDirection > 0 && a.x + a.width + moveAmount >= CONFIG.WIDTH - 10) hitEdge = true;
        if (this.alienDirection < 0 && a.x - moveAmount <= 10) hitEdge = true;
      }

      if (hitEdge) {
        // Drop down and reverse
        for (const a of alive) a.y += CONFIG.ALIEN_DROP;
        this.alienDirection *= -1;
      } else {
        for (const a of alive) a.x += moveAmount * this.alienDirection;
      }

      this.sound.marchBeat(this.marchStep);

      // Dynamic march speed
      this.marchInterval = Math.max(50, 600 - (CONFIG.ALIEN_COLS * CONFIG.ALIEN_ROWS - alive.length) * 8 - (this.wave - 1) * 30);
    }

    // Alien shooting
    if (Math.random() < CONFIG.ALIEN_FIRE_CHANCE * alive.length &&
        this.alienBullets.length < CONFIG.MAX_ALIEN_BULLETS) {
      // Pick a random bottom-row alien per column
      const bottomAliens = this._getBottomAliens();
      if (bottomAliens.length > 0) {
        const shooter = bottomAliens[Math.floor(Math.random() * bottomAliens.length)];
        this.alienBullets.push({
          x: shooter.x + Math.floor(shooter.width / 2),
          y: shooter.y + shooter.height,
          width: 2,
          height: 6,
        });
      }
    }

    // Check if aliens reached bottom
    for (const a of alive) {
      if (a.y + a.height >= CONFIG.HEIGHT - CONFIG.PLAYER_Y_OFFSET) {
        this.state = 'gameover';
        this._saveHighScore();
        return;
      }
    }

    // UFO spawn
    if (!this.ufo && Math.random() < CONFIG.UFO_CHANCE) {
      const fromLeft = Math.random() > 0.5;
      this.ufo = {
        x: fromLeft ? -16 : CONFIG.WIDTH + 16,
        y: CONFIG.SCORE_BAR_HEIGHT + 8,
        width: 15,
        height: 7,
        direction: fromLeft ? 1 : -1,
        score: CONFIG.UFO_SCORES[Math.floor(Math.random() * CONFIG.UFO_SCORES.length)],
      };
    }
  }

  _getBottomAliens() {
    const bottom = {};
    for (const a of this.aliens) {
      if (!a.alive) continue;
      if (!bottom[a.col] || a.row > bottom[a.col].row) {
        bottom[a.col] = a;
      }
    }
    return Object.values(bottom);
  }

  _updateBullets(dt) {
    // Player bullets move up
    for (let i = this.playerBullets.length - 1; i >= 0; i--) {
      this.playerBullets[i].y -= CONFIG.PLAYER_BULLET_SPEED;
      if (this.playerBullets[i].y < 0) {
        this.playerBullets.splice(i, 1);
      }
    }

    // Alien bullets move down
    for (let i = this.alienBullets.length - 1; i >= 0; i--) {
      this.alienBullets[i].y += CONFIG.ALIEN_BULLET_SPEED;
      if (this.alienBullets[i].y > CONFIG.HEIGHT) {
        this.alienBullets.splice(i, 1);
      }
    }
  }

  _updateUFO(dt) {
    if (!this.ufo) return;
    this.ufo.x += CONFIG.UFO_SPEED * this.ufo.direction;
    this.sound.ufoSound();
    if (this.ufo.x < -20 || this.ufo.x > CONFIG.WIDTH + 20) {
      this.ufo = null;
    }
  }

  _updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      if (!this.particles[i].update()) {
        this.particles.splice(i, 1);
      }
    }
  }

  _updateExplosions(dt) {
    for (let i = this.explosions.length - 1; i >= 0; i--) {
      this.explosions[i].timer -= dt;
      if (this.explosions[i].timer <= 0) {
        this.explosions.splice(i, 1);
      }
    }
  }

  _spawnExplosion(x, y, brightness, count = 8) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, brightness));
    }
    this.explosions.push({ x, y, timer: 200 });
  }

  _checkCollisions() {
    // Player bullets vs aliens
    for (let bi = this.playerBullets.length - 1; bi >= 0; bi--) {
      const b = this.playerBullets[bi];
      for (const a of this.aliens) {
        if (!a.alive) continue;
        if (this._boxCollide(b, a)) {
          a.alive = false;
          this.playerBullets.splice(bi, 1);
          this.score += a.score;
          this._spawnExplosion(
            a.x + a.width / 2,
            a.y + a.height / 2,
            CONFIG.COLORS[a.type === 'alien1' ? 'ALIEN_1' : a.type === 'alien2' ? 'ALIEN_2' : 'ALIEN_3']
          );
          this.sound.alienHit();
          break;
        }
      }
    }

    // Player bullets vs UFO
    if (this.ufo) {
      for (let bi = this.playerBullets.length - 1; bi >= 0; bi--) {
        const b = this.playerBullets[bi];
        if (this._boxCollide(b, this.ufo)) {
          this.score += this.ufo.score;
          this._spawnExplosion(this.ufo.x + 7, this.ufo.y + 3, CONFIG.COLORS.UFO, 12);
          this.sound.ufoHit();
          // Show score briefly
          this.explosions.push({
            x: this.ufo.x, y: this.ufo.y,
            timer: 800,
            scoreText: this.ufo.score.toString()
          });
          this.ufo = null;
          this.playerBullets.splice(bi, 1);
          break;
        }
      }
    }

    // Player bullets vs shields
    for (let bi = this.playerBullets.length - 1; bi >= 0; bi--) {
      const b = this.playerBullets[bi];
      if (this._bulletHitShield(b, -1)) {
        this.playerBullets.splice(bi, 1);
      }
    }

    // Alien bullets vs shields
    for (let bi = this.alienBullets.length - 1; bi >= 0; bi--) {
      const b = this.alienBullets[bi];
      if (this._bulletHitShield(b, 1)) {
        this.alienBullets.splice(bi, 1);
      }
    }

    // Alien bullets vs player
    if (this.player && this.player.alive && this.player.invincible <= 0) {
      for (let bi = this.alienBullets.length - 1; bi >= 0; bi--) {
        const b = this.alienBullets[bi];
        if (this._boxCollide(b, this.player)) {
          this.alienBullets.splice(bi, 1);
          this._playerDeath();
          break;
        }
      }
    }

    // Aliens vs player (collision)
    if (this.player && this.player.alive) {
      for (const a of this.aliens) {
        if (!a.alive) continue;
        if (this._boxCollide(a, this.player)) {
          this._playerDeath();
          break;
        }
      }
    }
  }

  _bulletHitShield(bullet, direction) {
    for (const shield of this.shields) {
      if (!this._boxCollide(bullet, shield)) continue;
      const localX = Math.floor(bullet.x - shield.x);
      const localY = Math.floor(bullet.y - shield.y);
      let hit = false;
      // Destroy a small area of the shield
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const py = localY + dy;
          const px = localX + dx;
          if (py >= 0 && py < shield.height && px >= 0 && px < shield.width) {
            if (shield.pixels[py][px]) {
              shield.pixels[py][px] = 0;
              hit = true;
            }
          }
        }
      }
      return hit;
    }
    return false;
  }

  _playerDeath() {
    this.lives--;
    this._spawnExplosion(
      this.player.x + this.player.width / 2,
      this.player.y + this.player.height / 2,
      CONFIG.COLORS.PLAYER, 15
    );
    this.sound.playerHit();

    if (this.lives <= 0) {
      this.player.alive = false;
      this.state = 'gameover';
      this._saveHighScore();
    } else {
      this.player.invincible = 2000;
      this.player.x = CONFIG.WIDTH / 2 - 6;
    }
  }

  _boxCollide(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  }

  _checkWaveComplete() {
    if (this.aliens.every(a => !a.alive)) {
      this.wave++;
      this._initWave();
    }
  }

  _saveHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('g2invaders_hi', this.highScore.toString());
    }
  }

  // -------------------------------------------------------------------------
  // RENDER - Draw to framebuffer then to canvas
  // -------------------------------------------------------------------------

  render() {
    // Clear framebuffer
    this.frameBuffer.fill(CONFIG.COLORS.BG);

    if (this.state === 'title') {
      this._renderTitle();
    } else if (this.state === 'gameover') {
      this._renderGameOver();
    } else {
      this._renderGame();
      if (this.state === 'paused') {
        this._renderPaused();
      }
    }

    // Convert framebuffer to canvas
    this._blitToCanvas();
  }

  _setPixel(x, y, brightness) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    if (ix >= 0 && ix < CONFIG.WIDTH && iy >= 0 && iy < CONFIG.HEIGHT) {
      this.frameBuffer[iy * CONFIG.WIDTH + ix] = brightness;
    }
  }

  _drawSprite(sprite, x, y, brightness) {
    const sx = Math.floor(x);
    const sy = Math.floor(y);
    for (let row = 0; row < sprite.length; row++) {
      for (let col = 0; col < sprite[row].length; col++) {
        if (sprite[row][col]) {
          this._setPixel(sx + col, sy + row, brightness);
        }
      }
    }
  }

  _drawText(text, x, y, brightness, scale = 1) {
    let cx = Math.floor(x);
    const cy = Math.floor(y);
    for (const ch of text.toUpperCase()) {
      const glyph = SPRITES.font[ch];
      if (glyph) {
        for (let row = 0; row < glyph.length; row++) {
          for (let col = 0; col < glyph[row].length; col++) {
            if (glyph[row][col]) {
              for (let sy = 0; sy < scale; sy++) {
                for (let sx = 0; sx < scale; sx++) {
                  this._setPixel(cx + col * scale + sx, cy + row * scale + sy, brightness);
                }
              }
            }
          }
        }
        cx += (glyph[0].length + 1) * scale;
      } else {
        cx += 4 * scale;
      }
    }
  }

  _drawRect(x, y, w, h, brightness) {
    for (let row = 0; row < h; row++) {
      for (let col = 0; col < w; col++) {
        this._setPixel(x + col, y + row, brightness);
      }
    }
  }

  _drawLine(x1, y1, x2, y2, brightness) {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;
    let cx = x1, cy = y1;
    while (true) {
      this._setPixel(cx, cy, brightness);
      if (cx === x2 && cy === y2) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; cx += sx; }
      if (e2 < dx) { err += dx; cy += sy; }
    }
  }

  _renderTitle() {
    // Title text
    this._drawText('SPACE INVADERS', 140, 40, CONFIG.COLORS.TEXT, 3);

    // G2 subtitle
    this._drawText('EVEN G2 EDITION', 192, 75, 10, 2);

    // Show alien types with scores
    const demoY = 110;
    this._drawSprite(SPRITES.alien3[0][0], 180, demoY, CONFIG.COLORS.ALIEN_3);
    this._drawText('= 30 PTS', 200, demoY + 2, 8);

    this._drawSprite(SPRITES.alien2[0][0], 180, demoY + 20, CONFIG.COLORS.ALIEN_2);
    this._drawText('= 20 PTS', 200, demoY + 22, 8);

    this._drawSprite(SPRITES.alien1[0][0], 180, demoY + 40, CONFIG.COLORS.ALIEN_1);
    this._drawText('= 10 PTS', 200, demoY + 42, 8);

    this._drawSprite(SPRITES.ufo, 174, demoY + 60, CONFIG.COLORS.UFO);
    this._drawText('= ?  PTS', 200, demoY + 62, 8);

    // Blink instruction
    if (Math.floor(this.titleBlink / 500) % 2 === 0) {
      this._drawText('PRESS SPACE TO START', 166, 240, CONFIG.COLORS.TEXT, 2);
    }

    // High score
    if (this.highScore > 0) {
      this._drawText('HI SCORE ' + this.highScore, 210, 265, 8);
    }

    // Decorative line
    this._drawLine(40, 30, CONFIG.WIDTH - 40, 30, 5);
    this._drawLine(40, 280, CONFIG.WIDTH - 40, 280, 5);
  }

  _renderGameOver() {
    this._renderGame();

    // Darken overlay
    for (let i = 0; i < this.frameBuffer.length; i++) {
      this.frameBuffer[i] = Math.floor(this.frameBuffer[i] * 0.3);
    }

    this._drawText('GAME OVER', 180, 100, CONFIG.COLORS.TEXT, 3);
    this._drawText('SCORE ' + this.score, 220, 140, 12, 2);

    if (this.score >= this.highScore) {
      this._drawText('NEW HIGH SCORE!', 190, 165, 14, 2);
    }

    if (Math.floor(this.titleBlink / 500) % 2 === 0) {
      this._drawText('PRESS SPACE TO PLAY', 170, 210, CONFIG.COLORS.TEXT, 2);
    }
  }

  _renderPaused() {
    // Semi-transparent overlay
    for (let i = 0; i < this.frameBuffer.length; i++) {
      this.frameBuffer[i] = Math.floor(this.frameBuffer[i] * 0.4);
    }
    this._drawText('PAUSED', 222, 130, CONFIG.COLORS.TEXT, 3);
  }

  _renderGame() {
    // Score bar
    this._drawRect(0, 0, CONFIG.WIDTH, CONFIG.SCORE_BAR_HEIGHT, CONFIG.COLORS.SCORE_BAR_BG);
    this._drawText('SCORE ' + this.score.toString().padStart(6, '0'), 8, 6, CONFIG.COLORS.TEXT, 2);
    this._drawText('WAVE ' + this.wave, 260, 6, 10, 2);
    this._drawText('HI ' + this.highScore.toString().padStart(6, '0'), 400, 6, 8, 2);

    // Lives indicators
    for (let i = 0; i < this.lives - 1; i++) {
      this._drawSprite(SPRITES.player, CONFIG.WIDTH - 50 - i * 18, 5, CONFIG.COLORS.PLAYER);
    }

    // Divider line
    this._drawLine(0, CONFIG.SCORE_BAR_HEIGHT, CONFIG.WIDTH, CONFIG.SCORE_BAR_HEIGHT, 5);

    // Ground line
    this._drawLine(5, CONFIG.HEIGHT - 8, CONFIG.WIDTH - 5, CONFIG.HEIGHT - 8, 4);

    // Shields
    for (const shield of this.shields) {
      for (let row = 0; row < shield.height; row++) {
        for (let col = 0; col < shield.width; col++) {
          if (shield.pixels[row][col]) {
            this._setPixel(shield.x + col, shield.y + row, CONFIG.COLORS.SHIELD);
          }
        }
      }
    }

    // Aliens
    for (const a of this.aliens) {
      if (!a.alive) continue;
      const frames = SPRITES[a.type];
      const sprite = frames[this.alienAnimFrame];
      const color = a.type === 'alien1' ? CONFIG.COLORS.ALIEN_1 :
                    a.type === 'alien2' ? CONFIG.COLORS.ALIEN_2 :
                    CONFIG.COLORS.ALIEN_3;
      this._drawSprite(sprite, a.x, a.y, color);
    }

    // UFO
    if (this.ufo) {
      this._drawSprite(SPRITES.ufo, this.ufo.x, this.ufo.y, CONFIG.COLORS.UFO);
    }

    // Player
    if (this.player && this.player.alive) {
      // Blink when invincible
      if (this.player.invincible <= 0 || Math.floor(this.player.invincible / 100) % 2 === 0) {
        this._drawSprite(SPRITES.player, this.player.x, this.player.y, CONFIG.COLORS.PLAYER);
      }
    }

    // Player bullets
    for (const b of this.playerBullets) {
      this._drawRect(b.x, b.y, b.width, b.height, CONFIG.COLORS.BULLET_PLAYER);
    }

    // Alien bullets (zigzag pattern)
    for (const b of this.alienBullets) {
      const zigzag = Math.floor(b.y / 4) % 2;
      this._drawRect(b.x + zigzag, b.y, b.width, b.height, CONFIG.COLORS.BULLET_ALIEN);
    }

    // Explosions
    for (const e of this.explosions) {
      if (e.scoreText) {
        this._drawText(e.scoreText, e.x, e.y, CONFIG.COLORS.TEXT);
      } else {
        this._drawSprite(SPRITES.explosion, e.x - 5, e.y - 4, CONFIG.COLORS.EXPLOSION);
      }
    }

    // Particles
    for (const p of this.particles) {
      const b = Math.floor(p.brightness * p.life);
      if (b > 0) {
        this._setPixel(p.x, p.y, b);
      }
    }
  }

  _blitToCanvas() {
    const imageData = this.ctx.createImageData(CONFIG.WIDTH, CONFIG.HEIGHT);
    const data = imageData.data;

    for (let i = 0; i < this.frameBuffer.length; i++) {
      const brightness = this.frameBuffer[i];
      // Map 4-bit greyscale to green channel (G2 micro-LED is green)
      const green = Math.floor((brightness / 15) * 255);
      const red = Math.floor(green * 0.15);   // Slight warm tint
      const blue = Math.floor(green * 0.05);

      const offset = i * 4;
      data[offset] = red;
      data[offset + 1] = green;
      data[offset + 2] = blue;
      data[offset + 3] = 255;
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  // -------------------------------------------------------------------------
  // FRAME BUFFER EXPORT - For G2 bridge
  // -------------------------------------------------------------------------

  getFrameBuffer4Bit() {
    // Pack two 4-bit pixels per byte for G2 transmission
    const packed = new Uint8Array(Math.ceil(this.frameBuffer.length / 2));
    for (let i = 0; i < this.frameBuffer.length; i += 2) {
      const hi = this.frameBuffer[i] & 0x0F;
      const lo = (i + 1 < this.frameBuffer.length) ? (this.frameBuffer[i + 1] & 0x0F) : 0;
      packed[i >> 1] = (hi << 4) | lo;
    }
    return packed;
  }

  getRawGreyscaleBuffer() {
    // Return raw 8-bit greyscale for image container
    const buf = new Uint8Array(this.frameBuffer.length);
    for (let i = 0; i < this.frameBuffer.length; i++) {
      buf[i] = Math.floor((this.frameBuffer[i] / 15) * 255);
    }
    return buf;
  }

  // -------------------------------------------------------------------------
  // MAIN LOOP
  // -------------------------------------------------------------------------

  start() {
    const loop = (timestamp) => {
      const dt = this.lastTime ? timestamp - this.lastTime : 16;
      this.lastTime = timestamp;

      this.update(Math.min(dt, 50)); // Cap delta to prevent jumps
      this.render();

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SpaceInvadersGame, CONFIG, SPRITES };
}
