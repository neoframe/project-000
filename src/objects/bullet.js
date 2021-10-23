import { Physics } from 'phaser';

import {
  BULLETS_GRAVITY,
  BULLETS_SPEED,
  BULLETS_VELOCITY,
  SCALE,
  WORLD_GRAVITY,
} from '../utils/settings';

export default class Bullet extends Physics.Arcade.Sprite {
  player = null;

  fire (player) {
    this.player = player;

    // Not setting this from the beginning creates a 32x32 physics body (??)
    this.setTexture('bullet', 0);

    // Creating a smaller (8px instead of 16) body to account for lost space
    // around the bullet
    this.setSize(8, 8);

    // Sprites are too small
    this.setScale(SCALE);

    // Start by positionning the bullet at the end of the gun
    // depending on the direction of the player
    const direction = player.direction === 'left' ? -1 : 1;
    this.body.reset(player.x + (17 * SCALE * direction), player.y + 4 * SCALE);

    // Create the bullet animation
    player.scene.anims.create({
      key: 'bullet',
      // Skipping a frame from the spritesheet because the last one is empty
      frames: player.scene.anims
        .generateFrameNumbers('bullet', { start: 0, end: 6 }),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.play('bullet', true);

    // Enable physics
    this.enableBody = true;
    this.body.setGravityY(-(WORLD_GRAVITY - BULLETS_GRAVITY));
    this.body
      .setGravityX(BULLETS_SPEED * (player.direction === 'left' ? -1 : 1));

    // Setting it as immovable prevents gravity from making it bounce back when
    // colliding with the world boundaries
    this.body.setImmovable(true);

    // Destroy bullet when going outside of the world
    this.body.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
    this.body.world.on('worldbounds', body => {
      body.gameObject.destroy();
    });

    // Enable the bullet
    this.setActive(true);
    this.setVisible(true);

    // And finally set its velocity to make it move
    this
      .setVelocityX(BULLETS_VELOCITY * (player.direction === 'left' ? -1 : 1));
  }
}
