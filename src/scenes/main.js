import { Scene } from 'phaser';

import { ZOOM } from '../utils/settings';
import Player from '../objects/player';
import map0101 from '../assets/maps/01_01.json';
import tileset from '../assets/images/tileset.png';

export default class MainScene extends Scene {
  player = null;
  cursors = null;
  map = null;
  tileset = null;
  foreground = null;
  obstacles = [];

  constructor () {
    super('MainScene');
  }

  preload () {
    this.load.image('tileset', tileset);
    this.load.tilemapTiledJSON('map-01-01', map0101);

    this.player = new Player(this, 50, 0, 0);
  }

  setMap (world, level) {
    this.map = this.make.tilemap({ key: `map-${world}-${level}` });
    this.tileset = this.map.addTilesetImage('tileset', 'tileset');
    this.obstacles = [];

    // Draw all layers found inside the map
    this.map.layers.forEach(l => {
      const tileLayer = this.map.createLayer(l.name, this.tileset, 0, 0);
      const collide = l.properties
        ?.some(p => p.name === 'collide' && p.value === true);

      // Add collisions to layers with collide: true property
      if (collide) {
        tileLayer.setCollisionByExclusion(-1, true);
        this.obstacles.push(tileLayer);
      }
    });

    this.physics.world
      .setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main
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

    // Generate keys (arrows + space + enter)
    this.cursors = this.input.keyboard.createCursorKeys();

    // Add camera
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(ZOOM);

    // Add stats
    this.scene.launch('HUD');
  }

  update () {
    this.player.update();
  }
}
