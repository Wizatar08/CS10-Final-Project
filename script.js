/*
NOTE: All levels were play tested and are possible :)
*/

// Configure the game
const config = {
    type: Phaser.AUTO,
    x: 400,
    width: 1024,
    height: 800,
    backgroundColor: '#f9f9f9',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 400
            },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Initialize overall program variables
const game = new Phaser.Game(config);
var currState;
var keyDown;
var SCENE;
const FPS = 60;
var builtMap = false;

// Create game variables
var levelNumber;
var TILE_LENGTH = 64, GRAVITY_TILE_SCALE = 0.48;
var staticTiles, detectAndFallTiles, redDetectTiles, redScaffoldingTiles, gravityTiles, dangerTiles, availableCannonTiles;
var balls, stars;
var cannonDisplay, cannonAngle = 0, cannonGunTex, cannonX = 0, cannonY = 0;
var redHit = false;
var starsCollected = 0, starsNeeded, starText;
var currentBallText;
var currentBall = "3 Bounce Ball (-1P)";
var ballPoints, ballPointsText;
// The amount of points each level grants.
var ballPointsArray = [20, 15, 20, 20, 18, 15, 13, 15, 80, 35];
var bottomGameText;

// Ball information staorage
var bounces = [];
var time = [];
var ballArray = [];

// Star variables. In each slot in the array is another array. The first slot is the x coordinate and the second slot is the y coordinate.
var lvl1Stars = [[576, 320], [420, 480]];
var lvl2Stars = [[544, 640], [704, 256]];
var lvl3Stars = [[576, 128], [950, 224], [960, 512]];
var lvl4Stars = [[224, 96], [608, 48]];
var lvl5Stars = [[288, 576], [192, 128], [736, 96]];
var lvl6Stars = [[384, 128], [928, 144], [704, 704]];
var lvl7Stars = [[160, 128], [320, 160], [544, 320], [800, 256]];
var lvl8Stars = [[896, 128], [736, 736]];
var lvl9Stars = [[608, 160], [800, 352], [352, 224], [608, 352]];
var lvl10Stars = [[160, 736], [224, 160], [672, 480], [672, 672], [960, 256]];

// Put the star information in an array so it can be referenced easily.
var starsArray = [lvl1Stars, lvl2Stars, lvl3Stars, lvl4Stars, lvl5Stars, lvl6Stars, lvl7Stars, lvl8Stars, lvl9Stars, lvl10Stars];

// Main menu display variables
var menuObjects, mainMenuTitleText, backgroundTween, backgroundRectangle
var menuSelectText;
var currLvlText, prevLvlT, twoPrevLvlT, nextLvlT, twoNextLvlT;

