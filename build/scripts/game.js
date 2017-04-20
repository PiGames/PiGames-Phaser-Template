(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _UIConstants = require('../constants/UIConstants');

var _AudioManager = require('../utils/AudioManager');

var _Text = require('./Text');

var _Text2 = _interopRequireDefault(_Text);

var _StorageManager = require('../utils/StorageManager');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var GameUI = function () {
  function GameUI(state) {
    _classCallCheck(this, GameUI);

    this.state = state;
    this.game = state.game;

    this.stateStatus = 'playing';

    this.score = 0;
    this.runOnce = false;
    this.gamePaused = false;

    this.initScore();
    this.initPauseScreen();
    this.initGameoverScreen();
  }

  _createClass(GameUI, [{
    key: 'initScore',
    value: function initScore() {
      this.textScore = new _Text2.default(this.game, 30, this.game.world.height - 20, (0, _UIConstants.SCORE_TEMPLATE)(this.score), _UIConstants.SCORE_FONT, [0, 1]);

      this.game.time.events.loop(Phaser.Timer.SECOND * 1, this.handlePointsAddition, this);
    }
  }, {
    key: 'initPauseScreen',
    value: function initPauseScreen() {
      this.buttonPause = this.game.add.button(this.game.world.width - _UIConstants.BUTTON_PADDING, _UIConstants.BUTTON_PADDING, 'button-pause', this.managePause, this, 1, 0, 2);
      this.buttonPause.anchor.set(1, 0);
      this.buttonPause.input.priorityID = 0;

      this.buttonPause.y = -this.buttonPause.height - _UIConstants.BUTTON_PADDING;
      this.game.add.tween(this.buttonPause).to({ y: _UIConstants.BUTTON_PADDING }, 1000, Phaser.Easing.Exponential.Out, true);

      this.screenPausedGroup = this.game.add.group();
      this.screenPausedBg = this.game.add.sprite(0, 0, 'overlay');
      this.screenPausedBg.scale.setTo(2);

      this.screenPausedText = new _Text2.default(this.game, 'center', 'center', 'Paused', _UIConstants.PAUSE_TITLE_FONT);

      this.buttonAudio = this.game.add.button(this.game.world.width - _UIConstants.BUTTON_PADDING, _UIConstants.BUTTON_PADDING, 'button-audio', this.clickAudio, this, 1, 0, 2);
      this.buttonAudio.anchor.set(1, 0);
      this.buttonAudio.setFrames((0, _AudioManager.getAudioOffset)() + 1, (0, _AudioManager.getAudioOffset)() + 0, (0, _AudioManager.getAudioOffset)() + 2);

      this.screenPausedBack = this.game.add.button(_UIConstants.BUTTON_PADDING, this.game.world.height - _UIConstants.BUTTON_PADDING, 'button-mainmenu', this.stateBack, this, 1, 0, 2);
      this.screenPausedBack.anchor.set(0, 1);

      this.screenPausedContinue = this.game.add.button(this.game.world.width - _UIConstants.BUTTON_PADDING, this.game.world.height - _UIConstants.BUTTON_PADDING, 'button-continue', this.managePause, this, 1, 0, 2);
      this.screenPausedContinue.anchor.set(1, 1);

      this.screenPausedGroup.add(this.screenPausedBg);
      this.screenPausedGroup.add(this.screenPausedText);
      this.screenPausedGroup.add(this.buttonAudio);
      this.screenPausedGroup.add(this.screenPausedBack);
      this.screenPausedGroup.add(this.screenPausedContinue);
      this.screenPausedGroup.alpha = 0;
      this.screenPausedGroup.visible = false;
    }
  }, {
    key: 'initGameoverScreen',
    value: function initGameoverScreen() {
      this.screenGameoverGroup = this.game.add.group();
      this.screenGameoverBg = this.game.add.sprite(0, 0, 'overlay');
      this.screenGameoverBg.scale.setTo(2);
      this.screenGameoverBg.inputEnabled = true;
      this.screenGameoverBg.input.priorityID = 1;

      this.screenGameoverText = new _Text2.default(this.game, 'center', 100, 'Game over', _UIConstants.GAMEOVER_TITLE_FONT);

      this.screenGameoverBack = this.game.add.button(_UIConstants.BUTTON_PADDING, this.game.world.height - _UIConstants.BUTTON_PADDING, 'button-mainmenu', this.stateBack, this, 1, 0, 2);
      this.screenGameoverBack.anchor.set(0, 1);
      this.screenGameoverBack.input.priorityID = 2;

      this.screenGameoverRestart = this.game.add.button(this.game.world.width - _UIConstants.BUTTON_PADDING, this.game.world.height - _UIConstants.BUTTON_PADDING, 'button-restart', this.stateRestart, this, 1, 0, 2);
      this.screenGameoverRestart.anchor.set(1, 1);
      this.screenGameoverRestart.anchor.set(1, 1);
      this.screenGameoverRestart.input.priorityID = 2;

      this.screenGameoverScore = new _Text2.default(this.game, 'center', 'center', 'Score: ' + this.score, _UIConstants.GAMEOVER_SCORE_FONT);

      this.screenGameoverGroup.add(this.screenGameoverBg);
      this.screenGameoverGroup.add(this.screenGameoverText);
      this.screenGameoverGroup.add(this.screenGameoverBack);
      this.screenGameoverGroup.add(this.screenGameoverRestart);
      this.screenGameoverGroup.add(this.screenGameoverScore);
      this.screenGameoverGroup.alpha = 0;
      this.screenGameoverGroup.visible = false;
    }
  }, {
    key: 'updateUI',
    value: function updateUI() {
      switch (this.stateStatus) {
        case 'paused':
          {
            if (!this.runOnce) {
              this.statePaused();
              this.runOnce = true;
            }
            break;
          }
        case 'gameover':
          {
            if (!this.runOnce) {
              this.stateGameover();
              this.runOnce = true;
            }
            break;
          }
        case 'playing':
          {
            if (!this.runOnce) {
              this.statePlaying();
              this.runOnce = true;
            }
          }
      }
    }
  }, {
    key: 'handlePointsAddition',
    value: function handlePointsAddition() {
      this.score++;
      this.textScore.setText((0, _UIConstants.SCORE_TEMPLATE)(this.score));
    }
  }, {
    key: 'managePause',
    value: function managePause() {
      if (!this.screenGameoverGroup.visible) {
        this.gamePaused = !this.gamePaused;
        (0, _AudioManager.playAudio)('click');
        if (this.gamePaused) {
          this.game.world.bringToTop(this.screenPausedGroup);
          this.stateStatus = 'paused';
          this.runOnce = false;
          this.game.time.events.pause();
        } else {
          this.stateStatus = 'playing';
          this.runOnce = false;
          this.game.time.events.resume();
        }
      }
    }
  }, {
    key: 'statePlaying',
    value: function statePlaying() {
      var _this = this;

      this.state.startHeads.call(this.state);
      var tween = this.game.add.tween(this.screenPausedGroup);
      tween.to({ alpha: 0 }, 100, Phaser.Easing.Linear.None, true);
      tween.onComplete.add(function () {
        if (_this.screenPausedGroup.visible) {
          _this.screenPausedGroup.visible = false;
        }
      }, this);
    }
  }, {
    key: 'statePaused',
    value: function statePaused() {
      this.screenPausedGroup.visible = true;
      this.state.stopHeads.call(this.state);
      var tween = this.game.add.tween(this.screenPausedGroup);
      tween.to({ alpha: 1 }, 100, Phaser.Easing.Linear.None, true);
    }
  }, {
    key: 'stateBack',
    value: function stateBack() {
      (0, _AudioManager.playAudio)('click');
      this.screenGameoverGroup.visible = false;
      this.gamePaused = false;
      this.runOnce = false;
      this.stateStatus = 'playing';
      this.game.time.events.resume();
      this.state.state.start('MainMenu');
    }
  }, {
    key: 'stateGameover',
    value: function stateGameover() {
      this.stateStatus = 'gameover';
      this.game.time.events.pause();
      this.state.stopHeads.call(this.state);
      this.game.world.bringToTop(this.screenGameoverGroup);
      this.screenGameoverScore.setText('You have survived for ' + Math.floor(this.score) + ' seconds');

      this.screenGameoverGroup.visible = true;
      var tween = this.game.add.tween(this.screenGameoverGroup);
      tween.to({ alpha: 1 }, 100, Phaser.Easing.Linear.None, true);

      _StorageManager.PPTStorage.setHighscore('PPT-highscore', this.score);
    }
  }, {
    key: 'stateRestart',
    value: function stateRestart() {
      (0, _AudioManager.playAudio)('click');
      this.screenGameoverGroup.visible = false;
      this.gamePaused = false;
      this.runOnce = false;
      this.stateStatus = 'playing';
      this.game.time.events.resume();
      this.state.state.restart(true);
    }
  }, {
    key: 'clickAudio',
    value: function clickAudio() {
      (0, _AudioManager.playAudio)('click');
      (0, _AudioManager.manageAudio)('switch', this);
    }
  }]);

  return GameUI;
}();

exports.default = GameUI;

},{"../constants/UIConstants":3,"../utils/AudioManager":13,"../utils/StorageManager":14,"./Text":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Text = function (_Phaser$Text) {
  _inherits(Text, _Phaser$Text);

  function Text(game) {
    var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var text = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    var style = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var anchor = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [0, 0];

    _classCallCheck(this, Text);

    var _this = _possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).call(this, game, x, y, text, style));

    var newAnchor = anchor;

    if (x === 'center') {
      _this.x = game.world.centerX;
      newAnchor[0] = newAnchor[0] || 0.5;
    }

    if (y === 'center') {
      _this.y = game.world.centerY;
      newAnchor[1] = newAnchor[1] || 0.5;
    }

    if (style.shadow) {
      var shadow = style.shadow.match(/rgba\(.+\)|[^ ]+/g);
      _this.setShadow.apply(_this, shadow);
    }

    _this.anchor.setTo(newAnchor[0], newAnchor[1]);
    game.add.existing(_this);
    return _this;
  }

  return Text;
}(Phaser.Text);

