class Menu extends Phaser.Scene {
    constructor() {
        super("sceneMenu");
    }

    preload() {
        this.load.image('title', './assets/Home screen with Play button.png');
    }

    create() {
        const self = this;
        let creditsTextConfig = {
            fontFamily: 'Courier',
            fontSize: '30px',
            backgroundColor: '#FFFF00',
            color: '#202020',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            // fixedWidth: 100
        }
        this.titleBackground = this.add.rectangle(0, 0, game.config.width, game.config.height, 0x1f9acf).setOrigin(0, 0);
        this.titleScreen = this.add.image(350, 0, 'title').setOrigin(0, 0);
        this.playButton = this.add.rectangle(560, 570, 280, 105, 0x808080).setOrigin(0, 0);
        this.playButton.alpha = 0.01;
        this.playButton.setInteractive();
        this.playButton.on('pointerdown', function(pointer) {
            self.scene.start('sceneGame');
        });
        this.creditsText = this.add.text(20, 20, 'CREDITS:\n\nBrannon Eakles\nCoding/Design\n\nSamuel Maturo\nDesign/Coding\n\nAdrian Phuong\nCoding/Design\n\nAnthony Huang\nArt/Design', creditsTextConfig).setOrigin(0, 0);
    }

    update(time, delta) {

    }
}