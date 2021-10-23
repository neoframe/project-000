import { GameObjects } from 'phaser';

import Bullets from './bullets';
import playerIdleSprite from '../assets/player-idle.png';
import playerMovingSprite from '../assets/player-moving.png';
import playerJumpingSprite from '../assets/player-jumping.png';

export default class Player extends GameObjects.Sprite {
  bullets = null;
  canJump = true;
  direction = 'right';

  constructor (scene, ...args) {
    super(scene, ...args);

    scene.load.spritesheet('player-idle', playerIdleSprite,
      { frameWidth: 26, frameHeight: 22 });
    scene.load.spritesheet('player-moving', playerMovingSprite,
      { frameWidth: 26, frameHeight: 22 });
    scene.load.spritesheet('player-jumping', playerJumpingSprite,
      { frameWidth: 26, frameHeight: 22 });

    this.bullets = new Bullets(scene, this);
  }

  create () {
    this.setTexture('player-idle');
    this.setScale(2);
    this.scene.data.set('bulletsFired', 0);

    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);

    this.body.setCollideWorldBounds(true);

    this.scene.anims.create({
      key: 'idle',
      frames: this.scene.anims
        .generateFrameNumbers('player-idle', { start: 0, end: 4 }),
      frameRate: 5,
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
      key: 'jumping',
      frames: this.scene.anims
        .generateFrameNumbers('player-jumping', { start: 0, end: 8 }),
      frameRate: 5,
      repeat: 0,
    });

    this.scene.input.keyboard.on('keyup-UP', () => {
      this.canJump = true;
    });

    this.anims.play('idle', true);
  }

  update () {
    this.setFlip(this.direction === 'left', false);

    if (this.scene.cursors.left.isDown) {
      this.body.setVelocityX(-500);
      this.anims.play('moving', true);
      this.direction = 'left';
    } else if (this.scene.cursors.right.isDown) {
      this.body.setVelocityX(500);
      this.anims.play('moving', true);
      this.direction = 'right';
    } else {
      this.body.setVelocityX(0);
      this.anims.play('idle', true);
    }

    if (
      this.scene.cursors.up.isDown &&
      (this.body.touching.down || this.body.onFloor()) &&
      this.canJump
    ) {
      this.body.setVelocityY(-800);
      this.anims.play('jumping', true);
      this.canJump = false;
    }

    if (this.scene.cursors.space.isDown) {
      this.bullets.fire();
    }
  }
}
