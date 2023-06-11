class Zombie extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);

        this.stats = {
            health: 100,
            speed: 120,
            damage: 10,
            range: 50,
            status: 'alive',
            score: 1
        }

        this.animationTime = 0.0;
        this.attackDebounce = false;
        this.hitboxEnabled = false;
        this.hitTarget = false;
        this.inRange = false;
        this.canMoveOnY = false;

        this.corpseDespawnTimer = 0;

        this.savedPlayerPositionX = globalVars.playerPositionX;
        this.savedPlayerPositionY = globalVars.playerPositionY;
        this.healthBar = this.scene.add.graphics();
    }

    drawHealthBar() {
        // Clear any existing graphics
        this.healthBar.clear();
    
        // Calculate the width of the health bar based on the zombie's health
        let healthBarWidth = 50 * (this.stats.health / 100);
    
        // If the zombie is alive, draw the health bar
        if (this.stats.status !== 'dead') {
            this.healthBar.fillStyle(0xff0000);  // color of the health bar
            this.healthBar.fillRect(this.x - 27, this.y - 50, healthBarWidth, 5); // x, y, width, height
        }
    }
    
    updateHealthBar() {
        // Clear any existing graphics and redraw the health bar
        this.drawHealthBar();
    }
    
    checkInRange() {
        return Math.abs(this.x - this.savedPlayerPositionX) < this.stats.range && Math.abs(this.y - this.savedPlayerPositionY) < this.stats.range / 2;
    }

    update() {
        this.updateHealthBar();
        this.depth = this.y + (this.height / 2);

        this.savedPlayerPositionX = globalVars.playerPositionX;
        this.savedPlayerPositionY = globalVars.playerPositionY;

        if (this.stats.health <= 0) {
            this.stats.status = 'dead';
        } else if (this.checkInRange()) {
            this.stats.status = 'attacking';
        } else if (!this.attackDebounce) {
            this.stats.status = 'alive';
        }

        if (this.stats.status == 'alive') {
            if (Math.abs(this.x - this.savedPlayerPositionX) < 150) {
                this.canMoveOnY = true;
            } else {
                this.canMoveOnY = false;
            }

            if (this.savedPlayerPositionY < this.y && this.canMoveOnY) {
                this.y -= this.stats.speed / 2 * (config.gameSpeed / globalVars.gameDelta);
            }
            if (this.savedPlayerPositionX < this.x) {
                this.x -= this.stats.speed * (config.gameSpeed / globalVars.gameDelta);
            }
            if (this.savedPlayerPositionY > this.y && this.canMoveOnY) {
                this.y += this.stats.speed / 2 * (config.gameSpeed / globalVars.gameDelta);
            }
            if (this.savedPlayerPositionX > this.x) {
                this.x += this.stats.speed * (config.gameSpeed / globalVars.gameDelta);
            }

            this.deltaPositionX = this.x - this.savedPlayerPositionX;
            this.deltaPositionY = this.y - this.savedPlayerPositionY;

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
        }

        if (this.stats.status == 'alive') {
            this.animationTime = 0;

            this.setTexture('zombie');
        } else if (this.stats.status == 'attacking') {
            this.animationTime += (config.gameSpeed / globalVars.gameDelta);
            this.attackDebounce = true;
            if (this.animationTime > 1) {
                this.animationTime = 0;
                this.attackDebounce = false;
            } else if (this.animationTime > 0.5) {
                this.setTexture('zombie');
                this.hitboxEnabled = false;
                this.hitTarget = false;
            } else if (this.animationTime > 0.25) {
                this.setTexture('zombieStrike');
                if (!this.hitTarget) {
                    this.hitboxEnabled = true;
                }
            } else {
                this.setTexture('zombieWindUp');
            }
        } else if (this.stats.status == 'dead') {
            this.animationTime = 0;

            this.corpseDespawnTimer += config.gameSpeed / globalVars.gameDelta;

            if (this.corpseDespawnTimer > 3) {
                this.alpha = 1 - (this.corpseDespawnTimer - 3);
            } else {
                this.alpha = 1;
            }

            this.setTexture('zombieDead');
        }
    }
}