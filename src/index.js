import PPT from './states';

const game = new Phaser.Game( 1920, 1280, Phaser.AUTO );
const states = {
  'Boot': PPT.Boot,
  'Preloader': PPT.Preloader,
  'MainMenu': PPT.MainMenu,
  'Credits': PPT.Credits,
  'Story': PPT.Story,
  'Game': PPT.Game,
};
for ( const stateName in states ) {
  game.state.add( stateName, states[ stateName ] );
}
game.state.start( 'Boot' );