// These two-dimensional arrays are the maps for the levels. Each number on the arrays determine what tile goes there. 0 means nothing goes there
var lvl1 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]
// 
var lvl2 = [
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 3, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0]
]
var lvl3 = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]
var lvl4 = [
  [1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0],
  [1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0],
  [1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
  [1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0],
  [1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0],
  [1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0],
  [1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0]
]
var lvl5 = [
  [0, 0, 0, 0, 0, 1, 6, 6, 6, 1, 0, 0, 0, 6, 1, 1],
  [0, 0, 0, 0, 0, 1, 6, 6, 6, 1, 0, 0, 0, 6, 1, 1],
  [0, 0, 0, 0, 0, 1, 6, 6, 6, 1, 0, 0, 0, 6, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 6, 1, 1],
  [1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 6, 1, 1],
  [1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0]
]
var lvl6 = [
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6],
  [1, 1, 1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 6, 6, 6, 6],
  [1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 6, 6, 6, 6],
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]
var lvl7 = [
  [0, 1, 6, 1, 6, 6, 1, 6, 6, 6, 1, 6, 6, 6, 1, 0],
  [0, 1, 0, 1, 0, 0, 1, 6, 6, 6, 1, 6, 6, 6, 1, 0],
  [0, 1, 0, 1, 0, 0, 1, 6, 6, 6, 1, 0, 0, 0, 1, 0],
  [0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0],
  [0, 1, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0]
]
var lvl8 = [
  [1, 6, 6, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
  [1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 4, 4, 1],
  [1, 1, 0, 0, 0, 0, 1, 5, 1, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 7, 0, 0, 0, 0],
  [1, 6, 0, 0, 7, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
  [1, 6, 6, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0]
]
var lvl9 = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 7, 0, 0, 0, 0, 7, 0, 0, 0, 1, 0, 0, 2, 5],
  [1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 2, 1],
  [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 7, 0, 1, 0, 1],
  [1, 0, 7, 1, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 7, 0, 0, 0, 1, 4, 1, 4, 1, 1, 0, 1],
  [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 7, 1, 0, 0, 0, 0, 7, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 6, 6, 6, 6, 1, 0, 1, 0, 7, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 7, 0, 0, 3, 0, 0, 0, 0, 7, 0, 0, 0, 0, 7, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]
var lvl10 = [
  [6, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 3, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 1, 1, 2, 1, 0, 0],
  [0, 4, 4, 6, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0],
  [7, 0, 0, 6, 0, 0, 1, 0, 0, 6, 6, 6, 0, 7, 0, 0],
  [1, 0, 0, 6, 0, 0, 7, 0, 0, 0, 2, 0, 0, 1, 0, 0],
  [0, 0, 0, 6, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 6, 5],
  [0, 0, 0, 6, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 1, 1, 1],
  [0, 0, 0, 7, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [0, 0, 0, 1, 6, 6, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1]
]

// Put all the maps inside another array so they can be referenced easily.
var maps = [lvl1, lvl2, lvl3, lvl4, lvl5, lvl6, lvl7, lvl8, lvl9, lvl10];

// An easy way to determine the amount of levels that are in the game without hardcoding it.
var MAX_LEVELS = maps.length;

/**
 * Load all needed assets
 */
function preload() {
    // This is so all the scene information can be accessed anywhere.
    SCENE = this;

    // Load the background
    SCENE.load.image('background', 'assets/images/background.png');

    // Load the game objects
    SCENE.load.image('stone_tile', 'assets/images/tiles/stone_tile.png');
    SCENE.load.image('scaffolding', 'assets/images/tiles/scaffolding.png');
    SCENE.load.image('red_scaffolding', 'assets/images/tiles/red_scaffolding.png');
    SCENE.load.image('red_sensor', 'assets/images/tiles/red_sensor.png');
    SCENE.load.image('danger_tile', 'assets/images/tiles/danger_tile.png')
    SCENE.load.image('cannon_base', 'assets/images/cannon/base.png');
    SCENE.load.image('cannon_gun', 'assets/images/cannon/gun.png');

    // Load the balls
    SCENE.load.image('red_ball', 'assets/images/balls/ball.png');
    SCENE.load.image('blue_ball', 'assets/images/balls/blue_ball.png');

    // Load stars
    SCENE.load.image('star', 'assets/images/star.png');
}

/**
 * Add everything onto the screen
 */
function create() {
    // Init WASD keys
    SCENE.w = SCENE.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    SCENE.a = SCENE.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    SCENE.s = SCENE.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    SCENE.d = SCENE.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    // Init SPACE/ENTER keys
    SCENE.enter = SCENE.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    SCENE.space = SCENE.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Create tile groups
    staticTiles = SCENE.physics.add.staticGroup();
    detectAndFallTiles = SCENE.physics.add.staticGroup();
    gravityTiles = SCENE.physics.add.group();
    dangerTiles = SCENE.physics.add.staticGroup();
    availableCannonTiles = SCENE.physics.add.staticGroup();
    redDetectTiles = SCENE.physics.add.staticGroup();
    redScaffoldingTiles = SCENE.physics.add.staticGroup();

    // Create other game groups
    balls = SCENE.physics.add.group();
    cannonDisplay = SCENE.physics.add.staticGroup();
    stars = SCENE.physics.add.staticGroup();

    // Give all balls a bounce
    balls.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    
    // Set level numnber to 0
    levelNumber = 0;
    // Set game state to MENU
    currState = 'MENU';

    // Add background image
    let bgImage = SCENE.add.image(config.width / 2, config.height / 2, 'background');
    bgImage.setScale(config.height / bgImage.height)

    // Create background rectangle
    backgroundRectangle = SCENE.add.rectangle(config.width / 2, config.height / 2, 700, 300, 0x00ff00)
    backgroundTween = SCENE.tweens.add({
        targets: backgroundRectangle,
        alpha: 0.4,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });

    // Create main manu text
    mainMenuTitleText = SCENE.add.text(265, 262, 'Ball Shooter Game', {
      fontSize: '85px',
      fontFamily: 'OdibeeSans',
      fill: '#D00',
      bold: true,
      align: 'center',
      fixedWidth: 1400
    })

    // Create number text on level selection box
    currLvlText = SCENE.add.text(490, 400, '', {
      fontSize: '85px',
      fontFamily: 'OdibeeSans',
      fill: '#E58A0B'
    })
    nextLvlT = SCENE.add.text(550, 412, '', {
      fontSize: '50px',
      fontFamily: 'OdibeeSans',
      fill: '#A8A80B'
    })
    twoNextLvlT = SCENE.add.text(600, 412, '', {
      fontSize: '50px',
      fontFamily: 'OdibeeSans',
      fill: '#A8A80B'
    })
    prevLvlT = SCENE.add.text(430, 412, '', {
      fontSize: '50px',
      fontFamily: 'OdibeeSans',
      fill: '#A8A80B'
    })
    twoPrevLvlT = SCENE.add.text(380, 412, '', {
      fontSize: '50px',
      fontFamily: 'OdibeeSans',
      fill: '#A8A80B'
    })

    // Add the directions
    menuSelectText = SCENE.add.text(270, 500, 'Press SPACE to play! Use left and right arrow keys to select level', {
      fontSize: '24px',
      fontFamily: 'OdibeeSans',
      fill: '#5555FF'
    })

    // Add the colliders to all the game objects.
    SCENE.physics.add.collider(staticTiles, balls, collideWithWall, null, true);
    SCENE.physics.add.collider(redDetectTiles, balls, hitRedDetectTile, null, this);
    SCENE.physics.add.collider(redScaffoldingTiles, balls);
    SCENE.physics.add.collider(dangerTiles, balls, hitDangerTile, null, this);
    SCENE.physics.add.collider(availableCannonTiles, balls, setNewCannon, null, this);

    SCENE.physics.add.collider(gravityTiles, staticTiles, detectIfClipThrough, null, this);
    SCENE.physics.add.collider(gravityTiles, detectAndFallTiles, detectIfClipThroughDAndFall, null, this);
    SCENE.physics.add.collider(availableCannonTiles, gravityTiles)
    SCENE.physics.add.collider(gravityTiles, balls);
    SCENE.physics.add.collider(gravityTiles, gravityTiles);
    SCENE.physics.add.collider(balls, balls);
    SCENE.physics.add.collider(balls, detectAndFallTiles, hitGravityDetectTile, null, this);
    SCENE.physics.add.collider(balls, stars, hitStar, null, true);

    // Put all menu objects into an array so it can be referenced easily later when building the map.
    menuObjects = [backgroundRectangle, mainMenuTitleText, currLvlText, nextLvlT, twoNextLvlT, prevLvlT, twoPrevLvlT, menuSelectText];
    updateMenuLevelText(1);
}

/**
 * Constant update
 */
function update() {
  let cursors = SCENE.input.keyboard.createCursorKeys();

  /*
  CONSTANT UPDATE WHEN THE CURRENT STATE IS 'MENU'
  */
  if (currState == 'MENU') {
    // Left/A and Right/D detection: WHen pressed, change the current selected level
    if ((cursors.left.isDown || SCENE.a.isDown)) {
      if (!keyDown) {
        updateMenuLevelText(-1);
      }
      keyDown = true;
    } else if ((cursors.right.isDown || SCENE.d.isDown)) {
      if (!keyDown) {
        updateMenuLevelText(1);
      }
      keyDown = true;
    // When SPACE is pressed, begin the game.
    } else if (SCENE.space.isDown) {
      if (!keyDown) {
        transitionMenuToGame();
      }
      keyDown = true;
    } else {
      keyDown = false;
    }
  
  /*
  CONSTANT UPDATE WHEN THE CURRENT STATE IS 'GAME'
  */
  } else if (currState == 'GAME') {
    // Detect if you have no ball points and there are no balls in the scene.
    if (ballPoints <= 0 && ballArray.length <= 0) {
      // Say that you have to restart
      bottomGameText = SCENE.add.text(20, 700, 'You are out of points. Press SPACE to restart.', {
        fontSize: '72px',
        fontFamily: 'OdibeeSans',
        fill: '#EA3A06'
      })
    }

    // If space is pressed
    if (SCENE.space.isDown) {
      if (!keyDown) {
        // If you have points available, make a new ball
        if (ballPoints > 0) {
          let tex = "";
          let requiredPoints;

          // Set the texture
          if (currentBall == '3 Bounce Ball (-1P)') {
            tex = 'red_ball';
            requiredPoints = 1;
          } else if (currentBall == '3 Second Ball (-3P)') {
            tex = 'blue_ball';
            requiredPoints = 3;
          }
          if (ballPoints >= requiredPoints) {
            let ball = balls.create(cannonX, cannonY - 9, tex);
            ball.onCollide = true;
            ball.setBounce(1);
            ball.setVelocity(1000 * Math.sin(cannonAngle), -1000 * Math.cos(cannonAngle));

            // Add to the ball arrays to keep track of its information
            ballArray.push(ball);
            currentBall == '3 Bounce Ball (-1P)' ? bounces.push(0) : bounces.push(-1);
            currentBall == '3 Second Ball (-3P)' ? time.push(0) : time.push(-1);

            // Subtract the points accordingly
            ballPoints -= requiredPoints;
          }
        // if you do not have points available AND there are no balls on the scene
        } else if (ballArray.length <= 0 && ballPoints <= 0) {
          // Reload the page so you are brought back to the main menu
          location.reload();
        }
      }
      keyDown = true;
    } else if (SCENE.enter.isDown) {
      // If ENTER is pressed
      if (!keyDown) {
        // Change the current ball - 3 bounce changes to 3 second and 3 second changed to 3 bounce
        if (currentBall == "3 Bounce Ball (-1P)") {
          currentBall = "3 Second Ball (-3P)";
        } else if (currentBall == "3 Second Ball (-3P)") {
          currentBall = "3 Bounce Ball (-1P)";
        }
      }
      keyDown = true;
    
    // Change the angle of the cannon
    } else if (cursors.left.isDown || SCENE.a.isDown) {
      if (cannonAngle > -Math.PI / 2) {
        cannonAngle -= convertToRadians(1);
      }
    } else if (cursors.right.isDown || SCENE.d.isDown) {
      if (cannonAngle < Math.PI / 2) {
        cannonAngle += convertToRadians(1);
      }
    } else {
      keyDown = false;
    }

    // WHen cannonGunTex becomes defined after the transition from menu to game, set the rotation
    if (cannonGunTex != undefined) cannonGunTex.rotation = cannonAngle;
    // Once starText becomes defined, set the text to display the amount of stars collected.
    if (starText != undefined) starText.text = 'Stars collected: ' + starsCollected + "/" + starsNeeded;
    // Once currentBallText becomes defined, display the currently selected ball.
    if (currentBallText != undefined) currentBallText.text = 'Current Ball: ' + currentBall;
    // Once ballPointsText becomes defined, display the amount of points you have left.
    if (ballPointsText != undefined) ballPointsText.text = 'Points: ' + ballPoints;

    // Set all gravity abiding tiles to not move on the X axis (unless it is hit by a ball)
    gravityTiles.children.iterate(function (tile) {
      tile.setVelocityX(0);
    })

    // Loop through all the balls. If it is a time abiding ball (time[i] != -1), update the time. Once it reaches 0, delete the ball.
    for (let i = 0; i < time.length; i++) {
      if (time[i] >= 0) {
        time[i]++;
        if (time[i] > 3 * FPS) {
          deleteBall(i);
        }
      }
    }

    // If a ball goes off the map, delete it.
    for (let i = 0; i < ballArray.length; i++) {
      let b = ballArray[i];
      if (b.x < -64 || b.x > 1086 || b.y < -64 || b.y > 864) {
        deleteBall(i);
      }
    }
  }
}

// The function that handles the transition between the menu and the game.
function transitionMenuToGame() {
  // Stop the tween of the background
  backgroundTween.stop();
  // Set the state to 'GAME'
  currState = "GAME";

  // Loop through each menu object and make them fade away
  for (let i = 0; i < menuObjects.length; i++) {
    let menuBgFadeTween = SCENE.tweens.add({
      targets: menuObjects[i],
      alpha: 0,
      yoyo: false,
      repeat: 0,
      ease: 'Sine.easeInOut',
      onComplete: function() {
        // Once all the menu objects are transparent, build the map and set the correct information
        buildLevel(levelNumber);
      }
    })
  }
}

// Create the map and set the appropriate variables
function buildLevel(level) {
  // Since this loops through multiple times due to the menu objects all calling this once transparent, we have to find a way to mae this run only once.
  if (!builtMap) {
    // Get the correct map
    let map = maps[level - 1];

    // Loop through all the individual components of the map
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        // Get the number
        let tileId = map[y][x];
        let textureName = "";
        let tileType = "none";

        // Set the specific tile based on what the tile ID is
        switch (tileId) {
          case 1:
            textureName = 'stone_tile'; break;
          case 2:
            textureName = 'scaffolding'; tileType = "detect"; break;
          case 3:
            cannonX = x * TILE_LENGTH + (TILE_LENGTH / 2);
            cannonY = y * TILE_LENGTH + (TILE_LENGTH / 2);
            break;
          case 4:
            textureName = 'red_scaffolding'; tileType = "redScaffolding"; break;
          case 5:
            textureName = 'red_sensor'; tileType = "redDetect"; break;
          case 6:
            textureName = 'danger_tile'; tileType = 'danger'; break;
          case 7:
            textureName = 'cannon_base'; tileType = 'newCannon'; break;
        }
        // Add these to the appropriate group based on the tile type
        if (textureName != '') {
          if (tileType == "none") {
            staticTiles.create(x * TILE_LENGTH + (TILE_LENGTH / 2), y * TILE_LENGTH + (TILE_LENGTH / 2), textureName).setScale(0.5).refreshBody();
          } else if (tileType == "detect") {
            detectAndFallTiles.create(x * TILE_LENGTH + (TILE_LENGTH / 2), y * TILE_LENGTH + (TILE_LENGTH / 2), textureName).setScale(GRAVITY_TILE_SCALE).refreshBody();
          } else if (tileType == "redScaffolding") {
            redScaffoldingTiles.create(x * TILE_LENGTH + (TILE_LENGTH / 2), y * TILE_LENGTH + (TILE_LENGTH / 2), textureName).setScale(GRAVITY_TILE_SCALE).refreshBody();
          } else if (tileType == "redDetect") {
            redDetectTiles.create(x * TILE_LENGTH + (TILE_LENGTH / 2), y * TILE_LENGTH + (TILE_LENGTH / 2), textureName).setScale(0.5).refreshBody();
          } else if (tileType == "danger") {
            dangerTiles.create(x * TILE_LENGTH + (TILE_LENGTH / 2), y * TILE_LENGTH + (TILE_LENGTH / 2), textureName).setScale(0.5).refreshBody();
          } else if (tileType == "newCannon") {
            availableCannonTiles.create(x * TILE_LENGTH + (TILE_LENGTH / 2), y * TILE_LENGTH + (TILE_LENGTH / 2), textureName);
          }
        }
      }
    }

    // Put the stars on the map
    let levelStars = starsArray[level - 1];
    for (let i = 0; i < levelStars.length; i++) {
      stars.create(levelStars[i][0], levelStars[i][1], 'star');
    }
    starsNeeded = levelStars.length;

    // Put the text on the map
    if (starText == undefined) {
      starText = SCENE.add.text(16, 16, '', {
        fontSize: '50px',
        fontFamily: 'OdibeeSans',
        fill: '#FFFFFF'
      })
    }
    if (currentBallText == undefined) {
      currentBallText = SCENE.add.text(16, 64, '', {
        fontSize: '32px',
        fontFamily: 'OdibeeSans',
        fill: '#FF6600'
      })
    }
    if (ballPointsText == undefined) {
      ballPointsText = SCENE.add.text(16, 104, '', {
        fontSize: '32px',
        fontFamily: 'OdibeeSans',
        fill: '#FF9922'
      })
    }

    // Set the current ball to be the 3 bounce ball
    currentBall = "3 Bounce Ball (-1P)";
    // Set the location of the cannon
    setCannon(cannonX, cannonY);
    // Set the level's ball points
    ballPoints = ballPointsArray[level - 1];

    // Make sure this function does not get run more than once at a time
    builtMap = true;
  }
}

