import { Scene } from 'phaser';

import Player from '../objects/player';
import HUD from '../objects/hud';

export default class MainScene extends Scene {
  player = null;
  cursors = null;

  preload () {
    this.player = new Player(this, 50, 0, 0);
    this.hud = new HUD(this);
  }

  create () {
    const ground = this.add.rectangle(400, 575, 800, 50, 0xff0000);
    this.physics.add.existing(ground, true);

    const wall = this.add.rectangle(800, 200, 20, 400, 0xff0000);
    this.physics.add.existing(wall, true);

    this.player.create();
    this.physics.add.collider(ground, this.player);
    this.physics.add.collider(wall, this.player);

    this.hud.create();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(this.player);
  }

  update () {
    this.player.update();
    this.hud.update();
  }
}
