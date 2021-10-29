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

  getScore () {
    const score = this.registry.get('score') || 0;
    const scoreLength = ('' + score).length;

    return Array
      .from({ length: 10 - scoreLength }).map(() => 0)
      .join('') + score;
  }

  getLife () {
    return Math.floor(this.scene.get('MainScene').player?.life / 10) || 10;
  }

  create () {
    const _ = this.add.image(10, 10, 'player-icon')
      .setOrigin(0, 0).setScale(ZOOM);

    this.score = this.add.text(
      this.cameras.main.width / 2,
      10,
      this.getScore(),
      { fontFamily: 'm6x11', fontSize: 70 }
    );
    this.score.setShadow(4, 4, '#000000', 2, true, true);
  }

  update () {
    this.score.setText(this.getScore());
    this.score
      .setPosition(this.cameras.main.width / 2 - this.score.width / 2, 10);
  }
}
