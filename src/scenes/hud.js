import { Scene } from 'phaser';

export default class HUD extends Scene {
  text = null;

  constructor () {
    super('HUD');
  }

  create () {
    this.text = this.add
      .text(10, 10, '', { font: '16px Courier', fill: '#ff0000' });
  }

  update () {
    this.text.setText([
      'Bullets fired: ' + this.registry.get('bulletsFired'),
      'Player animation: ' + this.registry.get('playerAnimation'),
    ]);
  }
}
