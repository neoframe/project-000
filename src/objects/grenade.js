import { Physics } from 'phaser';

import {
  GRENADE_DAMAGES,
  GRENADE_VELOCITY_X,
  GRENADE_VELOCITY_Y,
} from '../utils/settings';

export default class Grenade extends Physics.Arcade.Sprite {
  owner = null;
  damages = GRENADE_DAMAGES;

  throw (grenades, owner) {
    this.grenades = grenades;
    this.owner = owner;

    // Create the bullet animation
    this.scene.anims.create({
      key: 'bullet-impact',
      // Skipping a frame from the spritesheet because the last one is empty
      frames: this.scene.anims
        .generateFrameNumbers('bullet-impact', { start: 0, end: 4 }),
      frameRate: 20,
      repeat: 0,
      skipMissedFrames: false,
    });

    // Not setting these from the beginning creates a 32x32 physics body (??)
    this.setTexture('grenade', 0);
    this.setScale(0.8);
    this.setSize(8, 8);

    // Start by positionning the bullet at the end of the gun
    // depending on the direction of the player
    this.direction = owner.direction === 'left' ? -1 : 1;

    this.body.reset(owner.x, owner.y);
    this.body.setVelocityY(GRENADE_VELOCITY_Y);
    this.body.setVelocityX(GRENADE_VELOCITY_X * this.direction);

    this.setBounce(0.7);

    // Enable physics
    this.enableBody = true;
    this.body.setGravityY(100);

    this.body.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;

    // Enable the bullet
    this.setActive(true);
    this.setVisible(true);

    this.scene.time.delayedCall(2000, () => {
      this.grenades.removeGrenade(this);
    });

    this.scene.tweens.add({
      targets: this.body.velocity,
      x: 0,
      duration: 2000,
      ease: 'Power2',
    });
  }
}
