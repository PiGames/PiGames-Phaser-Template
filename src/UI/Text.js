export default class Text extends Phaser.Text {
  constructor( game, x = 0, y = 0, text = '', style = {}, anchor = [ 0, 0 ] ) {
    super( game, x, y, text, style );
    const newAnchor = anchor;

    if ( x === 'center' ) {
      this.x = game.world.centerX;
      newAnchor[ 0 ] = newAnchor[ 0 ] || 0.5;
    }

    if ( y === 'center' ) {
      this.y = game.world.centerY;
      newAnchor[ 1 ] = newAnchor[ 1 ] || 0.5;
    }

    if ( style.shadow ) {
      const shadow = style.shadow.match( /rgba\(.+\)|[^ ]+/g );
      this.setShadow.apply( this, shadow );
    }

    this.anchor.setTo( newAnchor[ 0 ], newAnchor[ 1 ] );
    game.add.existing( this );
  }
}