exports.default = Text;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var BACKGROUND_COLOR = exports.BACKGROUND_COLOR = '#f06292';

var BUTTON_PADDING = exports.BUTTON_PADDING = 20;

var STORY_FONT = exports.STORY_FONT = { font: '88px "Bromine"', fill: '#fff', shadow: '0 0 rgba(0, 0, 0, 0.5) 10' };

var SCORE_FONT = exports.SCORE_FONT = { font: '64px "Bromine"', fill: '#fff', shadow: '0 0 rgba(0, 0, 0, 0.5) 10' };
var SCORE_TEMPLATE = exports.SCORE_TEMPLATE = function SCORE_TEMPLATE(time) {
  return 'Time: ' + time + 's';
};

var PAUSE_TITLE_FONT = exports.PAUSE_TITLE_FONT = { font: '112px "Bromine"', fill: '#fff', shadow: '0 0 rgba(0, 0, 0, 0.5) 30' };

var GAMEOVER_TITLE_FONT = exports.GAMEOVER_TITLE_FONT = { font: '112px "Bromine"', fill: '#fff', shadow: '0 0 rgba(0, 0, 0, 0.5) 10' };
var GAMEOVER_SCORE_FONT = exports.GAMEOVER_SCORE_FONT = { font: '64px "Bromine"', fill: '#fff', align: 'center', shadow: '0 0 rgba(0, 0, 0, 0.5) 10' };

