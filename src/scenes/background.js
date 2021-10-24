import { Scene } from 'phaser';

import { BACKGROUND_PARALLAX_BASE_SPEED } from '../utils/settings';
import backgroundLayer1 from '../assets/images/background-layer-1.png';
import backgroundLayer2 from '../assets/images/background-layer-2.png';
import backgroundLayer3 from '../assets/images/background-layer-3.png';

export default class Background extends Scene {
  layers = [];
  gameHeight = 0;

  constructor () {
    super('Background');
  }

  preload () {
    this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0)');
    this.load.image('background-layer-1', backgroundLayer1);
    this.load.image('background-layer-2', backgroundLayer2);
    this.load.image('background-layer-3', backgroundLayer3);

    // Change background zindex to draw it under everything
    this.scene.moveBelow('MainScene');
  }

  addLayer (index, speed) {
    const texture = this.textures
      .get(`background-layer-${index}`).getSourceImage();

    const layer = this.add
      .tileSprite(
        0, 0, this.game.canvas.width, this.game.canvas.height,
        'background-layer-' + index
      )
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setScale(this.game.canvas.height / texture.height);

    layer.parallaxSpeed = speed;
    layer.texture = texture;
    this.layers.push(layer);
  }

  create () {
    Array
      .from({ length: 3 })
      .map((_, i) =>
        this.addLayer(i + 1, BACKGROUND_PARALLAX_BASE_SPEED * (i + 1))
      );
  }

  update () {
    this.layers.forEach(layer => {

      // Only resize layer when canvas height has changed
      if (this.game.canvas.height !== this.gameHeight) {
        layer.setScale(this.game.canvas.height / layer.texture.height);
      }

      layer.tilePositionX = this.scene.get('MainScene').cameras.main.scrollX *
        layer.parallaxSpeed;
    });

    this.gameHeight = this.game.canvas.height;
  }
}
