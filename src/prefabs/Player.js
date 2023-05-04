class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);

        this.stats = {
            health: 100,
            speed: 1.5,
            damage: 20,
            status: 'alive',
            magazineSize: 10
        }

        this.moveDebounce = false;
        this.moveTimer = 0.0;
        this.direction = 'west';
        this.currentBullets = this.stats.magazineSize;
    }

    reduceAmmo() {
        this.currentBullets--;
    }

    reload() {
        this.currentBullets = this.stats.magazineSize;
    }

    update() {
        this.depth = this.y + (this.height / 2);

        globalVars.playerPositionX = this.x;
        globalVars.playerPositionY = this.y;

        if (config.keybinds.keyW.isDown) {
            this.y -= this.stats.speed / 2;
        }
        if (config.keybinds.keyA.isDown) {
            this.x -= this.stats.speed;
        }
        if (config.keybinds.keyS.isDown) {
            this.y += this.stats.speed / 2;
        }
        if (config.keybinds.keyD.isDown) {
            this.x += this.stats.speed;
        }

        this.deltaPositionX = this.x - globalVars.playerPositionX;
        this.deltaPositionY = this.y - globalVars.playerPositionY;

        if (this.deltaPositionX > 0.1) {
            this.flipX = false;
            this.direction = 'east';
        } else if (this.deltaPositionX < -0.1) {
            this.flipX = true;
            this.direction = 'west';
        }

        if (this.x > config.width - (this.width / 2)) {
            this.x = config.width - (this.width / 2);
        }

        if (this.x < 0 + (this.width / 2)) {
            this.x = 0 + (this.width / 2);
        }

        if (this.y > config.height - (this.height / 2)) {
            this.y = config.height - (this.height / 2);
        }

        if (this.y < (config.height - (config.height * (1 / 3.5)))) {
            this.y = (config.height - (config.height * (1 / 3.5)));
        }

        /*
        this.moveTimer++;
        
        if (Phaser.Input.Keyboard.JustDown(config.keybinds.keyR) && !this.moveDebounce && this.moveTimer > ) {
            this.moveDebounce = false;
            this.reload();
            this.moveDebounce = true;
        }
        */
    }
}