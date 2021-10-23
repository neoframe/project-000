import { Scene } from 'phaser';

import Player from '../objects/player';
import HUD from '../objects/hud';

export default class MainScene extends Scene {
  player = null;
  cursors = null;
  obstacles = null;

  preload () {
    this.player = new Player(this, 50, 0, 0);
    this.hud = new HUD(this);
  }

  create () {
    // Add viewport & background
    this.add.rectangle(1000, 1000, 2000, 2000, 0x000000);
    this.physics.world.setBounds(0, 0, 2000, 2000);

    // Add ground & walls
    this.obstacles = this.physics.add.staticGroup({ immovable: true });

    const ground = this.add.rectangle(400, 575, 800, 50, 0xff0000);
    this.obstacles.add(ground, true);

    const wall = this.add.rectangle(800, 200, 20, 400, 0xff0000);
    this.obstacles.add(wall, true);

    // Add player & ammo
    this.player.create();
    this.physics.add.collider(this.player, this.obstacles);

    // collide = stops
    // overlap = keeps going
    this.physics.add.overlap(this.player.bullets, this.obstacles, bullet => {
      bullet.destroy();
    });

    // Add stats
    this.hud.create();

    // Generate keys (arrows + space + enter)
    this.cursors = this.input.keyboard.createCursorKeys();

    // Add camera
    this.cameras.main.startFollow(this.player);
  }

  update () {
    this.player.update();
    this.hud.update();
  }
}
