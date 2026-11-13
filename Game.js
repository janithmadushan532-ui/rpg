import Phaser from 'phaser';
import { generateRandomNumberInRange } from '../utils/phaserHelper';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
    this.quizTransitioning = false;
  }

  create() {
    this.quizTransitioning = false;
    const map = this.make.tilemap({ key: 'map' });
    const tiles = map.addTilesetImage('spritesheet', 'tiles');
    const grass = map.createStaticLayer('Grass', tiles, 0, 0);
    grass.setScale(2);
    const obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);
    obstacles.setScale(2);
    obstacles.setCollisionByExclusion([-1]);

    this.player = this.physics.add.image(20, 100, 'hero').setScale(0.48);
    this.player.body.setSize(48, 58).setOffset(54, 112);
    this.physics.world.bounds.width = map.widthInPixels * 2;
    this.physics.world.bounds.height = map.heightInPixels * 2;
    this.player.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.roundPixels = true;
    this.cameras.main.setZoom(1.6);

    this.chests = this.physics.add.group();
    for (let i = 0; i < 18; i += 1) {
      const x = Phaser.Math.RND.between(40, this.physics.world.bounds.width - 40);
      const y = Phaser.Math.RND.between(40, this.physics.world.bounds.height - 40);
      this.chests.create(x, y, 'closed_chest').setScale(2.4).refreshBody();
    }
    this.physics.add.collider(this.player, obstacles);
    this.physics.add.overlap(this.player, this.chests, this.onMeetEnemy, null, this);

    this.createTouchControls();
    this.add.text(12, 12, 'Find a treasure chest to answer an MCQ!', {
      fontFamily: 'Georgia, serif', fontSize: '16px', color: '#fff2bd',
      stroke: '#18233a', strokeThickness: 4,
    }).setScrollFactor(0).setDepth(1000);
  }

  createTouchControls() {
    this.touchDirection = { left: false, right: false, up: false, down: false };
    const cx = 92; const cy = this.scale.height - 95;
    const controls = [
      { key: 'up', x: cx, y: cy - 42, symbol: '▲' },
      { key: 'down', x: cx, y: cy + 42, symbol: '▼' },
      { key: 'left', x: cx - 42, y: cy, symbol: '◀' },
      { key: 'right', x: cx + 42, y: cy, symbol: '▶' },
    ];
    controls.forEach((control) => {
      const bg = this.add.circle(control.x, control.y, 25, 0x14253e, 0.72)
        .setStrokeStyle(2, 0xf4d27b).setScrollFactor(0).setDepth(1100)
        .setInteractive({ useHandCursor: true });
      this.add.text(control.x, control.y, control.symbol, {
        fontSize: '20px', color: '#fff4d0', fontStyle: 'bold',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(1101);
      bg.on('pointerdown', () => { this.touchDirection[control.key] = true; });
      bg.on('pointerup', () => { this.touchDirection[control.key] = false; });
      bg.on('pointerout', () => { this.touchDirection[control.key] = false; });
    });
    this.input.on('pointerup', () => {
      Object.keys(this.touchDirection).forEach((key) => { this.touchDirection[key] = false; });
    });
  }

  onMeetEnemy(player, chest) {
    if (this.quizTransitioning || !chest.active) return;
    this.quizTransitioning = true;
    chest.disableBody(true, true);
    this.time.delayedCall(100, () => this.scene.start('Quiz'));
  }

  update() {
    if (!this.player || !this.player.body || this.quizTransitioning) return;
    const left = this.cursors.left.isDown || this.touchDirection.left;
    const right = this.cursors.right.isDown || this.touchDirection.right;
    const up = this.cursors.up.isDown || this.touchDirection.up;
    const down = this.cursors.down.isDown || this.touchDirection.down;
    const speed = 170;
    let vx = (right ? 1 : 0) - (left ? 1 : 0);
    let vy = (down ? 1 : 0) - (up ? 1 : 0);
    const length = Math.hypot(vx, vy) || 1;
    vx = (vx / length) * speed;
    vy = (vy / length) * speed;
    this.player.setVelocity(vx, vy);
    if (vx < 0) this.player.setFlipX(true);
    if (vx > 0) this.player.setFlipX(false);
  }
}
