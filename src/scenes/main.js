import { Scene } from 'phaser';

import Player from '../objects/player';

export default class MainScene extends Scene {
  player = null;
  cursors = null;

  preload () {
    this.player = new Player(this, 50, 0, 0);
  }

  create () {
    const ground = this.add.rectangle(400, 575, 800, 50, 0xff0000);
    this.physics.add.existing(ground, true);

    const wall = this.add.rectangle(800, 200, 20, 400, 0xff0000);
    this.physics.add.existing(wall, true);

    this.player.create();
    this.physics.add.collider(ground, this.player);
    this.physics.add.collider(wall, this.player);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update () {
    this.player.update();
  }

  initData () {
    // this.data.set('lives', 3);
    // this.data.set('level', 1);
    // this.data.set('score', 0);

    // var text = this.add
    //  .text(10, 10, '', { font: '12px Courier', fill: '#ff0000' });

    // text.setText([
    //     'Level: ' + this.data.get('level'),
    //     'Lives: ' + this.data.get('lives'),
    //     'Score: ' + this.data.get('score')
    // ]);
  }
}
