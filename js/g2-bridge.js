// =============================================================================
// Even Realities G2 Bridge Integration
// Connects the game to the G2 glasses via EvenAppBridge / Even Hub SDK
// =============================================================================

class G2Bridge {
  constructor(game) {
    this.game = game;
    this.bridge = null;
    this.connected = false;
    this.containerSetup = false;
    this.frameInterval = null;
    this.targetFPS = 15; // Conservative for BLE bandwidth
    this.lastFrameTime = 0;
    this.imageContainerId = 'game_display';
    this.scoreContainerId = 'score_bar';
  }

  // ---------------------------------------------------------------------------
  // INITIALIZATION
  // ---------------------------------------------------------------------------

  async init() {
    try {
      // Try the recommended async approach first
      if (typeof waitForEvenAppBridge === 'function') {
        this.bridge = await waitForEvenAppBridge();
      } else if (typeof EvenAppBridge !== 'undefined') {
        this.bridge = EvenAppBridge.getInstance();
      } else {
        console.log('[G2Bridge] EvenAppBridge not available - running in simulator mode');
        return false;
      }

      this.connected = true;
      console.log('[G2Bridge] Connected to Even G2 glasses');
      await this._setupContainers();
      this._setupGestureHandlers();
      return true;
    } catch (e) {
      console.log('[G2Bridge] Failed to connect:', e.message);
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // CONTAINER SETUP
  // ---------------------------------------------------------------------------

  async _setupContainers() {
    if (!this.bridge) return;

    try {
      // Create the initial page with two containers:
      // 1. Score text container at top
      // 2. Game image container for the main display
      const pageConfig = {
        layoutType: 'custom',
        containers: [
          {
            containerType: 'text',
            containerID: this.scoreContainerId,
            containerName: 'score',
            xPosition: 0,
            yPosition: 0,
            width: 576,
            height: 20,
            borderWidth: 0,
            borderColor: 0,
            borderRadius: 0,
            paddingLength: 2,
            isEventCapture: 0,
            content: 'SCORE 000000  WAVE 1  HI 000000',
          },
          {
            containerType: 'image',
            containerID: this.imageContainerId,
            containerName: 'game',
            xPosition: 0,
            yPosition: 20,
            width: 576,
            height: 268,
            borderWidth: 0,
            borderColor: 0,
            borderRadius: 0,
            paddingLength: 0,
            isEventCapture: 1,
          },
        ],
      };

      this.bridge.createStartUpPageContainer(JSON.stringify(pageConfig));
      this.containerSetup = true;
      console.log('[G2Bridge] Containers created');
    } catch (e) {
      console.error('[G2Bridge] Container setup failed:', e);
    }
  }

  // ---------------------------------------------------------------------------
  // GESTURE & INPUT HANDLING
  // ---------------------------------------------------------------------------

  _setupGestureHandlers() {
    if (!this.bridge) return;

    // Listen for events from the glasses touch sensors and R1 ring
    // The EvenAppBridge delivers these as callbacks
    window.addEventListener('message', (event) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        this._handleBridgeEvent(data);
      } catch (e) {
        // Not a bridge message
      }
    });

    // Also register direct bridge callbacks if available
    if (this.bridge.onEvent) {
      this.bridge.onEvent((eventData) => {
        this._handleBridgeEvent(eventData);
      });
    }
  }

  _handleBridgeEvent(data) {
    if (!data || !data.type) return;

    switch (data.type) {
      // Temple touch gestures
      case 'SCROLL_UP_EVENT':
      case 'SWIPE_LEFT':
        this.game.handleG2Gesture('swipe_left');
        break;

      case 'SCROLL_DOWN_EVENT':
      case 'SWIPE_RIGHT':
        this.game.handleG2Gesture('swipe_right');
        break;

      case 'TAP_EVENT':
      case 'CLICK':
        this.game.handleG2Gesture('tap');
        break;

      case 'DOUBLE_TAP_EVENT':
      case 'DOUBLE_CLICK':
        this.game.handleG2Gesture('double_tap');
        break;

      case 'LONG_PRESS_EVENT':
      case 'LONG_CLICK':
        this.game.handleG2Gesture('hold');
        break;

      case 'SCROLL_TOP_EVENT':
        // Reached top of scroll - unused in game
        break;

      case 'SCROLL_BOTTOM_EVENT':
        // Reached bottom of scroll - unused in game
        break;

      // R1 Ring events
      case 'RING_SCROLL_LEFT':
        this.game.handleRingInput('scroll_left');
        break;

      case 'RING_SCROLL_RIGHT':
        this.game.handleRingInput('scroll_right');
        break;

      case 'RING_PRESS':
      case 'RING_TAP':
        this.game.handleRingInput('press');
        break;
    }
  }

  // ---------------------------------------------------------------------------
  // FRAME SENDING
  // ---------------------------------------------------------------------------

  startFrameLoop() {
    if (this.frameInterval) return;

    const interval = Math.floor(1000 / this.targetFPS);
    this.frameInterval = setInterval(() => {
      this._sendFrame();
    }, interval);
  }

  stopFrameLoop() {
    if (this.frameInterval) {
      clearInterval(this.frameInterval);
      this.frameInterval = null;
    }
  }

  _sendFrame() {
    if (!this.bridge || !this.containerSetup) return;

    try {
      // Update score text
      this._updateScoreText();

      // Send game area as image data
      // The game renders at 576×288 but we skip the score bar area (top 20px)
      // and send 576×268 for the image container
      const fullBuffer = this.game.getRawGreyscaleBuffer();
      const gameAreaStart = 20 * 576; // Skip score bar rows
      const gameAreaBuffer = fullBuffer.slice(gameAreaStart);

      // Convert to base64 for transmission
      const base64Data = this._bufferToBase64(gameAreaBuffer);

      this.bridge.updateImageRawData(
        this.imageContainerId,
        base64Data,
        576,
        268,
        'greyscale'
      );
    } catch (e) {
      console.error('[G2Bridge] Frame send error:', e);
    }
  }

  _updateScoreText() {
    if (!this.bridge) return;

    const scoreStr = this.game.score.toString().padStart(6, '0');
    const hiStr = this.game.highScore.toString().padStart(6, '0');
    const waveStr = this.game.wave.toString();
    const livesStr = 'x' + (this.game.lives - 1);

    let statusText = `SCORE ${scoreStr}  WAVE ${waveStr}  HI ${hiStr}  ${livesStr}`;

    if (this.game.state === 'title') {
      statusText = 'SPACE INVADERS - G2 EDITION - TAP TO START';
    } else if (this.game.state === 'gameover') {
      statusText = `GAME OVER  SCORE ${scoreStr}  TAP TO RESTART`;
    } else if (this.game.state === 'paused') {
      statusText = `PAUSED  SCORE ${scoreStr}  DOUBLE TAP TO RESUME`;
    }

    try {
      this.bridge.textContainerUpgrade(
        this.scoreContainerId,
        statusText
      );
    } catch (e) {
      // Silently fail on text update
    }
  }

  _bufferToBase64(buffer) {
    let binary = '';
    for (let i = 0; i < buffer.length; i++) {
      binary += String.fromCharCode(buffer[i]);
    }
    return btoa(binary);
  }

  // ---------------------------------------------------------------------------
  // CLEANUP
  // ---------------------------------------------------------------------------

  destroy() {
    this.stopFrameLoop();
    if (this.bridge && this.containerSetup) {
      try {
        this.bridge.shutDownPageContainer();
      } catch (e) {
        // Best effort cleanup
      }
    }
    this.connected = false;
    this.containerSetup = false;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { G2Bridge };
}