var MENU_HIGHSCORE_FONT = exports.MENU_HIGHSCORE_FONT = { font: '56px "Bromine"', fill: '#fff', align: 'center', shadow: '0 0 rgba(0, 0, 0, 0.5) 10' };

var CREDITS_TITLE_FONT = exports.CREDITS_TITLE_FONT = { font: '128px "Bromine"', fill: '#fff', align: 'center', shadow: '0 0 rgba(0, 0, 0, 0.5) 10' };
var CREDITS_FONT = exports.CREDITS_FONT = { font: '56px "Bromine"', fill: '#fff', align: 'center', shadow: '0 0 rgba(0, 0, 0, 0.5) 10' };
var CREDITS_FONT_SOUNDS = exports.CREDITS_FONT_SOUNDS = { font: '36px "Bromine"', fill: '#fff', align: 'center', shadow: '0 0 rgba(0, 0, 0, 0.5) 10' };

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var BACKGROUND_COLOR = exports.BACKGROUND_COLOR = '#f06292';

var BUTTON_PADDING = exports.BUTTON_PADDING = 20;

var STORY_FONT = exports.STORY_FONT = { font: '88px "Bromine"', fill: '#fff', shadow: '0 0 rgba(0, 0, 0, 0.5) 10' };

var SCORE_FONT = exports.SCORE_FONT = { font: '64px "Bromine"', fill: '#fff', shadow: '0 0 rgba(0, 0, 0, 0.5) 10' };
var SCORE_TEMPLATE = exports.SCORE_TEMPLATE = function SCORE_TEMPLATE(time) {
  return 'Time: ' + time + 's';
};

