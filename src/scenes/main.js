import { Scene } from 'phaser';

import { ZOOM } from '../utils/settings';
import Player from '../objects/player';
import Enemies from '../objects/enemies';
import map0101 from '../assets/maps/01_01.json';
import tileset from '../assets/images/tileset.png';
import enemySprite from '../assets/images/enemy.png';
import enemyDeadSprite from '../assets/images/enemy-dead.png';

export default class MainScene extends Scene {
  player = null;
  enemies = null;
  cursors = null;
  map = null;
  obstacles = [];

  constructor () {
    super('MainScene');
  }

  preload () {
    this.load.image('tileset', tileset);
    this.load.tilemapTiledJSON('map-01-01', map0101);

    this.load.spritesheet('enemy', enemySprite,
      { frameWidth: 26, frameHeight: 22 });
    this.load.spritesheet('enemy-dead', enemyDeadSprite,
      { frameWidth: 26, frameHeight: 22 });

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
        ?.some(p => p.name === 'collisions' && p.value === true);

      // Avoid to include all layers as collisions layers to increase perfs
      if (collide) {
        tileLayer.setCollisionByProperty({ collides: true }, true);
        this.obstacles.push(tileLayer);
      }
    });

    const enemies = this.map.objects.find(layer =>
      layer.properties?.some?.(p => p.name === 'enemies' && p.value === true)
    );

    if (enemies) {
      this.enemies = new Enemies(this, enemies);
    }

    this.physics.world
      .setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main
      .setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
  }

  setStartPosition () {
    const startTile = this.map.objects
      .find(l => l.name === 'player')?.objects[0];

    if (startTile) {
      this.player.setPosition(startTile.x, startTile.y);
    }
  }

  create () {
    this.setMap('01', '01');

    // Add enemies
    this.enemies?.create();

    // Add player & ammo
    this.player.create();
    this.setStartPosition();

    // Generate keys (arrows + space + enter)
    this.cursors = this.input.keyboard.createCursorKeys();

    // Add camera
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(ZOOM);

    // Add background & stats
    this.scene.launch('Background');
    this.scene.launch('HUD');
  }

  update () {
    this.player.update();
    this.enemies.update();
  }
}
