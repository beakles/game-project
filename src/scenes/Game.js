class Game extends Phaser.Scene {
    constructor() {
        super("sceneGame");
    }

    // things to load immediately so that we don't have to load them every time
    preload() {
        this.load.image('backdrop', './assets/backdropUpscaled.png');
        this.load.image('road', './assets/roadUpscaled.png');

        this.load.image('mainCharacter', './assets/mainCharacterWithGunUpscaled.png');

        this.load.image('tutorialDude', './assets/tutorial dude.png');

        this.load.image('gunBullet', './assets/gunBulletUpscaled.png');

        this.load.image('zombie', './assets/zombieRegularUpscaled.png');
        this.load.image('zombieDead', './assets/zombieRegularDeadUpscaled.png');
        this.load.image('zombieWindUp', './assets/zombieRegularUpscaledWindUp.png');
        this.load.image('zombieStrike', './assets/zombieRegularUpscaledStrike.png');
        this.load.image('zombieBoss', './assets/zombieBossUpscaled.png');
        this.load.image('zombieBossDead', './assets/zombieBossUpscaledDead.png');
        this.load.image('zombieBossWindUp', './assets/zombieBossUpscaledWindUp.png');
        this.load.image('zombieBossStrike', './assets/zombieBossUpscaledStrike.png');

        this.load.audio('gunShoot', './assets/gunShoot.wav');

        this.load.audio('playerHit', './assets/playerHit.wav');
        this.load.audio('playerDeath', './assets/playerDeath.wav');

        this.load.audio('zombieDeath', './assets/zombieDeath.wav');
        this.load.audio('zombieHit', './assets/zombieHit.wav');

        this.load.audio('gunClick', './assets/click.wav');

        this.load.audio('buffPickup', './assets/buffPickup.wav');

        this.load.image('bulletDamagePowerup', './assets/damagePowerupUpscaled.png');
        this.load.image('healthPowerup', './assets/healthPowerupUpscaled.png');
        this.load.image('lightningPowerup', './assets/lightningPowerupUpscaled.png');
        this.load.image('speedPowerup', './assets/speedPowerupUpscaled.png');
    }

    checkZombieCollision(object1, object2) {
        if (object1.x < object2.x + object2.width && object1.x + object1.width > object2.x && object1.y < object2.y + object2.height && object1.height + object1.y > object2.y) {
            return true;
        }
        return false;
    }

    checkBuffCollision(object1, object2) {
        if (object1.x < object2.x + object2.width && object1.x + object1.width > object2.x && object1.y < object2.y + object2.height / 2 && object1.height / 2 + object1.y > object2.y) {
            return true;
        }
        return false;
    }

    // things to load every time the scene is created
    create() {
        this.cityBackdrop = this.add.tileSprite(0, 0, config.width, config.height, 'backdrop').setOrigin(0, 0);
        this.cityRoad = this.add.tileSprite(0, config.height - (config.height * (1 / 3.5)), config.width, config.height, 'road').setOrigin(0, 0);
        this.cityRoad.scaleY = 1 / 3.5;

        let healthTextConfig = {
                fontFamily: 'Courier',
                fontSize: '40px',
                backgroundColor: '#FFFF00',
                color: '#202020',
                align: 'center',
                padding: {
                top: 5,
                bottom: 5,
            },
            // fixedWidth: 100
        }
        this.score = 0;
        this.scoreText = this.add.text(config.width / 8, config.height / 12, "SCORE: 0", healthTextConfig).setOrigin(0.5, 0.5);
        this.masterMode = this.add.text(config.width / 8, config.height / 6, "MASTER MODE", healthTextConfig).setOrigin(0.5, 0.5);
        this.masterMode.visible = false;
        // this.healthText = this.add.text(config.width / 2, config.height / 4, "HEALTH: 0", healthTextConfig).setOrigin(0.5, 0.5);

        this.buffText = this.add.text(config.width - 200, config.height / 3, "BUFF ACQUIRED:\nnull", healthTextConfig).setOrigin(0.5, 0.5);
        this.buffText.alpha = 0;

        this.controlsText = this.add.text(config.width / 2, config.height / 8, "CONTROLS\nSPACEBAR -> SHOOT\nWASD -> MOVE", healthTextConfig).setOrigin(0.5, 0.5);

        this.reloadText = this.add.text(config.width / 2, config.height / 3, "RELOADING", healthTextConfig).setOrigin(0.5, 0.5);
        this.reloadText.visible = false;

        this.creaturePlayer = new Player(this, config.width - 50, config.height - (720 / 5.1), 'mainCharacter', 0).setOrigin(0.5, 0.5);
        // this.creatureZombie = new Zombie(this, 0 + 50, config.height - (720 / 5.1), 'zombie', 0).setOrigin(0.5, 0.5);
        // this.creatureZombie2 = new Zombie(this, 0 + 50, config.height - (720 / 5.1) - 50, 'zombie', 0).setOrigin(0.5, 0.5);
        // this.creatureZombie3 = new Zombie(this, 0 + 50, config.height - (720 / 5.1) + 50, 'zombie', 0).setOrigin(0.5, 0.5);

        this.statsText = this.add.text(config.width / 2, config.height / 4, 'HP: ' + this.creaturePlayer.stats.health + ' MSPD: ' + this.creaturePlayer.stats.speed + ' DMG: ' + this.creaturePlayer.stats.damage, healthTextConfig).setOrigin(0.5, 0.5);
        
        config.keybinds.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        config.keybinds.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        config.keybinds.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        config.keybinds.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        config.keybinds.keySpacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        config.keybinds.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)

        this.bulletArray = [];
        this.zombieArray = [];
        this.deadZombieArray = [];
        this.buffArray = [];
        // this.zombieArray.push(this.creatureZombie);
        // this.zombieArray.push(this.creatureZombie2);
        // this.zombieArray.push(this.creatureZombie3);

        this.zombieSpawnDelay = 3;
        this.zombieSpawnTimer = 0;
        this.difficultyTimer = 0;
        this.bossChance = 3;

        this.buffSpawnTimer = 0;
        this.buffTextTimer = 0;

        this.baseSpeed = this.creaturePlayer.stats.speed;
        this.baseDamage = this.creaturePlayer.stats.damage;
    }

    // things in the scene that need to be updated every frame
    update(time, delta) {
        // currentFPS = config.framerate / delta; // game will try to run at this speed with respect to factors like monitor refresh rate, performance, etc.

        // console.log(this.bulletArray, this.zombieArray, this.deadZombieArray);

        // globalVars.gameDelta = delta;
        /*
        time = now()
        delta = time - previousTime
        previousTime = time
        fps = 1000 / delta
        increment = 60 / fps
        */

        globalVars.gameDelta = 1000 / delta;

        // console.log(globalVars.gameDelta);

        if (this.creaturePlayer.stats.health <= 0) {
            this.statsText.text = `YOU HAVE DIED. PRESS (R) TO RESTART`;
        }

        if (this.buffTextTimer > 0) {
            this.buffTextTimer -= config.gameSpeed / globalVars.gameDelta;
            this.buffText.alpha = 1;
        } else {
            this.buffText.alpha = 0;
        }

        if (Phaser.Input.Keyboard.JustDown(config.keybinds.keyR)) {
            this.creaturePlayer.stats.health = 100;
            this.scene.restart();
        }

        if (this.creaturePlayer.stats.health <= 0) {
            return;
        }

        this.zombieSpawnTimer += config.gameSpeed / globalVars.gameDelta;
        this.difficultyTimer += config.gameSpeed / globalVars.gameDelta;
        // console.log(this.zombieSpawnTimer);

        this.buffSpawnTimer += config.gameSpeed / globalVars.gameDelta;

        if (this.difficultyTimer >= 25 && this.zombieSpawnDelay > 0.61) {
            this.difficultyTimer = 0;
            this.zombieSpawnDelay -= 0.2;
            if (this.zombieSpawnDelay < 1.61 && this.bossChance >= 6) {
                this.bossChance -= 1;
            } else if (this.zombieSpawnDelay > 1.61) {
                this.bossChance += 1;
            }
            console.log(this.zombieSpawnDelay, this.bossChance);
        }

        if (this.difficultyTimer >= 25 && this.score >= 500 && this.zombieSpawnDelay > 0.11) {
            this.difficultyTimer = 0;
            this.zombieSpawnDelay -= 0.05;
            this.masterMode.visible = true;
            console.log(this.zombieSpawnDelay, this.bossChance);
        }

        if (this.zombieSpawnTimer >= this.zombieSpawnDelay) {
            this.zombieSpawnTimer = 0;
            let newZombie = null;
            if (Phaser.Math.Between(1, this.bossChance) == 1) {
                newZombie = new ZombieBoss(this, 0 + 50, config.height - (720 / 5.1) + Phaser.Math.Between(-100, 100), 'zombieBoss', 0).setOrigin(0.5, 0.5);
            } else {
                newZombie = new Zombie(this, 0 + 50, config.height - (720 / 5.1) + Phaser.Math.Between(-100, 100), 'zombie', 0).setOrigin(0.5, 0.5);
            }
            this.zombieArray.push(newZombie);
        }

        if (this.buffSpawnTimer >= 20) {
            this.buffSpawnTimer = 0;
            let randomBuff = Phaser.Math.Between(1, 4);
            let newBuff = null;
            if (randomBuff == 1) {
                newBuff = new Buff(this, Phaser.Math.Between(0 + 100, config.width - 100), config.height - (720 / 5.1) + Phaser.Math.Between(-100, 100), 'bulletDamagePowerup', 0).setOrigin(0.5, 0.5);
                newBuff.type = 'damage';
            } else if (randomBuff == 2) {
                newBuff = new Buff(this, Phaser.Math.Between(0 + 100, config.width - 100), config.height - (720 / 5.1) + Phaser.Math.Between(-100, 100), 'healthPowerup', 0).setOrigin(0.5, 0.5);
                newBuff.type = 'health';
            } else if (randomBuff == 3) {
                newBuff = new Buff(this, Phaser.Math.Between(0 + 100, config.width - 100), config.height - (720 / 5.1) + Phaser.Math.Between(-100, 100), 'lightningPowerup', 0).setOrigin(0.5, 0.5);
                newBuff.type = 'lightning';
            } else {
                newBuff = new Buff(this, Phaser.Math.Between(0 + 100, config.width - 100), config.height - (720 / 5.1) + Phaser.Math.Between(-100, 100), 'speedPowerup', 0).setOrigin(0.5, 0.5);
                newBuff.type = 'speed';
            }
            newBuff.depth = newBuff.y + (newBuff.height / 2);
            this.buffArray.push(newBuff);
        }

        this.creaturePlayer.update();

        for (let zombieArrayItem = 0; zombieArrayItem < this.zombieArray.length; zombieArrayItem++) {
            let currentZombie = this.zombieArray[zombieArrayItem];
            if (currentZombie.hitboxEnabled && currentZombie.checkInRange()) {
                currentZombie.hitboxEnabled = false;
                currentZombie.hitTarget = true;
                this.creaturePlayer.stats.health -= currentZombie.stats.damage;
                this.statsText.text = 'HP: ' + this.creaturePlayer.stats.health + ' MSPD: ' + this.creaturePlayer.stats.speed + ' DMG: ' + this.creaturePlayer.stats.damage;
                if (this.creaturePlayer.stats.health > 0) {
                    this.sound.play('playerHit');
                } else {
                    this.sound.play('playerDeath');
                }
            }
            currentZombie.update();
        }

        for (let buffArrayItem = 0; buffArrayItem < this.buffArray.length; buffArrayItem++) {
            let currentBuff = this.buffArray[buffArrayItem];
            if (this.checkBuffCollision(currentBuff, this.creaturePlayer)) {
                this.sound.play('buffPickup');
                this.buffTextTimer = 5;
                if (currentBuff.type == 'damage') {
                    this.creaturePlayer.stats.damage += 5;
                    this.statsText.text = 'HP: ' + this.creaturePlayer.stats.health + ' MSPD: ' + this.creaturePlayer.stats.speed + ' DMG: ' + this.creaturePlayer.stats.damage;
                    this.buffText.text = 'BUFF ACQUIRED:\nDAMAGE INCREASE';
                } else if (currentBuff.type == 'health') {
                    this.creaturePlayer.stats.health += 20;
                    this.statsText.text = 'HP: ' + this.creaturePlayer.stats.health + ' MSPD: ' + this.creaturePlayer.stats.speed + ' DMG: ' + this.creaturePlayer.stats.damage;
                    this.buffText.text = 'BUFF ACQUIRED:\nHEALTH INCREASE';
                } else if (currentBuff.type == 'lightning') {
                    for (let zombieArrayItem = 0; zombieArrayItem < this.zombieArray.length; zombieArrayItem++) {
                        let currentZombie = this.zombieArray[zombieArrayItem];
                        currentZombie.stats.health -= 100;
                        if (currentZombie.stats.health > 0) {
                            this.sound.play('zombieHit');
                        } else {
                            this.sound.play('zombieDeath');
                        }
                        if (currentZombie.stats.status == "dead") {
                            this.zombieArray.splice(zombieArrayItem, 1);
                            this.deadZombieArray.push(currentZombie);
                            this.score += currentZombie.stats.score;
                            // zombieArrayItem = 0;
                            // break;
                        }
                    }
                    this.buffText.text = 'BUFF ACQUIRED:\nLIGHTNING STRIKE';
                } else if (currentBuff.type == 'speed') {
                    this.creaturePlayer.stats.speed += 20;
                    this.statsText.text = 'HP: ' + this.creaturePlayer.stats.health + ' MSPD: ' + this.creaturePlayer.stats.speed + ' DMG: ' + this.creaturePlayer.stats.damage;
                    this.buffText.text = 'BUFF ACQUIRED:\nSPEED INCREASE';
                }
                this.buffArray.splice(buffArrayItem, 1);
                currentBuff.destroy();
                buffArrayItem = 0;
                break;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(config.keybinds.keySpacebar)) {
            if (this.bulletArray.length < 3) {
                let newBullet = new Bullet(this, globalVars.playerPositionX, globalVars.playerPositionY, 'gunBullet', 0, this.creaturePlayer.direction).setOrigin(0.5, 0.5);
                this.bulletArray.push(newBullet);
                this.sound.play('gunShoot');
            } else {
                this.sound.play('gunClick');
            }
        }

        if (this.bulletArray.length >= 3) {
            this.reloadText.visible = true;
        } else {
            this.reloadText.visible = false;
        }

        for (let bulletArrayItem = 0; bulletArrayItem < this.bulletArray.length; bulletArrayItem++) {
            let currentBullet = this.bulletArray[bulletArrayItem];
            // console.log('index:', bulletArrayItem, 'bullet:', currentBullet);
            if (currentBullet.x > config.width || currentBullet.x < 0) {
                // console.log('bullet is out of bounds');
                this.bulletArray.splice(bulletArrayItem, 1);
                currentBullet.destroy();
                bulletArrayItem = 0;
                break;
            } else {
                for (let zombieArrayItem = 0; zombieArrayItem < this.zombieArray.length; zombieArrayItem++) {
                    let currentZombie = this.zombieArray[zombieArrayItem];
                    // console.log('zombie:', currentZombie);
                    if (this.checkZombieCollision(currentBullet, currentZombie) && currentZombie.stats.status != "dead") {
                        // console.log('bullet collided with zombie');
                        currentZombie.stats.health -= this.creaturePlayer.stats.damage;
                        if (currentZombie.stats.health > 0) {
                            this.sound.play('zombieHit');
                        } else {
                            this.sound.play('zombieDeath');
                        }
                        this.bulletArray.splice(bulletArrayItem, 1);
                        currentBullet.destroy();
                        bulletArrayItem = 0;
                        break;
                    } else if (currentZombie.stats.status == "dead") {
                        this.zombieArray.splice(zombieArrayItem, 1);
                        this.deadZombieArray.push(currentZombie);
                        this.score += currentZombie.stats.score;
                        zombieArrayItem = 0;
                        break;
                    }
                }
            }
            // console.log('bullet is in free space');
            currentBullet.update();
        }

        // despawn dead zombies based on amount
        if (this.deadZombieArray.length > 8) {
            this.deadZombieArray[0].destroy();
            this.deadZombieArray.shift();
        }

        this.scoreText.text = 'SCORE:' + this.score;
    }
}