var PAUSE_TITLE_FONT = exports.PAUSE_TITLE_FONT = { font: '112px "Bromine"', fill: '#fff', shadow: '0 0 rgba(0, 0, 0, 0.5) 30' };

var GAMEOVER_TITLE_FONT = exports.GAMEOVER_TITLE_FONT = { font: '112px "Bromine"', fill: '#fff', shadow: '0 0 rgba(0, 0, 0, 0.5) 10' };
var GAMEOVER_SCORE_FONT = exports.GAMEOVER_SCORE_FONT = { font: '64px "Bromine"', fill: '#fff', align: 'center', shadow: '0 0 rgba(0, 0, 0, 0.5) 10' };

var MENU_HIGHSCORE_FONT = exports.MENU_HIGHSCORE_FONT = { font: '56px "Bromine"', fill: '#fff', align: 'center', shadow: '0 0 rgba(0, 0, 0, 0.5) 10' };

var CREDITS_TITLE_FONT = exports.CREDITS_TITLE_FONT = { font: '128px "Bromine"', fill: '#fff', align: 'center', shadow: '0 0 rgba(0, 0, 0, 0.5) 10' };
var CREDITS_FONT = exports.CREDITS_FONT = { font: '56px "Bromine"', fill: '#fff', align: 'center', shadow: '0 0 rgba(0, 0, 0, 0.5) 10' };
var CREDITS_FONT_SOUNDS = exports.CREDITS_FONT_SOUNDS = { font: '36px "Bromine"', fill: '#fff', align: 'center', shadow: '0 0 rgba(0, 0, 0, 0.5) 10' };

},{}],5:[function(require,module,exports){
'use strict';

var _states = require('./states');

var _states2 = _interopRequireDefault(_states);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var game = new Phaser.Game(1920, 1280, Phaser.AUTO);
var states = {
  'Boot': _states2.default.Boot,
  'Preloader': _states2.default.Preloader,
  'MainMenu': _states2.default.MainMenu,
  'Credits': _states2.default.Credits,
  'Story': _states2.default.Story,
  'Game': _states2.default.Game
};
for (var stateName in states) {
  game.state.add(stateName, states[stateName]);
}
game.state.start('Boot');

},{"./states":12}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _UIConstants = require('../constants/UIConstants');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Boot = function (_Phaser$State) {
  _inherits(Boot, _Phaser$State);

  function Boot() {
    _classCallCheck(this, Boot);

    return _possibleConstructorReturn(this, (Boot.__proto__ || Object.getPrototypeOf(Boot)).apply(this, arguments));
  }

  _createClass(Boot, [{
    key: 'preload',
    value: function preload() {
      this.game.stage.backgroundColor = _UIConstants.BACKGROUND_COLOR;
      this.game.load.image('loading-background', 'img/loading-background.png');
      this.game.load.image('loading-progress', 'img/loading-progress.png');
    }
  }, {
    key: 'create',
    value: function create() {
      this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.scale.pageAlignHorizontally = true;
      this.game.scale.pageAlignVertically = true;
      this.game.state.start('Preloader');
    }
  }]);

  return Boot;
}(Phaser.State);

exports.default = Boot;

},{"../constants/UIConstants":3}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _UIconstants = require('../constants/UIconstants');

var _AudioManager = require('../utils/AudioManager');

var _Text = require('../UI/Text');

