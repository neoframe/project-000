import { Physics } from 'phaser';

import { ENEMY_SPEED } from '../utils/settings';

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
  }

  create () {
    this.layer.objects.forEach(o => {
      const enemy = this.scene.add.sprite(o.x, o.y, 'enemy', 0);
      enemy.setTexture('enemy', 0);
      enemy.play('enemy-moving', true);
      this.add(enemy);
      enemy.body.setSize(19, 15);
      enemy.objectTile = o;
      enemy.direction = 'right';
      this.enemies.push(enemy);
    });

    this.scene.physics.add.collider(this, this.scene.obstacles);
  }

  update () {
    this.enemies.forEach(enemy => {
      enemy
        .setFlip(enemy.direction === 'left', false);
      enemy.body
        .setVelocityX(enemy.direction === 'left' ? -ENEMY_SPEED : ENEMY_SPEED);

      if (
        enemy.x > enemy.objectTile.x + enemy.objectTile.width &&
        enemy.direction === 'right'
      ) {
        enemy.direction = 'left';
      } else if (enemy.x < enemy.objectTile.x && enemy.direction === 'left') {
        enemy.direction = 'right';
      }
    });
  }
}
