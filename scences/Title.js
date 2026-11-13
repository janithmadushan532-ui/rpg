import Phaser from 'phaser';
import config from '../config/config';
import { getName } from '../utils/storage';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    const { width, height } = this.cameras.main;
    this.model = this.sys.game.globals.model;
    this.model.name = getName();

    // Full illustrated menu artwork. Transparent hit areas keep every menu choice usable.
    this.add.image(width / 2, height / 2, 'menu_bg').setDisplaySize(width, height);
    this.add.rectangle(width / 2, height - 18, width, 36, 0x071326, 0.42);
    this.add.text(width / 2, height - 18, 'MCQ QUEST  •  Answer  •  Earn Power  •  Defeat Monsters', {
      fontFamily: 'Georgia, serif', fontSize: '14px', color: '#fff2c4',
      stroke: '#24130a', strokeThickness: 3,
    }).setOrigin(0.5);

    const buttons = [
      { y: 287, target: 'Game', label: 'Play' },
      { y: 351, target: 'Options', label: 'Options' },
      { y: 414, target: 'Credits', label: 'Credits' },
      { y: 475, target: 'Rankings', label: 'Rankings' },
    ];
    buttons.forEach((item) => {
      const hit = this.add.rectangle(width / 2, item.y, 250, 55, 0xffffff, 0.001)
        .setInteractive({ useHandCursor: true });
      hit.on('pointerover', () => hit.setFillStyle(0xffe08a, 0.12));
      hit.on('pointerout', () => hit.setFillStyle(0xffffff, 0.001));
      hit.on('pointerdown', () => {
        if (item.target === 'Game') this.scene.start('Game');
        else this.scene.start(item.target);
      });
    });

    if (this.model.musicOn && !this.model.bgMusicPlaying) {
      this.bgMusic = this.sound.add('theme', { volume: 0.35, loop: true });
      this.bgMusic.play();
      this.model.bgMusicPlaying = true;
      this.sys.game.globals.bgMusic = this.bgMusic;
    }
  }
}