var _Text2 = _interopRequireDefault(_Text);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Wiki = function (_Phaser$State) {
  _inherits(Wiki, _Phaser$State);

  function Wiki() {
    _classCallCheck(this, Wiki);

    return _possibleConstructorReturn(this, (Wiki.__proto__ || Object.getPrototypeOf(Wiki)).apply(this, arguments));
  }

  _createClass(Wiki, [{
    key: 'create',
    value: function create() {
      this.camera.resetFX();
      this.camera.flash(0x000000, 500, false);

      var textGroup = this.game.add.group();

      var creditsTitle = new _Text2.default(this.game, 'center', 0, 'Credits:', _UIconstants.CREDITS_TITLE_FONT);
      var creditsText = new _Text2.default(this.game, 'center', 0, 'Bartek „bibixx” Legięć\nKacper Pietrzak', _UIconstants.CREDITS_FONT);
      var creditsTextSound = new _Text2.default(this.game, 'center', 0, '\nSounds\n„Farty McSty”\nby Eric Matyas\nwww.soundimage.org\n\n„Click2 Sound”\nby Sebastian\nwww.soundbible.com', _UIconstants.CREDITS_FONT_SOUNDS);

      var heightSum = creditsTitle.height + creditsText.height + creditsTextSound.height;
      var heightDelta = (this.game.height - heightSum) / 2;

      creditsTitle.y += heightDelta;
      creditsText.y += creditsTitle.height + creditsTitle.y;
      creditsTextSound.y += creditsText.y + creditsText.height;

      textGroup.add(creditsText);
      textGroup.add(creditsTextSound);

      textGroup.x = 0;

      var buttonMainMenu = this.add.button(this.world.width - 20, this.world.height - 20, 'button-mainmenu', this.clickBack, this, 1, 0, 2);
      buttonMainMenu.anchor.set(1);

      buttonMainMenu.x = this.world.width + buttonMainMenu.width + _UIconstants.BUTTON_PADDING;
      this.add.tween(buttonMainMenu).to({ x: this.world.width - _UIconstants.BUTTON_PADDING }, 500, Phaser.Easing.Exponential.Out, true);
    }
  }, {
    key: 'clickBack',
    value: function clickBack() {
      var _this2 = this;

      (0, _AudioManager.playAudio)('click');
      this.camera.fade(0x000000, 200, false);
      this.time.events.add(200, function () {
        _this2.game.state.start('MainMenu');
      });
    }
  }]);

  return Wiki;
}(Phaser.State);

exports.default = Wiki;

},{"../UI/Text":2,"../constants/UIconstants":4,"../utils/AudioManager":13}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _GameUI = require('../UI/GameUI');

var _GameUI2 = _interopRequireDefault(_GameUI);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Game = function (_Phaser$State) {
  _inherits(Game, _Phaser$State);

  function Game() {
    _classCallCheck(this, Game);

    return _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).apply(this, arguments));
  }

  _createClass(Game, [{
    key: 'create',
    value: function create() {
      var _this2 = this;

      this.gameUI = new _GameUI2.default(this);

      this.camera.resetFX();
      this.camera.flash(0x000000, 500, false);

      this.game.onResume.add(function () {
        if (_this2.gameUI.stateStatus !== 'playing') {
          _this2.game.time.events.pause();
        }
      });

      this.createGame();
    }
  }, {
    key: 'createGame',
    value: function createGame() {
      this.heads = this.game.add.group();
      this.heads.enableBody = true;
      this.heads.physicsBodyType = Phaser.Physics.ARCADE;

      var width = 300;
      var height = 100;
      var bmd = this.game.add.bitmapData(width, height);

      bmd.ctx.beginPath();
      bmd.ctx.rect(0, 0, width, height);
      bmd.ctx.lineWidth = 6;
      bmd.ctx.strokeStyle = '#1c1c1c';
      bmd.ctx.fillStyle = '#373737';
      bmd.ctx.fill();
      bmd.ctx.stroke();

      this.player = this.game.add.sprite(this.game.world.centerX, this.game.height, bmd);
      this.player.anchor.setTo(0.5, 0.5);
      this.game.physics.arcade.enable(this.player);
      this.player.body.moves = false;
      this.player.body.immovable = true;

      this.interval = 1;

      this.game.time.events.add(Phaser.Timer.SECOND, this.spawnHead, this);
    }
  }, {
    key: 'handleCollision',
    value: function handleCollision() {
      this.gameUI.stateGameover();
    }
  }, {
    key: 'spawnHead',
    value: function spawnHead() {
      var head = this.heads.create(0, 0, 'head');
      head.x = this.game.rnd.integerInRange(head.width, this.game.width);
      head.anchor.set(1, 1);
      head.immovable = true;
      head.body.velocity.y = 300;

      this.interval *= 1.005;

      this.game.time.events.add(Phaser.Timer.SECOND * (1 / this.interval), this.spawnHead, this);
    }
  }, {
    key: 'stopHeads',
    value: function stopHeads() {
      this.heads.forEach(function (head) {
        head.savedVY = head.body.velocity.y;
        head.body.velocity.y = 0;
      });
    }
  }, {
    key: 'startHeads',
    value: function startHeads() {
      this.heads.forEach(function (head) {
        head.body.velocity.y = head.savedVY;
      });
    }
  }, {
    key: 'update',
    value: function update() {
      this.gameUI.updateUI();

      if (this.gameUI.stateStatus === 'playing') {
        this.game.physics.arcade.collide(this.player, this.heads, this.handleCollision, null, this);
        this.player.x = this.game.input.x;
        this.player.y = this.game.input.y;
      }
    }
  }]);

  return Game;
}(Phaser.State);

