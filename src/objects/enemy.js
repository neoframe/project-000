import { GameObjects, Tweens } from 'phaser';

import { ENEMY_LIFE, ENEMY_SPEED } from '../utils/settings';

export default class Enemy extends GameObjects.Sprite {
  direction = 'right';
  objectTile = null;
  life = ENEMY_LIFE;
  damageAnimation = null;

  constructor (scene, objectTile, x, y) {
    super(scene, x, y, 'enemy', 0);
    this.setTexture('enemy', 0);

    this.objectTile = objectTile;
    this.direction = 'right';
  }

  create () {
    this.anims.play('enemy-moving', true);
    this.body.setSize(19, 15);
    this.body.setImmovable(true);
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

  isDead () {
    return this.life <= 0;
  }

  damage (damages) {
    this.life -= damages;

    if (this.damageAnimation) {
      this.damageAnimation.remove();
      this.damageAnimation = null;
      this.setAlpha(1);
    }

    if (!this.isDead()) {
      this.damageAnimation = this.scene.tweens.add({
        targets: [this],
        alpha: 0.2,
        ease: 'Cubic.easeOut',
        duration: 150,
        repeat: 5,
        yoyo: true,
      });
    }
  }
}