// Put the cannon in the right area
function setCannon(x, y) {
  // Add it to the cannonTiles
  availableCannonTiles.create(x, y, 'cannon_base');
  // Draw the gun
  cannonGunTex = SCENE.add.image(x, y - 9, 'cannon_gun');
}

// When a ball hits a scaffolding
function hitGravityDetectTile(ball, tile) {
  // Move it to the gravity tiles so it can fall
  let gTile = gravityTiles.create(tile.x, tile.y, 'scaffolding').setScale(GRAVITY_TILE_SCALE);
  // Remove it from the detection group
  tile.disableBody(true, true);
  // Detect the ball bouncing on an object
  ballBounce(ball);
}

// If a dynamic tile and static tile touch, add it to a detection group and remove the dynamic tile
function detectIfClipThrough(dynamicTile, staticTile) {
  let gTile = detectAndFallTiles.create(dynamicTile.x, dynamicTile.y, 'scaffolding').setScale(GRAVITY_TILE_SCALE).refreshBody();
  dynamicTile.disableBody(true, true);
}

// Stop a dynamic tile from moving if it hits a static tile
function detectIfClipThroughDAndFall(dynamicTile, staticTile) {
  let gTile = detectAndFallTiles.create(dynamicTile.x, dynamicTile.y, 'scaffolding').setScale(GRAVITY_TILE_SCALE).refreshBody();
  dynamicTile.disableBody(true, true);
}