exports.default = Game;

},{"../UI/GameUI":1}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _AudioManager = require('../utils/AudioManager');

var _StorageManager = require('../utils/StorageManager');

var _Text = require('../UI/Text');

var _Text2 = _interopRequireDefault(_Text);

var _UIConstants = require('../constants/UIConstants');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var MainMenu = function (_Phaser$State) {
  _inherits(MainMenu, _Phaser$State);

  function MainMenu() {
    _classCallCheck(this, MainMenu);

    return _possibleConstructorReturn(this, (MainMenu.__proto__ || Object.getPrototypeOf(MainMenu)).apply(this, arguments));
  }

  _createClass(MainMenu, [{
    key: 'create',
    value: function create() {
      var title = this.add.sprite(this.world.width * 0.5, (this.world.height - 100) * 0.5, 'title');
      title.anchor.set(0.5);

      (0, _StorageManager.setStorage)(this.game.plugins.add(Phaser.Plugin.Storage));

      _StorageManager.PPTStorage.initUnset('PPT-highscore', 0);
      var highscore = _StorageManager.PPTStorage.get('PPT-highscore') || 0;

      var buttonPiGames = this.add.button(_UIConstants.BUTTON_PADDING, _UIConstants.BUTTON_PADDING, 'logo-pigames', this.clickPiGames, this);
      var buttonStart = this.add.button(this.world.width - _UIConstants.BUTTON_PADDING, this.world.height - _UIConstants.BUTTON_PADDING, 'button-start', this.clickStart, this, 1, 0, 2);
      buttonStart.anchor.set(1);

      this.buttonAudio = this.add.button(this.world.width - _UIConstants.BUTTON_PADDING, _UIConstants.BUTTON_PADDING, 'button-audio', this.clickAudio, this, 1, 0, 2);
      this.buttonAudio.anchor.set(1, 0);

      var buttonCredits = this.add.button(_UIConstants.BUTTON_PADDING, this.world.height - _UIConstants.BUTTON_PADDING, 'button-credits', this.clickCredits, this, 1, 0, 2);
      buttonCredits.anchor.set(0, 1);

      var highscoreText = new _Text2.default(this.game, 'center', this.world.height - 50, 'Highscore: ' + highscore, _UIConstants.MENU_HIGHSCORE_FONT, [null, 1]);
      highscoreText.padding.set(0, 15);

      (0, _AudioManager.manageAudio)('init', this);

      if ((0, _AudioManager.getStatusAudio)() !== true) {
        // Turn the music off at the start:
        (0, _AudioManager.manageAudio)('off', this);
      }

      buttonStart.x = this.world.width + buttonStart.width + _UIConstants.BUTTON_PADDING;
      this.add.tween(buttonStart).to({ x: this.world.width - _UIConstants.BUTTON_PADDING }, 500, Phaser.Easing.Exponential.Out, true);
      this.buttonAudio.y = -this.buttonAudio.height - _UIConstants.BUTTON_PADDING;
      this.add.tween(this.buttonAudio).to({ y: _UIConstants.BUTTON_PADDING }, 500, Phaser.Easing.Exponential.Out, true);
      buttonPiGames.x = -buttonPiGames.width - _UIConstants.BUTTON_PADDING;
      this.add.tween(buttonPiGames).to({ x: _UIConstants.BUTTON_PADDING }, 500, Phaser.Easing.Exponential.Out, true);
      buttonCredits.y = this.world.height + buttonCredits.height + _UIConstants.BUTTON_PADDING;
      this.add.tween(buttonCredits).to({ y: this.world.height - _UIConstants.BUTTON_PADDING }, 500, Phaser.Easing.Exponential.Out, true);

      this.camera.flash(0x000000, 500, false);
    }
  }, {
    key: 'clickAudio',
    value: function clickAudio() {
      (0, _AudioManager.playAudio)('click');
      (0, _AudioManager.manageAudio)('switch', this);
    }
  }, {
    key: 'clickPiGames',
    value: function clickPiGames() {
      (0, _AudioManager.playAudio)('click');
      window.open('http://pigam.es/', '_blank');
    }
  }, {
    key: 'clickStart',
    value: function clickStart() {
      var _this2 = this;

      (0, _AudioManager.playAudio)('click');
      this.camera.fade(0x000000, 200, false);
      this.time.events.add(200, function () {
        _this2.game.state.start('Story');
        // this.game.state.start( 'Game' );
      });
    }
  }, {
    key: 'clickCredits',
    value: function clickCredits() {
      var _this3 = this;

      (0, _AudioManager.playAudio)('click');
      this.camera.fade(0x000000, 200, false);
      this.time.events.add(200, function () {
        _this3.game.state.start('Credits');
      });
    }
  }]);

  return MainMenu;
}(Phaser.State);

