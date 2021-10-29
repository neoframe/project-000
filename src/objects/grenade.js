import { Physics } from 'phaser';

import {
  GRENADE_VELOCITY_X, GRENADE_VELOCITY_Y,
} from '../utils/settings';

export default class grenade extends Physics.Arcade.Sprite {
  owner = null;

  throw (owner) {
    this.owner = owner;

    // Not setting these from the beginning creates a 32x32 physics body (??)
    this.setTexture('grenade', 0);
    this.setSize(8, 8);

    // Start by positionning the bullet at the end of the gun
    // depending on the direction of the player
    const direction = owner.direction === 'left' ? -1 : 1;

    this.body.reset(owner.x, owner.y);
    this.body.setVelocityY(GRENADE_VELOCITY_Y);
    this.body.setVelocityX(GRENADE_VELOCITY_X * direction);

    // Enable physics
    this.enableBody = true;
    this.body.setGravityY(100);

    this.body.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;

    // Enable the bullet
    this.setActive(true);
    this.setVisible(true);

  }
}