// If a ball hits a detection tile
function hitRedDetectTile(ball, tile) {
  // Detect if it has already been hit
  if (!redHit) {
    // Move all static scaffolding tiles to the detection scaffolding tile group
    redScaffoldingTiles.children.iterate(function (sTile) {
      let gTile = detectAndFallTiles.create(sTile.x, sTile.y, 'scaffolding').setScale(GRAVITY_TILE_SCALE);
      sTile.disableBody(true, true);
    })
    redHit = true;
  }
  // Detect the ball bouncing on an object
  ballBounce(ball);
}

function collideWithWall(tile, ball) {
  // Detect the ball bouncing on an object
  ballBounce(ball);
}

// When a ball bounces on an object, add it to its total amount of bounces. When it reaches 
function ballBounce(ball) {
  for (let i = 0; i < ballArray.length; i++) {
    if (ballArray[i] === ball && bounces[i] >= 0) {
      bounces[i]++;
      if (bounces[i] >= 3) {
        deleteBall(i);
      }
    }
  }
}

//Function run when the player hits a star
function hitStar(ball, star) {
  star.disableBody(true, true);
  starsCollected++;

  if (starsCollected >= starsNeeded) {
    completeLevel();
  }
}

/*
When a ball hits a danger tile, delete it
*/
function hitDangerTile(tile, ball) {
  deleteBall(getBallArrayIndex(ball));
}

