let config = {
    type: Phaser.AUTO,
    gameSpeed: 1,
    width: 1280,
    height: 800,
    scene: [ Game ], // put the name of the game scenes here
    keybinds: {
        keyW: null,
        keyA: null,
        keyS: null,
        keyD: null,
        keySpacebar: null,
        keyR: null
    },
}

let globalVars = {
    playerPositionX: 0,
    playerPositionY: 0,
    gameDelta: 0
}

let game = new Phaser.Game(config);
