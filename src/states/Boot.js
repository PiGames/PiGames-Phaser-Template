import { BACKGROUND_COLOR } from '../constants/UIConstants';

export default class Boot extends Phaser.State {
  preload() {
    this.game.stage.backgroundColor = BACKGROUND_COLOR;
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
