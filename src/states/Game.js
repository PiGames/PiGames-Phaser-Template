import GameUI from '../UI/GameUI';

export default class Game extends Phaser.State {
  create() {
    this.gameUI = new GameUI( this );

    this.camera.resetFX();
    this.camera.flash( 0x000000, 500, false );

    this.game.onResume.add( () => {
      if ( this.gameUI.stateStatus !== 'playing' ) {
        this.game.time.events.pause();
      }
    } );

    this.createGame();
  }


  createGame() {
    this.heads = this.game.add.group();
    this.heads.enableBody = true;
    this.heads.physicsBodyType = Phaser.Physics.ARCADE;

    const width = 300;
    const height = 100;
    const bmd = this.game.add.bitmapData( width, height );

    bmd.ctx.beginPath();
    bmd.ctx.rect( 0, 0, width, height );
    bmd.ctx.lineWidth = 6;
    bmd.ctx.strokeStyle = '#1c1c1c';
    bmd.ctx.fillStyle = '#373737';
    bmd.ctx.fill();
    bmd.ctx.stroke();
  }

  update() {
    this.gameUI.updateUI();

    if ( this.gameUI.stateStatus === 'playing' ) {

    }
  }
}
