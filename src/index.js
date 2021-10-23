import { Game, AUTO } from 'phaser';

import { WORLD_GRAVITY, FPS } from './utils/settings';
import Main from './scenes/main';

const _ = new Game({
  type: AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: WORLD_GRAVITY },
    },
  },
  fps: {
    target: FPS,
  },
  pixelArt: true,
  scene: Main,
});
