import { Scene } from 'phaser';

import Player from '../objects/player';
import HUD from '../objects/hud';
import map0101 from '../assets/maps/01_01.json';
import tileset from '../assets/images/tileset.png';

export default class MainScene extends Scene {
  player = null;
  cursors = null;
  map = null;
  tileset = null;
  foreground = null;
  obstacles = null;

  preload () {
    this.load.image('tileset', tileset);
    this.load.tilemapTiledJSON('map-01-01', map0101);

    this.player = new Player(this, 50, 0, 0);
    this.hud = new HUD(this);
  }

  setMap (world, level) {
    this.map = this.make.tilemap({ key: `map-${world}-${level}` });
    this.tileset = this.map.addTilesetImage('tileset', 'tileset');
    this.obstacles = this.map.createLayer('floor', this.tileset, 0, 0);
    this.obstacles.setCollisionByExclusion(-1, true);
    this.foreground = this.map.createLayer('foreground', this.tileset, 0, 0);
    this.physics.world
      .setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
  }

  create () {
    const background = this.add.rectangle(0, 0, 100, 100, 0x000000);

    this.setMap('01', '01');

    background.setOrigin(0, 0);
    background.setSize(this.map.widthInPixels, this.map.heightInPixels);

    // Add player & ammo
    this.player.create();
    this.physics.add.collider(this.player, this.obstacles);

    // collide = stops
    // overlap = keeps going
    this.physics.add.collider(this.player.bullets, this.obstacles, bullet => {
      bullet.destroy();
    });

    // Add stats
    this.hud.create();

    // Generate keys (arrows + space + enter)
    this.cursors = this.input.keyboard.createCursorKeys();

    // Add camera
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(4);
  }

  update () {
    this.player.update();
    this.hud.update();
  }
}
