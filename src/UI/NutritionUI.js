import { GOOD_AMOUNT_OF_CARBOHYDRATES, GOOD_AMOUNT_OF_FATS, GOOD_AMOUNT_OF_PROTEINS } from '../constants/NutritionConstants';
import { SUPER_THIN_BREAKPOINT, THIN_BREAKPOINT, FAT_BREAKPOINT, SUPER_FAT_BREAKPOINT } from '../constants/WeightBreakpoints';
import { NUTRITION_BAR_WIDTH, NUTRITION_BAR_HEIGHT, NUTRITION_BAR_OFFSET, NUTRITION_BAR_X_FROM_LEFT, NUTRITION_BAR_Y_FROM_BOTTOM, NUTRITION_BAR_TEXT_OFFSET_X, NUTRITION_BAR_TEXT_OFFSET_Y, NUTRITION_BAR_INFO_FONT, NUTRITION_NUTRITION_ADDED_FONT } from '../constants/UIConstants';
import Text from './Text';

export default class NutritionUI {
  constructor( game, NutritionManager ) {
    this.game = game;

    this.nutrition = NutritionManager.nutrition;

    this.NutritionBars = [];
    this.NutritionMasks = [];
    this.NutritionTexts = [];

    this.drawAllBars();
  }

  updateUI( updatedValues ) {
    this.updateBar( this.nutrition.carbohydrates, GOOD_AMOUNT_OF_CARBOHYDRATES, 2 );
    this.updateBar( this.nutrition.fats, GOOD_AMOUNT_OF_FATS, 1 );
    this.updateBar( this.nutrition.proteins, GOOD_AMOUNT_OF_PROTEINS, 0 );

    if ( updatedValues ) {
      for ( let key in updatedValues ) {
        const value = updatedValues[ key ];
        if ( value !== 0 ) {
          this.displayAddition( key, value );
        }
      }
    }
  }

  drawAllBars() {
    this.drawBar( this.nutrition.carbohydrates, GOOD_AMOUNT_OF_CARBOHYDRATES, 2, 'Carbohydrates' );
    this.drawBar( this.nutrition.fats, GOOD_AMOUNT_OF_FATS, 1, 'Fats' );
    this.drawBar( this.nutrition.proteins, GOOD_AMOUNT_OF_PROTEINS, 0, 'Proteins' );
  }

  displayAddition( key, val ) {
    let i = 0;

    switch ( key ) {
    case 'carbohydrates':
      i = 2;
      break;
    case 'fats':
      i = 1;
      break;
    case 'proteins':
      i = 0;
      break;
    // no default
    }

    const height = NUTRITION_BAR_HEIGHT;
    const offset = i * ( NUTRITION_BAR_OFFSET + height );

    const textX = this.game.width - NUTRITION_BAR_X_FROM_LEFT - NUTRITION_BAR_TEXT_OFFSET_X;
    const textY = this.game.height - NUTRITION_BAR_Y_FROM_BOTTOM - NUTRITION_BAR_TEXT_OFFSET_Y - offset;
    const nutritionAdded = new Text( this.game, textX, textY, `+${val}`, NUTRITION_NUTRITION_ADDED_FONT, [ 1, 1 ] );
    this.game.add.tween( nutritionAdded ).to( { alpha: 0, y: textY - 100 }, 1000, Phaser.Easing.Linear.None, true );
  }

  updateBar( value, goodAmount, i ) {
    const width = NUTRITION_BAR_WIDTH;
    const height = NUTRITION_BAR_HEIGHT;
    const offset = i * ( NUTRITION_BAR_OFFSET + height );
    const doubleOfGoodAmount = goodAmount * 2;

    const status = this.NutritionBars[ i ];

    if (
      value <= doubleOfGoodAmount * SUPER_THIN_BREAKPOINT ||
      value >= doubleOfGoodAmount * SUPER_FAT_BREAKPOINT
    ) {
      status.frame = 2;
    } else if (
      value <= doubleOfGoodAmount * THIN_BREAKPOINT ||
      value >= doubleOfGoodAmount * FAT_BREAKPOINT
    ) {
      status.frame = 1;
    } else {
      status.frame = 0;
    }

    const NutritionBarValue = Math.min( Math.max( ( value / doubleOfGoodAmount ), 0 ), 1 );

    const mask = this.NutritionMasks[ i ];
    mask.clear();
    mask.beginFill( 0x000000 );
    mask.drawRect( this.game.width - NUTRITION_BAR_X_FROM_LEFT - width + ( width * ( 1 - NutritionBarValue ) ), this.game.height - NUTRITION_BAR_Y_FROM_BOTTOM - offset - height, width * NutritionBarValue, height );
    mask.endFill();

    const statusText = this.NutritionTexts[ i ];
    statusText.setText( `${parseInt( value )} / ${goodAmount}` );
  }

  drawBar( value, goodAmount, i, text ) {
    const width = NUTRITION_BAR_WIDTH;
    const height = NUTRITION_BAR_HEIGHT;
    const offset = i * ( NUTRITION_BAR_OFFSET + height );
    const doubleOfGoodAmount = goodAmount * 2;

    const NutritionBarValue = Math.min( Math.max( ( value / doubleOfGoodAmount ), 0 ), 1 );

    const background = this.game.add.sprite( this.game.width - NUTRITION_BAR_X_FROM_LEFT, this.game.height - NUTRITION_BAR_Y_FROM_BOTTOM - offset, 'nutrition-bar-background' );
    background.anchor.setTo( 1, 1 );

    const mask = this.game.add.graphics( 0, 0 );
    mask.beginFill( 0x000000 );
    mask.drawRect( this.game.width - NUTRITION_BAR_X_FROM_LEFT - width + ( width * ( 1 - NutritionBarValue ) ), this.game.height - NUTRITION_BAR_Y_FROM_BOTTOM - offset - height, width * NutritionBarValue, height );
    mask.endFill();

    this.NutritionMasks[ i ] = mask;

    const status = this.game.add.sprite( this.game.width - NUTRITION_BAR_X_FROM_LEFT, this.game.height - NUTRITION_BAR_Y_FROM_BOTTOM - offset, 'nutrition-bar', 0 );
    status.anchor.setTo( 1, 1 );
    status.mask = mask;

    this.NutritionBars[ i ] = status;

    // descText
    new Text( this.game, this.game.width - NUTRITION_BAR_X_FROM_LEFT + NUTRITION_BAR_TEXT_OFFSET_X - width, this.game.height - NUTRITION_BAR_Y_FROM_BOTTOM - offset - NUTRITION_BAR_TEXT_OFFSET_Y, text, NUTRITION_BAR_INFO_FONT, [ 0, 1 ] );

    const statusText = new Text( this.game, this.game.width - NUTRITION_BAR_X_FROM_LEFT - NUTRITION_BAR_TEXT_OFFSET_X, this.game.height - NUTRITION_BAR_Y_FROM_BOTTOM - NUTRITION_BAR_TEXT_OFFSET_Y - offset, `${parseInt( value )} / ${goodAmount}`, NUTRITION_BAR_INFO_FONT, [ 1, 1 ] );

    this.NutritionTexts[ i ] = statusText;
  }
}