/*
Place a cannon in a new spot
*/
function setNewCannon(tile, ball) {
  cannonGunTex.destroy();
  cannonGunTex = null;
  setCannon(tile.x, tile.y);
  cannonX = tile.x;
  cannonY = tile.y;
  ballBounce(ball);
}

/**
 * Updates the menu text (so I don't have to run the same code over again)
 */
function updateMenuLevelText(levelNum) {
  if (levelNumber + levelNum > 0 && levelNumber + levelNum <= MAX_LEVELS) {
    levelNumber += levelNum;
    currLvlText.text = levelNumber;
    if (levelNumber + 1 < MAX_LEVELS + 1) {
      nextLvlT.text = levelNumber + 1;
    } else {
    nextLvlT.text = '';
    }
    if (levelNumber + 2 < MAX_LEVELS + 1) {
      twoNextLvlT.text = levelNumber + 2;
    } else {
      twoNextLvlT.text = '';
    }
    if (levelNumber - 1 > 0) {
      prevLvlT.text = levelNumber - 1;
    } else {
      prevLvlT.text = "";
    }
    if (levelNumber - 2 > 0) {
      twoPrevLvlT.text = levelNumber - 2;
    } else {
      twoPrevLvlT.text = "";
    }
  }
}

// This will get the slot a ball is in in the array index
function getBallArrayIndex(ballObj) {
  for (let i = 0; i < ballArray.length; i++) {
    if (ballArray[i] === ballObj) {
      return i;
    }
  }
  return 0;
}

