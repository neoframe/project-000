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

    scene.anims.create({
      key: 'enemy-dead',
      frames: scene.anims
        .generateFrameNumbers('enemy-dead', { start: 0, end: 11 }),
      frameRate: 10,
      repeat: 0,
    });

    scene.anims.create({
      key: 'enemy-shooting',
      frames: scene.anims
        .generateFrameNumbers('enemy-shooting', { start: 0, end: 1 }),
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

  removeEnemy (enemy) {
    this.enemies = this.enemies.filter(e => e !== enemy);
    enemy.body.setGravity(0, 0);
    enemy.body.setVelocity(0, 0);
    enemy.body.allowGravity = false;
    enemy.anims.play('enemy-dead', true);
    enemy.once('animationcomplete', () => {
      enemy.active && this.scene.registry
        .set('enemiesKilled', this.scene.registry.get('enemiesKilled') + 1);
      enemy.setActive(false);
      enemy.destroy();
    });
  }
}
