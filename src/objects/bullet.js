import { Physics } from 'phaser';

import {
  BULLETS_GRAVITY,
  BULLETS_SPEED,
  FPS,
  WORLD_GRAVITY,
} from '../utils/settings';

export default class Bullet extends Physics.Arcade.Sprite {
  player = null;

  fire (player) {
    this.player = player;
    this.setScale(2);

    player.scene.anims.create({
      key: 'bullet',
      frames: player.scene.anims
        .generateFrameNumbers('bullet', { start: 0, end: 7 }),
      frameRate: FPS,
      repeat: 0,
    });

    this.anims.play('bullet', true);

    const direction = player.direction === 'left' ? -1 : 1;
    this.body.reset(player.x + (35 * direction), player.y + 8);
    this.body.setGravityY(-(WORLD_GRAVITY - BULLETS_GRAVITY));

    this.setActive(true);
    this.setVisible(true);

    this.setVelocityX(BULLETS_SPEED * (player.direction === 'left' ? -1 : 1));
  }

  preUpdate (time, delta) {
    super.preUpdate(time, delta);

    if (this.outOfWorldBounds) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}
