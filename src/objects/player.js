import { GameObjects } from 'phaser';

import {
  PLAYER_DAMAGE,
  PLAYER_GRAVITY,
  PLAYER_MAX_JUMP,
  PLAYER_SPEED,
} from '../utils/settings';
import Bullets from './bullets';
import playerIdleSprite from '../assets/images/player-idle.png';
import playerMovingSprite from '../assets/images/player-moving.png';
import playerJumpingSprite from '../assets/images/player-jumping.png';
import playerShootingSprite from '../assets/images/player-shooting.png';
import playerMoveShootSprite from '../assets/images/player-moving-shooting.png';
import jumpDust from '../assets/images/player-jump-dust.png';

export default class Player extends GameObjects.Sprite {
  bullets = null;
  canJump = true;
  jumping = false;
  shooting = false;
  direction = 'right';

  constructor (scene, ...args) {
    super(scene, ...args);

    scene.load.spritesheet('player-idle', playerIdleSprite,
      { frameWidth: 26, frameHeight: 22 });
    scene.load.spritesheet('player-shooting', playerShootingSprite,
      { frameWidth: 26, frameHeight: 22 });
    scene.load.spritesheet('player-moving', playerMovingSprite,
      { frameWidth: 26, frameHeight: 22 });
    scene.load.spritesheet('player-moving-shooting', playerMoveShootSprite,
      { frameWidth: 26, frameHeight: 22 });
    scene.load.spritesheet('player-jumping', playerJumpingSprite,
      { frameWidth: 26, frameHeight: 22 });
    scene.load.spritesheet('jump-dust', jumpDust,
      { frameWidth: 34, frameHeight: 10 });

    this.bullets = new Bullets(scene, this);
  }

  create () {
    this.setTexture('player-idle', 0);
    this.scene.registry.set('bulletsFired', 0);
    this.scene.registry.set('enemiesKilled', 0);

    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.body.setSize(19, 15);
    this.body.setGravityY(PLAYER_GRAVITY);
    this.body.setCollideWorldBounds(true);

    this.scene.anims.create({
      key: 'idle',
      frames: this.scene.anims
        .generateFrameNumbers('player-idle', { start: 0, end: 4 }),
      frameRate: 5,
      repeat: -1,
    });

    this.scene.anims.create({
      key: 'idle-shooting',
      frames: this.scene.anims
        .generateFrameNumbers('player-shooting', { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.anims.create({
      key: 'moving',
      frames: this.scene.anims
        .generateFrameNumbers('player-moving', { start: 0, end: 9 }),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.anims.create({
      key: 'moving-shooting',
      frames: this.scene.anims
        .generateFrameNumbers('player-moving-shooting', { start: 0, end: 9 }),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.anims.create({
      key: 'jumping',
      frames: this.scene.anims
        .generateFrameNumbers('player-jumping', { start: 0, end: 6 }),
      frameRate: 20,
      repeat: 0,
    });

    this.scene.anims.create({
      key: 'falling',
      frames: this.scene.anims
        .generateFrameNumbers('player-jumping', { start: 7, end: 8 }),
      frameRate: 20,
      repeat: 0,
    });

    this.scene.input.keyboard.on('keyup-UP', () => {
      this.canJump = true;
    });

    this.dust = this.scene.add.sprite(this.x, this.y, 'jump-dust', 0);

    this.scene.anims.create({
      key: 'jump-dust',
      frames: this.scene.anims
        .generateFrameNumbers('jump-dust', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: 0,
    });

    this.scene.anims.create({
      key: 'fall-dust',
      frames: this.scene.anims
        .generateFrameNumbers('jump-dust', { start: 1, end: 5 }),
      frameRate: 10,
      repeat: 0,
    });

    this.scene.physics.add.collider(this, this.scene.obstacles);
    this.scene.physics.add
      .overlap(this.bullets, this.scene.enemies, (bullet, enemy) => {
        !bullet.used && enemy.damage(PLAYER_DAMAGE);
        this.bullets.removeBullet(bullet);

        if (enemy.isDead()) {
          this.scene.registry
            .set('enemiesKilled', this.scene.registry.get('enemiesKilled') + 1);
          this.scene.enemies.removeEnemy(enemy);
        }
      });
    this.scene.physics.add
      .collider(this.bullets, this.scene.obstacles, bullet => {
        this.bullets.removeBullet(bullet);
      });
  }

  getAnimationName () {
    if (this.body.velocity.y < 0) {
      return 'jumping';
    } else if (
      this.body.velocity.y >= 0 &&
      !this.body.touching.down &&
      !this.body.onFloor()
    ) {
      return 'falling';
    } else if (
      this.body.velocity.x !== 0 &&
      (this.body.touching.down || this.body.onFloor())
    ) {
      return 'moving' + (this.shooting ? '-shooting' : '');
    } else {
      return 'idle' + (this.shooting ? '-shooting' : '');
    }
  }

  update () {
    this.setFlip(this.direction === 'left', false);

    if (this.scene.cursors.left.isDown) {
      this.body.setVelocityX(-PLAYER_SPEED);
      this.direction = 'left';
    } else if (this.scene.cursors.right.isDown) {
      this.body.setVelocityX(PLAYER_SPEED);
      this.direction = 'right';
    } else {
      this.body.setVelocityX(0);
    }

    if (
      this.scene.cursors.up.isDown &&
      (this.body.touching.down || this.body.onFloor()) &&
      this.canJump
    ) {
      this.dust.anims.play('jump-dust', true);
      this.dust.setPosition(this.x, this.y + 7);

      this.body.setVelocityY(-PLAYER_MAX_JUMP);
      this.jumping = true;
      this.canJump = false;
    } else if (
      (this.body.touching.down || this.body.onFloor()) &&
      this.jumping
    ) {
      this.dust.anims.stop();
      this.dust.anims.play('fall-dust', true);
      this.dust.setPosition(this.x, this.y + 13);
      this.jumping = false;
    }

    if (this.scene.cursors.space.isDown) {
      this.shooting = true;
      this.bullets.fire();
    } else {
      this.shooting = false;
    }

    const animation = this.getAnimationName();

    if (animation !== this.anims.getName()) {
      this.scene.registry.set('playerAnimation', animation);
      this.anims.play(animation, true);
    }
  }
}
