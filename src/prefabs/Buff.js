class Buff extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);

        this.type = 'null';
        this.duration = 0;

        this.savedPlayerPositionX = globalVars.playerPositionX;
        this.savedPlayerPositionY = globalVars.playerPositionY;
    }

    checkInRange() {
        return Math.abs(this.x - this.savedPlayerPositionX) < 50 && Math.abs(this.y - this.savedPlayerPositionY) < 50;
    }

    update() {
        this.savedPlayerPositionX = globalVars.playerPositionX;
        this.savedPlayerPositionY = globalVars.playerPositionY;
    }
}