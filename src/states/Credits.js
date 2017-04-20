import { CREDITS_FONT, CREDITS_TITLE_FONT, BUTTON_PADDING, CREDITS_FONT_SOUNDS } from '../constants/UIconstants';
import { playAudio } from '../utils/AudioManager';

import Text from '../UI/Text';

export default class Wiki extends Phaser.State {
  create() {
    this.camera.resetFX();
    this.camera.flash( 0x000000, 500, false );

    const textGroup = this.game.add.group();

    const creditsTitle = new Text( this.game, 'center', 0, 'Credits:', CREDITS_TITLE_FONT );
    const creditsText = new Text( this.game, 'center', 0, 'Bartek „bibixx” Legięć\nKacper Pietrzak', CREDITS_FONT );
    const creditsTextSound = new Text( this.game, 'center', 0, '\nSounds\n„Farty McSty”\nby Eric Matyas\nwww.soundimage.org\n\n„Click2 Sound”\nby Sebastian\nwww.soundbible.com', CREDITS_FONT_SOUNDS );

    const heightSum = creditsTitle.height + creditsText.height + creditsTextSound.height;
    const heightDelta = ( this.game.height - heightSum ) / 2;

    creditsTitle.y += heightDelta;
    creditsText.y += creditsTitle.height + creditsTitle.y;
    creditsTextSound.y += creditsText.y + creditsText.height;

    textGroup.add( creditsText );
    textGroup.add( creditsTextSound );

    textGroup.x = 0;

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
