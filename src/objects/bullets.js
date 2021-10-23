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

    this.createMultiple({
      frameQuantity: 1,
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
      this.threshold = Date.now();
      this.getFirstDead(true)?.fire(this.player);
    }
  }
}
