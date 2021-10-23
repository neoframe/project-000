export default class HUD {
  scene = null;
  text = null;

  constructor (scene) {
    this.scene = scene;
  }

  create () {
    this.text = this.scene.add
      .text(10, 10, '', { font: '16px Courier', fill: '#ff0000' })
      .setScrollFactor(0);
  }

  update () {
    this.text.setText([
      'Level: ' + (this.scene.data.get('level') || 0),
      'Lives: ' + (this.scene.data.get('lives') || 0),
      'Score: ' + (this.scene.data.get('score') || 0),
      'Bullets fired: ' + this.scene.data.get('bulletsFired'),
      'Player animation: ' + this.scene.data.get('playerAnimation'),
    ]);
  }
}
