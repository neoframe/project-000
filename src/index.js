import { Game, Scale, AUTO } from 'phaser';

import { WORLD_GRAVITY, FPS } from './utils/settings';
import Main from './scenes/main';

const _ = new Game({
  type: AUTO,
  backgroundColor: 0x222222,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: WORLD_GRAVITY },
    },
  },
  fps: {
    target: FPS,
  },
  scale: {
    mode: Scale.RESIZE,
    autoCenter: Scale.CENTER_BOTH,
  },
  pixelArt: true,
  scene: Main,
});
