import { GameObjects } from 'phaser';

import { ENEMY_SPEED } from '../utils/settings';

export default class Enemy extends GameObjects.Sprite {
  direction = 'right';
  objectTile = null;

  constructor (scene, objectTile, x, y) {
    super(scene, x, y, 'enemy', 0);
    this.setTexture('enemy', 0);

    this.objectTile = objectTile;
    this.direction = 'right';
  }

  create () {
    this.anims.play('enemy-moving', true);
    this.body.setSize(19, 15);
  }

  update () {
    this.setFlip(this.direction === 'left', false);
    this.body
      .setVelocityX(this.direction === 'left' ? -ENEMY_SPEED : ENEMY_SPEED);

    if (
      this.x > this.objectTile.x + this.objectTile.width &&
      this.direction === 'right'
    ) {
      this.direction = 'left';
    } else if (this.x < this.objectTile.x && this.direction === 'left') {
      this.direction = 'right';
    }
  }
}
