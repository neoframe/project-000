import { GameObjects, Math } from 'phaser';

import {
  ENEMY_BULLET_THRESHOLD,
  ENEMY_DAMAGE,
  ENEMY_LIFE,
  ENEMY_SIGHT,
  ENEMY_SPEED,
} from '../utils/settings';
import Bullets from './bullets';

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
    this.bullets = new Bullets(scene, this, {
      threshold: ENEMY_BULLET_THRESHOLD,
    });
  }

  create () {
    this.anims.play('enemy-moving', true);
    this.body.setSize(19, 15);
    this.body.setImmovable(true);
    this.body.setGravityY(0);

    this.scene.physics.add
      .overlap(this.bullets, this.scene.player, (player, bullet) => {
        !bullet.used && player.damage(ENEMY_DAMAGE);
        this.bullets.removeBullet(bullet);
      });
  }

  update () {
    const player = this.scene.player;

    if (
      this.body.bottom === player.body.bottom &&
      Math.Distance.Between(this.x, this.y, player.x, player.y) < ENEMY_SIGHT &&
      player.flipX !== this.flipX
    ) {
      this.fire();

      return;
    }

    this.anims.play('enemy-moving', true);
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
    } else {
      this.scene.enemies.removeEnemy(this);
    }
  }

  fire () {
    this.body.setVelocityX(0);
    this.anims.play('enemy-shooting', true);
    this.bullets.fire();
  }
}
