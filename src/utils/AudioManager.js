import { PPTStorage } from './StorageManager';

let _audioStatus;
let _sound;
let _soundMusic;
let _audioOffset;

export function manageAudio( mode, game ) {
  switch ( mode ) {
  case 'init': {
    PPTStorage.initUnset( 'PPT-audio', true );
    _audioStatus = PPTStorage.get( 'PPT-audio' );
		// PPT._soundClick = game.add.audio('audio-click');
    _sound = [];
    _sound[ 'click' ] = game.add.audio( 'audio-click' );
    if ( !_soundMusic ) {
      _soundMusic = game.add.audio( 'audio-theme', 1, true );
      _soundMusic.volume = 0.5;
    }
    break;
  }
  case 'on': {
    _audioStatus = true;
    break;
  }
  case 'off': {
    _audioStatus = false;
    break;
  }
  case 'switch': {
    _audioStatus = !_audioStatus;
    break;
  }
  }
  if ( _audioStatus ) {
    _audioOffset = 0;
    if ( _soundMusic ) {
      if ( !_soundMusic.isPlaying ) {
        _soundMusic.play( '', 0, 1, true );
      }
    }
  }		else {
    _audioOffset = 4;
    if ( _soundMusic ) {
      _soundMusic.stop();
    }
  }
  PPTStorage.set( 'PPT-audio', _audioStatus );
  game.buttonAudio.setFrames( _audioOffset + 1, _audioOffset + 0, _audioOffset + 2 );
}
export function playAudio( sound ) {
  if ( _audioStatus ) {
    if ( _sound && _sound[ sound ] ) {
      _sound[ sound ].play();
    }
  }
}

export function getStatusAudio() {
  return _audioStatus;
}

export const getAudioOffset = () => _audioOffset;
