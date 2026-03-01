# Space Invaders - Even G2 Edition

A classic Space Invaders game built for the **Even Realities G2** smart glasses. Playable both on the G2 glasses and in any web browser as a simulator.

## Quick Start

### Browser Simulator

Open `index.html` in any modern browser — no build step or server required.

```
# Or serve locally:
python3 -m http.server 8080
# Open http://localhost:8080
```

### Even G2 Glasses

1. Host the project on a web server (Vercel, Cloudflare Pages, any HTTPS host)
2. Register the app URL in the [Even Hub developer portal](https://evenhub.evenrealities.com/)
3. Open the app through the Even App on your iPhone
4. The game automatically detects the G2 glasses and sends frames via EvenAppBridge

## Controls

| Input | Action |
|-------|--------|
| **Keyboard** `←` `→` | Move ship |
| **Keyboard** `Space` | Fire |
| **Keyboard** `P` | Pause |
| **Keyboard** `F` | Fullscreen |
| **G2 Temple** swipe | Move ship |
| **G2 Temple** tap | Fire |
| **G2 Temple** double-tap | Pause |
| **R1 Ring** scroll | Move ship |
| **R1 Ring** press | Fire |
| **Mobile** on-screen buttons | Move / Fire |

## Game Features

- Classic Space Invaders gameplay with 5 rows × 11 columns of aliens
- Three alien types (squid, crab, octopus) with different point values
- Two-frame alien animation synced to march tempo
- Destructible shields that erode pixel-by-pixel
- Mystery UFO with random bonus scores
- Particle explosion effects
- Progressive difficulty — aliens speed up as you clear them
- Wave system with increasing challenge
- High score saved to localStorage
- Retro sound effects via Web Audio API

## G2 Display Specs

The game is designed around the G2's display characteristics:

- **Resolution**: 576 × 288 pixels per eye
- **Color**: Monochrome green micro-LED, 4-bit greyscale (16 shades)
- **Rendering**: Game frames are rendered to an offscreen canvas, converted to greyscale, and sent to the glasses via `updateImageRawData()`

## Project Structure

```
index.html          Entry point
css/style.css       Simulator styling (CRT/HUD aesthetic)
js/game.js          Game engine — sprites, entities, physics, rendering
js/g2-bridge.js     Even G2 glasses integration via EvenAppBridge
```

## Scoring

| Alien | Points |
|-------|--------|
| Octopus (top row) | 30 |
| Crab (rows 2-3) | 20 |
| Squid (rows 4-5) | 10 |
| Mystery UFO | 50-300 (random) |

## License

MIT