// Removes a ball from the game (also by removing all the info for that ball)
function deleteBall(ballInd) {
  try {
    time.splice(ballInd, 1);
    bounces.splice(ballInd, 1);
    ballArray[ballInd].disableBody(true, true);
    ballArray.splice(ballInd, 1);
  } catch (error) {}
}

/**
 * Function ran when the player completes the level (by collecting all the stars)
 */
function completeLevel() {
  emptyMap();
  levelNumber++;
  cannonGunTex.destroy();
  cannonGunTex = null;
  builtMap = false;
  starText.text = '';
  starText = undefined;
  currentBallText.text = '';
  currentBallText = undefined;
  ballPointsText.text = '';
  ballPointsText = undefined;
  redHit = false;
  if (levelNumber != 10) {
    buildLevel(levelNumber);
    starsCollected = 0;
  } else {
      bottomGameText = SCENE.add.text(20, 700, 'Congrats, you WON! Press SPACE to restart.', {
        fontSize: '72px',
        fontFamily: 'OdibeeSans',
        fill: '#EA3A06'
      })
  }
}

// Remove all objects from the map, including the text
function emptyMap() {
  staticTiles.children.iterate(function (tile) {
    tile.disableBody(true, true);
  })
  detectAndFallTiles.children.iterate(function (tile) {
    tile.disableBody(true, true);
  })
  redDetectTiles.children.iterate(function (tile) {
    tile.disableBody(true, true);
  })
  redScaffoldingTiles.children.iterate(function (tile) {
    tile.disableBody(true, true);
  })
  gravityTiles.children.iterate(function (tile) {
    tile.disableBody(true, true);
  })
  dangerTiles.children.iterate(function (tile) {
    tile.disableBody(true, true);
  })
  availableCannonTiles.children.iterate(function (tile) {
    tile.disableBody(true, true);
  })
  balls.children.iterate(function (ball) {
    deleteBall(getBallArrayIndex(ball));
  })
  cannonDisplay.children.iterate(function (cannon) {
    cannon.disableBody(true, true);
  })
}

/**
 * Converts a number in degrees to radians
 */
function convertToRadians(angleInDegrees) {
  return angleInDegrees * (Math.PI / 180);
}