exports.default = MainMenu;

},{"../UI/Text":2,"../constants/UIConstants":3,"../utils/AudioManager":13,"../utils/StorageManager":14}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var resources = {
  'image': [['background', 'img/background.png'], ['title', 'img/title.png'], ['head', 'img/head.png'], ['logo-pigames', 'img/logo-pigames.png'], ['overlay', 'img/ui/overlay.png'], ['nutrition-bar-background', 'img/ui/nutrition-bar-background.png']],
  'spritesheet': [['button-start', 'img/ui/button-start.png', 160, 160], ['button-continue', 'img/ui/button-start.png', 160, 160], ['button-mainmenu', 'img/ui/button-mainmenu.png', 160, 160], ['button-restart', 'img/ui/button-tryagain.png', 160, 160], ['button-credits', 'img/ui/button-credits.png', 160, 160], ['button-pause', 'img/ui/button-pause.png', 160, 160], ['button-audio', 'img/ui/button-sound.png', 160, 160], ['button-back', 'img/button-back.png', 70, 70], ['button-next', 'img/button-next.png', 70, 70], ['bob', 'img/assets/bob.png', 460, 1370], ['nutrition-bar', 'img/ui/nutrition-bar.png', 680, 56], ['products', 'img/assets/products-en.png', 200, 150]],
  'audio': [['audio-click', ['sfx/click.mp3', 'sfx/click.ogg']], ['audio-theme', ['sfx/farty-mcsty.m4a', 'sfx/farty-mcsty.mp3', 'sfx/farty-mcsty.ogg']]]
};

var Preloader = function (_Phaser$State) {
  _inherits(Preloader, _Phaser$State);

  function Preloader() {
    _classCallCheck(this, Preloader);

    return _possibleConstructorReturn(this, (Preloader.__proto__ || Object.getPrototypeOf(Preloader)).apply(this, arguments));
  }

  _createClass(Preloader, [{
    key: 'preload',
    value: function preload() {
      this.add.sprite((this.world.width - 580) * 0.5, (this.world.height + 150) * 0.5, 'loading-background');
      var preloadProgress = this.add.sprite((this.world.width - 540) * 0.5, (this.world.height + 170) * 0.5, 'loading-progress');
      this.load.setPreloadSprite(preloadProgress);

      this._preloadResources();
    }
  }, {
    key: '_preloadResources',
    value: function _preloadResources() {
      var _this2 = this;

      this.span = document.createElement('span');
      this.span.innerHTML = 'Zażółć';
      this.span.setAttribute('style', 'position: absolute; font-family: Arial,  monospace; font-size: 300px; top: -99999px; left: -99999px; opacity: 0;');
      document.body.appendChild(this.span);
      this.initialFontSize = this.span.clientHeight;
      this.span.style.fontFamily = '"Bromine"';

      var _loop = function _loop(method) {
        resources[method].forEach(function (args) {
          var loader = _this2.load[method];
          loader && loader.apply(_this2.load, args);
        }, _this2);
      };

      for (var method in resources) {
        _loop(method);
      }
    }
  }, {
    key: 'update',
    value: function update() {
      if (this.initialFontSize !== this.span.clientHeight) {
        document.body.removeChild(this.span);
        this.state.start('MainMenu');
        // this.state.start( 'Game' );
      }
    }
  }]);

  return Preloader;
}(Phaser.State);

exports.default = Preloader;

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _AudioManager = require('../utils/AudioManager');

var _Text = require('../UI/Text');

var _Text2 = _interopRequireDefault(_Text);

