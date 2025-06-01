import Phaser from 'phaser';

class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene');
    this.groundImageHeight = 26;
  }

  create() {
    this.isGameRunning = false;
    const { height, width } = this.game.config;
    this.gameSpeed = 10;
    this.respawnTime = 0;
    this.score = 0;

    this.loadSounds();
    this.createGround(height);
    this.createDino(height);
    this.createScoreUI(width);
    this.createObstacles();
    this.createGameOverScreen(width, height);
    this.createEnvironment(width);

    this.handleUserInputs();
    this.initStartTrigger();
    this.initAnims();
    this.initColliders();
    this.handleScore();
  }

  loadSounds() {
    this.jumpSound = this.sound.add('jump', { volume: 0.8 });
    this.hitSound = this.sound.add('hit', { volume: 0.8 });
    this.reachSound = this.sound.add('reach', { volume: 0.8 });
    this.trexRoarSound = this.sound.add('trex-roar', {volume: 1.0})
  }

  createGround(height) {
    this.startTrigger = this.physics.add.sprite(0, 10)
      .setOrigin(0, 1)
      .setImmovable();

    this.ground = this.add.tileSprite(0, height, 80, this.groundImageHeight, 'ground').setOrigin(0, 1);
  }

  createDino(height) {
    this.dino = this.physics.add.sprite(0, height, 'dino-idle')
      .setCollideWorldBounds(true)
      .setGravityY(5000)
      .setOrigin(0, 1)
      .setBodySize(44, 92)
      .setDepth(1)
      // .setTint(0x00FF00);
      // .setTintFill(0x0B6623);
  }

  createScoreUI(width) {
    this.scoreText = this.add
      .text(width, 0, 'HI ' + '00000', {
        fill: '#535353',
        font: '900 35px Courier',
        resolution: 5
      })
      .setOrigin(1, 0);
  }

  createObstacles() {
    this.obstacles = this.physics.add.group();
  }

  createGameOverScreen(width, height) {
    this.gameOverScreen = this.add.container(width / 2, height / 2 - 50).setAlpha(0);
    this.gameOverText = this.add.image(0, 0, 'game-over');
    this.restart = this.add.image(0, 50, 'restart').setInteractive();

    this.gameOverScreen.add([this.gameOverText, this.restart]);
  }

  createEnvironment(width) {
    this.environment = this.add.group();
    this.environment.addMultiple([
      this.add.image(width / 2, 170, 'cloud'),
      this.add.image(width - 88, 80, 'cloud'),
      this.add.image(width / 1.39, 110, 'cloud')
    ]);
    this.environment.setAlpha(0);
  }

  initColliders() {
    this.physics.add.collider(this.dino, this.obstacles, () => {
      this.physics.pause();
      this.isGameRunning = false;
      this.anims.pauseAll();
      this.dino.setTexture('dino-hurt');
      this.respawnTime = 0;
      this.gameSpeed = 0;
      this.gameOverScreen.setAlpha(1);
      this.hitSound.play();
    }, null, this);
  }

  initStartTrigger() {
    const { width, height } = this.game.config;

    this.physics.add.overlap(this.startTrigger, this.dino, () => {
      if (this.startTrigger.y === 10) {
        this.startTrigger.body.reset(0, height);
        return;
      }

      this.startTrigger.disableBody(true, true);
      console.log("hitting the box");

      const startEvent = this.time.addEvent({
        delay: 1000 / 60,
        loop: true,
        callbackScope: this,
        callback: () => {
          this.dino.setVelocityX(80);
          this.dino.play('dino-run', 1);

          if (this.ground.width < width) {
            this.ground.width += 34;
          }

          if (this.ground.width >= width) {
            this.ground.width = width;
            this.isGameRunning = true;
            this.dino.setVelocity(0);
            this.environment.setAlpha(1);
            startEvent.remove();
          }
        }
      });
    }, null, this);
  }

  handleScore() {
    this.time.addEvent({
      delay: 100,
      loop: true,
      callbackScope: this,
      callback: () => {
        if (!this.isGameRunning) return;

        this.score++;
        this.gameSpeed += 0.01;

        if (this.score % 100 === 0) {
          this.reachSound.play();
          this.tweens.add({
            targets: this.scoreText,
            duration: 100,
            repeat: 3,
            alpha: 0,
            yoyo: true
          });
        }

        if (this.score % 500 === 0) {
          this.trexRoarSound.play();
        }

        const paddedScore = String(this.score).padStart(5, '0');
        this.scoreText.setText(paddedScore);
      }
    });
  }

  handleUserInputs() {
    this.restart.on('pointerdown', () => {
      window.location.reload();
    });

    this.input.keyboard.on('keydown_SPACE', () => {
      if (!this.dino.body.onFloor()) return;

      this.setDinoDefaultSize();
      this.dino.setTexture('dino', 0);
      this.dino.setVelocityY(-1600);
    });

    this.input.keyboard.on('keydown_DOWN', () => {
      if (!this.dino.body.onFloor()) return;
      this.setDinoDuckSize();
    });

    this.input.keyboard.on('keyup_DOWN', () => {
      if (!this.dino.body.onFloor()) return;
      this.setDinoDefaultSize();
    });
  }

  setDinoDefaultSize() {
    this.dino.body.height = 92;
    this.dino.body.offset.y = 0;
  }

  setDinoDuckSize() {
    this.dino.body.height = 58;
    this.dino.body.offset.y = 34;
  }

  initAnims() {
    this.anims.create({
      key: 'dino-run',
      frames: this.anims.generateFrameNumbers('dino', { start: 2, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'dino-down-anim',
      frames: this.anims.generateFrameNumbers('dino-down', { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'enemy-bird-fly',
      frames: this.anims.generateFrameNumbers('enemy-bird', { start: 0, end: 1 }),
      frameRate: 6,
      repeat: -1
    });
  }

  placeObstacle() {
    const { width, height } = this.game.config;
    const obstacleNum = Math.floor(Math.random() * 7) + 1;
    const distance = Phaser.Math.Between(600, 900);

    let obstacle;

    if (obstacleNum > 6) {
      const enemyHeight = [22, 50];
      obstacle = this.obstacles.create(
        width + distance,
        height - enemyHeight[Math.floor(Math.random() * 2)],
        'enemy-bird'
      );
      obstacle.play('enemy-bird-fly', 1);
      obstacle.body.height /= 1.5;
    } else {
      obstacle = this.obstacles.create(width + distance, height, `obsticle-${obstacleNum}`);
      obstacle.body.offset.y = 10;
      console.log("cacti");
    }

    obstacle.setOrigin(0, 1).setImmovable();
    console.log(obstacleNum, distance);
  }

  update(time, delta) {
    if (!this.isGameRunning) return;

    this.ground.tilePositionX += this.gameSpeed;

    Phaser.Actions.IncX(this.obstacles.getChildren(), -this.gameSpeed);
    Phaser.Actions.IncX(this.environment.getChildren(), -0.5);

    this.respawnTime += delta * this.gameSpeed * 0.08;

    if (this.respawnTime >= 1500) {
      this.placeObstacle();
      this.respawnTime = 0;
    }

    this.cleanupOffscreenObstacles();
    this.recycleEnvironment();

    // Update dino animation based on vertical movement
    if (this.dino.body.deltaAbsY() > 0) {
      this.dino.anims.stop();
      this.dino.setTexture('dino');
    } else {
      if (this.dino.body.height <= 58) {
        this.dino.play('dino-down-anim', true);
      } else {
        this.dino.play('dino-run', true);
      }
    }
  }

  cleanupOffscreenObstacles() {
    this.obstacles.getChildren().forEach(obstacle => {
      if (obstacle.getBounds().right < 0) {
        obstacle.destroy();
      }
    });
  }

  recycleEnvironment() {
    this.environment.getChildren().forEach(env => {
      if (env.getBounds().right < 0) {
        env.x = this.game.config.width + 30;
      }
    });
  }
}

export default PlayScene;
