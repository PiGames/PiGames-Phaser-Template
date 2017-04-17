export default class Boot extends Phaser.State {
  preload() {
    this.game.stage.backgroundColor = '#2196F3';
    this.game.load.image( 'loading-background', 'img/loading-background.png' );
    this.game.load.image( 'loading-progress', 'img/loading-progress.png' );
  }
  create() {
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    this.game.state.start( 'Preloader' );
  }
}