var _UIConstants = require('../constants/UIConstants');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Story = function (_Phaser$State) {
  _inherits(Story, _Phaser$State);

  function Story() {
    _classCallCheck(this, Story);

    return _possibleConstructorReturn(this, (Story.__proto__ || Object.getPrototypeOf(Story)).apply(this, arguments));
  }

  _createClass(Story, [{
    key: 'create',
    value: function create() {

      new _Text2.default(this.game, 'center', 'center', 'Avoid heads to stay alive.', _UIConstants.STORY_FONT);

      var buttonContinue = this.add.button(this.world.width - 20, this.game.world.height - 20, 'button-continue', this.clickContinue, this, 1, 0, 2);

      buttonContinue.anchor.set(1, 1);
      buttonContinue.x = this.world.width + buttonContinue.width + 20;

      this.add.tween(buttonContinue).to({ x: this.world.width - 20 }, 500, Phaser.Easing.Exponential.Out, true);

      this.camera.flash(0x000000, 500, false);
    }
  }, {
    key: 'clickContinue',
    value: function clickContinue() {
      var _this2 = this;

      (0, _AudioManager.playAudio)('click');
      this.camera.fade(0x000000, 200, false);
      this.camera.onFadeComplete.add(function () {
        _this2.game.state.start('Game');
      }, this);
    }
  }]);

  return Story;
}(Phaser.State);

exports.default = Story;

},{"../UI/Text":2,"../constants/UIConstants":3,"../utils/AudioManager":13}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Credits = require('./Credits');

var _Credits2 = _interopRequireDefault(_Credits);

var _Boot = require('./Boot');

var _Boot2 = _interopRequireDefault(_Boot);

var _Game = require('./Game');

var _Game2 = _interopRequireDefault(_Game);

var _MainMenu = require('./MainMenu');

var _MainMenu2 = _interopRequireDefault(_MainMenu);

var _Preloader = require('./Preloader');

var _Preloader2 = _interopRequireDefault(_Preloader);

var _Story = require('./Story');

var _Story2 = _interopRequireDefault(_Story);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = {
  Credits: _Credits2.default, Boot: _Boot2.default, Game: _Game2.default, MainMenu: _MainMenu2.default, Preloader: _Preloader2.default, Story: _Story2.default
};

},{"./Boot":6,"./Credits":7,"./Game":8,"./MainMenu":9,"./Preloader":10,"./Story":11}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAudioOffset = undefined;
exports.manageAudio = manageAudio;
exports.playAudio = playAudio;
exports.getStatusAudio = getStatusAudio;

var _StorageManager = require('./StorageManager');

var _audioStatus = void 0;
var _sound = void 0;
var _soundMusic = void 0;
var _audioOffset = void 0;

function manageAudio(mode, game) {
  switch (mode) {
    case 'init':
      {
        _StorageManager.PPTStorage.initUnset('PPT-audio', true);
        _audioStatus = _StorageManager.PPTStorage.get('PPT-audio');
        // PPT._soundClick = game.add.audio('audio-click');
        _sound = [];
        _sound['click'] = game.add.audio('audio-click');
        if (!_soundMusic) {
          _soundMusic = game.add.audio('audio-theme', 1, true);
          _soundMusic.volume = 0.5;
        }
        break;
      }
    case 'on':
      {
        _audioStatus = true;
        break;
      }
    case 'off':
      {
        _audioStatus = false;
        break;
      }
    case 'switch':
      {
        _audioStatus = !_audioStatus;
        break;
      }
  }
  if (_audioStatus) {
    _audioOffset = 0;
    if (_soundMusic) {
      if (!_soundMusic.isPlaying) {
        _soundMusic.play('', 0, 1, true);
      }
    }
  } else {
    _audioOffset = 4;
    if (_soundMusic) {
      _soundMusic.stop();
    }
  }
  _StorageManager.PPTStorage.set('PPT-audio', _audioStatus);
  game.buttonAudio.setFrames(_audioOffset + 1, _audioOffset + 0, _audioOffset + 2);
}
function playAudio(sound) {
  if (_audioStatus) {
    if (_sound && _sound[sound]) {
      _sound[sound].play();
    }
  }
}

function getStatusAudio() {
  return _audioStatus;
}

var getAudioOffset = exports.getAudioOffset = function getAudioOffset() {
  return _audioOffset;
};

},{"./StorageManager":14}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setStorage = setStorage;
var PPTStorage = exports.PPTStorage = void 0;

function setStorage(storage) {
  exports.PPTStorage = PPTStorage = storage;
}

},{}]},{},[5])
//# sourceMappingURL=game.js.map
