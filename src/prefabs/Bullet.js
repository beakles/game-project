class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);

        this.settings = {
            speed: 10
        }

        this.direction = direction;

        if (this.direction == 'west') {
            this.x -= 34;
            this.y += 3;
        } else if (this.direction == 'east') {
            this.x += 38;
            this.y += 3;
        }
    }

    update() {
        this.depth = this.y;

        if (this.direction == 'west') {
            this.x -= this.settings.speed;
        } else if (this.direction == 'east') {
            this.x += this.settings.speed;
        }
    }
}