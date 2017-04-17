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
    bmd.ctx.strokeStyle = '#000000';
    bmd.ctx.fillStyle = '#0f872c';
    bmd.ctx.fill();
    bmd.ctx.stroke();


    this.player = this.game.add.sprite( this.game.world.centerX, this.game.height, bmd );
    this.player.anchor.setTo( 0.5, 0.5 );
    this.game.physics.arcade.enable( this.player );
    this.player.body.moves = false;
    this.player.body.immovable = true;

    this.interval = 1;

    this.game.time.events.add( Phaser.Timer.SECOND, this.spawnHead, this );
  }

  handleCollision() {
    this.gameUI.stateGameover();
  }

  spawnHead() {
    const head = this.heads.create( 0, 0, 'head' );
    head.x = this.game.rnd.integerInRange( head.width, this.game.width );
    head.anchor.set( 1, 1 );
    head.immovable = true;
    head.body.velocity.y = 300;

    this.interval *= 1.005;

    this.game.time.events.add( Phaser.Timer.SECOND * ( 1 / this.interval ), this.spawnHead, this );
  }

  stopHeads() {
    this.heads.forEach( ( head ) => {
      head.savedVY = head.body.velocity.y;
      head.body.velocity.y = 0;
    } );
  }

  startHeads() {
    this.heads.forEach( ( head ) => {
      head.body.velocity.y = head.savedVY;
    } );
  }

  update() {
    this.gameUI.updateUI();

    if ( this.gameUI.stateStatus === 'playing' ) {
      this.game.physics.arcade.collide( this.player, this.heads, this.handleCollision, null, this );
      this.player.x = this.game.input.x;
      this.player.y = this.game.input.y;
    }
  }
}
