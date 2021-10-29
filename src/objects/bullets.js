import { Physics } from 'phaser';

import { BULLETS_THRESHOLD } from '../utils/settings';
import Bullet from './bullet';
import bulletSprite from '../assets/images/bullet.png';
import bulletImpactSprite from '../assets/images/bullet-impact.png';

export default class Bullets extends Physics.Arcade.Group {
  owner = null;
  lastBullet = Date.now();
  threshold = BULLETS_THRESHOLD;

  constructor (scene, owner, { threshold = BULLETS_THRESHOLD } = {}) {
    super(scene.physics.world, scene);
    this.owner = owner;
    this.threshold = threshold;

    scene.load.spritesheet('bullet', bulletSprite,
      { frameWidth: 8, frameHeight: 8 });
    scene.load.spritesheet('bullet-impact', bulletImpactSprite,
      { frameWidth: 20, frameHeight: 20 });

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
    if (Date.now() - this.lastBullet > this.threshold) {
      this.scene.registry
        .set('bulletsFired', this.scene.registry.get('bulletsFired') + 1);
      this.lastBullet = Date.now();

      // getFirstDead -> will get the first inactive bullet in the pool
      // true -> will create a new one if none is available
      this.getFirstDead(true)?.fire(this.owner);
    }
  }

  removeBullet (bullet) {
    bullet.used = true;
    bullet.body.setGravity(0, 0);
    bullet.body.setVelocity(0, 0);
    bullet.body.allowGravity = false;
    bullet.anims.play('bullet-impact', true);
    bullet.once('animationcomplete', () => {
      bullet.destroy();
    });
  }
}
