import Phaser from 'phaser';

import Main from './scenes/main';

new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 2000 },
    },
  },
  fps: {
    target: 60,
  },
  pixelArt: true,
  scene: Main,
});