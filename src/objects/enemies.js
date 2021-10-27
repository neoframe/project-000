import { Physics } from 'phaser';

import Enemy from './enemy';

export default class Enemies extends Physics.Arcade.Group {
  layer = null;
  enemies = [];

  constructor (scene, mapLayer) {
    super(scene.physics.world, scene);
    this.layer = mapLayer;

    scene.anims.create({
      key: 'enemy-moving',
      frames: scene.anims
        .generateFrameNumbers('enemy', { start: 0, end: 9 }),
      frameRate: 10,
      repeat: -1,
    });

    this.layer.objects.forEach(o => {
      const enemy = new Enemy(this.scene, o, o.x, o.y);
      this.scene.add.existing(enemy);
      this.add(enemy);
      enemy.create();
      this.enemies.push(enemy);
    });
  }

  create () {
    this.scene.physics.add.collider(this, this.scene.obstacles);
  }

  update () {
    this.enemies.forEach(enemy => {
      enemy.update();
    });
  }
}
