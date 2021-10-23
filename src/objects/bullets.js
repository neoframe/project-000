import { Physics } from 'phaser';

import { BULLETS_THRESHOLD } from '../utils/settings';
import Bullet from './bullet';
import bulletSprite from '../assets/bullet.png';

export default class Bullets extends Physics.Arcade.Group {
  player = null;
  threshold = Date.now();

  constructor (scene, player) {
    super(scene.physics.world, scene);
    this.player = player;

    scene.load
      .spritesheet('bullet', bulletSprite, { frameWidth: 8, frameHeight: 8 });

    // Create an empty pool of bullets to automatically create physics
    this.createMultiple({
      frameQuantity: 0,
      key: 'bullet',
      frame: 0,
      active: false,
      visible: false,
      classType: Bullet,
    });
  }

  fire () {
    // Avoid firing 768754 bullets at the same time by setting a threshold
    if (Date.now() - this.threshold > BULLETS_THRESHOLD) {
      this.scene.data
        .set('bulletsFired', this.scene.data.get('bulletsFired') + 1);
      this.threshold = Date.now();

      // getFirstDead -> will get the first inactive bullet in the pool
      // true -> will create a new one if none is available
      this.getFirstDead(true)?.fire(this.player);
    }
  }
}
