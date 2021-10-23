import { Physics } from 'phaser';

import {
  BULLETS_GRAVITY,
  BULLETS_SPEED,
  WORLD_GRAVITY,
} from '../utils/settings';

export default class Bullet extends Physics.Arcade.Sprite {
  fire (player) {
    this.setTexture('bullet', 0);
    this.setScale(2);

    player.scene.anims.create({
      key: 'bullet',
      frames: player.scene.anims
        .generateFrameNumbers('bullet', { start: 0, end: 7 }),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.play('bullet', true);

    const direction = player.direction === 'left' ? -1 : 1;
    this.body.reset(player.x + (30 * direction), player.y + 8);
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
