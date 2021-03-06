import { Physics } from 'phaser';

import {
  BULLETS_GRAVITY,
  BULLETS_SPEED,
  BULLETS_VELOCITY,
  WORLD_GRAVITY,
} from '../utils/settings';

export default class Bullet extends Physics.Arcade.Sprite {
  owner = null;

  fire (owner) {
    this.owner = owner;

    // Not setting these from the beginning creates a 32x32 physics body (??)
    this.setTexture('bullet', 0);
    this.setSize(8, 8);

    // Start by positionning the bullet at the end of the gun
    // depending on the direction of the player
    const direction = owner.direction === 'left' ? -1 : 1;
    this.body.reset(owner.x + (17 * direction), owner.y + 3);

    // Create the bullet animation
    this.scene.anims.create({
      key: 'bullet',
      // Skipping a frame from the spritesheet because the last one is empty
      frames: this.scene.anims
        .generateFrameNumbers('bullet', { start: 0, end: 0 }),
      frameRate: 20,
      repeat: 0,
      skipMissedFrames: false,
    });

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

    this.anims.play('bullet', true);

    // Enable physics
    this.enableBody = true;
    this.body.setGravityY(-(WORLD_GRAVITY - BULLETS_GRAVITY));
    this.body
      .setGravityX(BULLETS_SPEED * (owner.direction === 'left' ? -1 : 1));

    // Setting it as immovable prevents gravity from making it bounce back when
    // colliding with the world boundaries
    this.body.setImmovable(true);

    // Destroy bullet when going outside of the world
    this.body.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
    this.body.world.on('worldbounds', body => {
      body.setGravity(0, 0);
      body.setVelocity(0, 0);
      body.allowGravity = false;
      body.gameObject.anims.play('bullet-impact', true);
      body.gameObject.once('animationcomplete', () => {
        body.gameObject.destroy();
      });
    });

    // Enable the bullet
    this.setActive(true);
    this.setVisible(true);

    // And finally set its velocity to make it move
    this
      .setVelocityX(BULLETS_VELOCITY * (owner.direction === 'left' ? -1 : 1));
  }
}
