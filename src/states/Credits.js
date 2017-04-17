import { CREDITS_FONT, CREDITS_TITLE_FONT, BUTTON_PADDING } from '../constants/UIconstants';
import { playAudio } from '../utils/AudioManager';

import Text from '../UI/Text';

export default class Wiki extends Phaser.State {
  create() {
    this.camera.resetFX();
    this.camera.flash( 0x000000, 500, false );

    const creditsTitle = new Text( this.game, 'center', 0, 'Credits:', CREDITS_TITLE_FONT );
    const creditsText = new Text( this.game, 'center', 'center', 'Bartek „bibixx” Legięć\nKacper Pietrzak', CREDITS_FONT );

    creditsTitle.y = creditsText.y - creditsText.height / 2 - creditsTitle.height;

    const buttonMainMenu = this.add.button( this.world.width - 20, this.world.height - 20, 'button-mainmenu', this.clickBack, this, 1, 0, 2 );
    buttonMainMenu.anchor.set( 1 );

    buttonMainMenu.x = this.world.width + buttonMainMenu.width + BUTTON_PADDING;
    this.add.tween( buttonMainMenu ).to( { x: this.world.width - BUTTON_PADDING }, 500, Phaser.Easing.Exponential.Out, true );
  }

  clickBack() {
    playAudio( 'click' );
    this.camera.fade( 0x000000, 200, false );
    this.time.events.add( 200, () => {
      this.game.state.start( 'MainMenu' );
    } );
  }
}
