import bulletSprite from '../assets/bullet.png';

class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, ...args) {
    super(scene, ...args);
  }

  fire (player) {
    const direction = player.direction === 'left' ? -1 : 1;
    this.body.reset(player.x + (48 * direction), player.y + 10);

    this.setActive(true);
    this.setVisible(true);

    this.setVelocityX(player.direction === 'left' ? -200 : 200);
  }

  preUpdate (time, delta) {
    super.preUpdate(time, delta);

    if (this.outOfWorldBounds) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}

export default class Bullets extends Phaser.Physics.Arcade.Group {
  player = null;

  constructor (scene, player) {
    super(scene.physics.world, scene);
    this.player = player;

    scene.load.spritesheet('bullet', bulletSprite, { frameWidth: 8, frameHeight: 8 });
    scene.anims.create({
      key: 'bullet-animation',
      frames: this.scene.anims.generateFrameNumbers('bullet', { start: 0, end: 7 }),
      frameRate: 5,
      repeat: 1,
    });

    this.createMultiple({
      frameQuantity: 8,
      key: 'bullet',
      frame: 0,
      active: false,
      visible: false,
      classType: Bullet
    });
  }

  fireBullet () {
    this.getFirstDead(true)?.fire(this.player);
  }
}