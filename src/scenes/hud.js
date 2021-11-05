import { Scene } from 'phaser';

import playerSprite from '../assets/images/player.png';
import lifeSprite from '../assets/images/life.png';
import emptyLifeSprite from '../assets/images/life-empty.png';
import { ZOOM } from '../utils/settings';

export default class HUD extends Scene {
  text = null;
  player = null;

  constructor () {
    super('HUD');
  }

  preload () {
    this.load.image('player-icon', playerSprite);
    this.load.image('life', lifeSprite);
    this.load.image('empty-life', emptyLifeSprite);
  }

  getPlayer () {
    return this.scene.get('MainScene').player;
  }

  getScore () {
    const score = this.registry.get('score') || 0;
    const scoreLength = ('' + score).length;

    return Array
      .from({ length: 10 - scoreLength }).map(() => 0)
      .join('') + score;
  }

  getHealth () {
    return Math.floor(this.getPlayer()?.health / 10) || 10;
  }

  getLives () {
    return this.getPlayer()?.lives;
  }

  create () {
    const playerIcon = this.add.image(10, 10, 'player-icon')
      .setOrigin(0, 0).setScale(ZOOM);

    this.add.group({
      key: 'empty-life',
      repeat: 10,
      setXY: {
        x: playerIcon.x + (playerIcon.width * ZOOM) + 15,
        y: playerIcon.y + 15,
        stepX: 15,
        stepY: 0,
      },
      setScale: {
        x: ZOOM,
        y: ZOOM,
      },
    });

    this.healthBlocks = this.add.group({
      key: 'life',
      repeat: 10,
      setXY: {
        x: playerIcon.x + (playerIcon.width * ZOOM) + 15,
        y: playerIcon.y + 15,
        stepX: 15,
        stepY: 0,
      },
      setScale: {
        x: ZOOM,
        y: ZOOM,
      },
    });

    this.score = this.add.text(
      this.cameras.main.width / 2,
      10,
      this.getScore(),
      { fontFamily: 'm6x11', fontSize: 70 }
    );
    this.score.setShadow(4, 4, '#000000', 2, true, true);

    this.lives = this.add.text(
      playerIcon.x + (playerIcon.width * ZOOM) + 10,
      40,
      'x' + this.getLives(),
      { fontFamily: 'm6x11', fontSize: 20 },
    );
    this.lives.setShadow(2, 2, '#000000', 2, true, true);
  }

  update () {
    this.score.setText(this.getScore());
    this.score
      .setPosition(this.cameras.main.width / 2 - this.score.width / 2, 10);

    this.lives.setText('x' + this.getLives());

    this.healthBlocks.getChildren().forEach((block, index) => {
      block.setVisible(index <= this.getHealth());
    });
  }
}
