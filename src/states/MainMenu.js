import { playAudio, manageAudio, getStatusAudio } from '../utils/AudioManager';
import { PPTStorage, setStorage } from '../utils/StorageManager';
import Text from '../UI/Text';

import { MENU_HIGHSCORE_FONT, BUTTON_PADDING } from '../constants/UIConstants';

export default class MainMenu extends Phaser.State {
  create() {
    this.add.sprite( 0, 0, 'background' );
    const title = this.add.sprite( this.world.width * 0.5, ( this.world.height - 100 ) * 0.5, 'title' );
    title.anchor.set( 0.5 );

    setStorage( this.game.plugins.add( Phaser.Plugin.Storage ) );

    PPTStorage.initUnset( 'PPT-highscore', 0 );
    const highscore = PPTStorage.get( 'PPT-highscore' ) || 0;

    const buttonPiGames = this.add.button( BUTTON_PADDING, BUTTON_PADDING, 'logo-pigames', this.clickPiGames, this );
    const buttonStart = this.add.button( this.world.width - BUTTON_PADDING, this.world.height - BUTTON_PADDING, 'button-start', this.clickStart, this, 1, 0, 2 );
    buttonStart.anchor.set( 1 );

    this.buttonAudio = this.add.button( this.world.width - BUTTON_PADDING, BUTTON_PADDING, 'button-audio', this.clickAudio, this, 1, 0, 2 );
    this.buttonAudio.anchor.set( 1, 0 );

    const buttonCredits = this.add.button( BUTTON_PADDING, this.world.height - BUTTON_PADDING, 'button-credits', this.clickCredits, this, 1, 0, 2 );
    buttonCredits.anchor.set( 0, 1 );

    const highscoreText = new Text( this.game, 'center', this.world.height - 50, 'Highscore: ' + highscore, MENU_HIGHSCORE_FONT, [ null, 1 ] );
    highscoreText.padding.set( 0, 15 );

    manageAudio( 'init', this );

    if ( getStatusAudio() !== true ) {
      // Turn the music off at the start:
      manageAudio( 'off', this );
    }

    buttonStart.x = this.world.width + buttonStart.width + BUTTON_PADDING;
    this.add.tween( buttonStart ).to( { x: this.world.width - BUTTON_PADDING }, 500, Phaser.Easing.Exponential.Out, true );
    this.buttonAudio.y = -this.buttonAudio.height - BUTTON_PADDING;
    this.add.tween( this.buttonAudio ).to( { y: BUTTON_PADDING }, 500, Phaser.Easing.Exponential.Out, true );
    buttonPiGames.x = -buttonPiGames.width - BUTTON_PADDING;
    this.add.tween( buttonPiGames ).to( { x: BUTTON_PADDING }, 500, Phaser.Easing.Exponential.Out, true );
    buttonCredits.y = this.world.height + buttonCredits.height + BUTTON_PADDING;
    this.add.tween( buttonCredits ).to( { y: this.world.height - BUTTON_PADDING }, 500, Phaser.Easing.Exponential.Out, true );

    this.camera.flash( 0x000000, 500, false );
  }
  clickAudio() {
    playAudio( 'click' );
    manageAudio( 'switch', this );
  }
  clickPiGames() {
    playAudio( 'click' );
    window.open( 'http://pigam.es/', '_blank' );
  }
  clickStart() {
    playAudio( 'click' );
    this.camera.fade( 0x000000, 200, false );
    this.time.events.add( 200, () => {
      this.game.state.start( 'Story' );
      // this.game.state.start( 'Game' );
    } );
  }
  clickCredits() {
    playAudio( 'click' );
    this.camera.fade( 0x000000, 200, false );
    this.time.events.add( 200, () => {
      this.game.state.start( 'Credits' );
    } );
  }
}
