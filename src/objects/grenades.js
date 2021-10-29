import { Physics } from 'phaser';

import { BULLETS_THRESHOLD, GRENADE_THRESHOLD } from '../utils/settings';
import Grenade from './grenade';
import grenadeSprite from '../assets/images/grenades.png';

export default class Grenades extends Physics.Arcade.Group {
  owner = null;
  lastGrenade = Date.now();
  threshold = GRENADE_THRESHOLD;

  constructor (scene, owner, { threshold = BULLETS_THRESHOLD } = {}) {
    super(scene.physics.world, scene);
    this.owner = owner;
    this.threshold = threshold;

    scene.load.spritesheet('grenade', grenadeSprite,
      { frameWidth: 16, frameHeight: 16 });

    // Create an empty pool of bullets to automatically create physics
    this.createMultiple({
      frameQuantity: 0,
      key: 'grenade',
      frame: 0,
      active: false,
      visible: false,
      classType: Grenade,
    });
  }

  throw () {
    // Avoid firing 768754 bullets at the same time by setting a threshold
    if (Date.now() - this.lastGrenade > this.threshold) {
      this.scene.registry
        .set('grenadesThrown', this.scene.registry.get('grenadesThrown') + 1);
      this.lastGrenade = Date.now();

      // getFirstDead -> will get the first inactive bullet in the pool
      // true -> will create a new one if none is available
      this.getFirstDead(true)?.throw(this.owner);
    }
  }

  // removeGrenade (bullet) {
  //   bullet.used = true;
  //   bullet.body.setGravity(0, 1);
  //   bullet.body.setVelocity(0, 0);
  //   bullet.body.allowGravity = false;
  //   bullet.anims.play('bullet-impact', true);
  //   bullet.once('animationcomplete', () => {
  //     bullet.destroy();
  //   });
  // }a
}
