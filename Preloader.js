import Phaser from 'phaser';
import menuBackground from '../assets/images/menu_fantasy.jpg';
import heroImage from '../assets/characters/hero_new.png';
import mageImage from '../assets/characters/mage_new.png';
import archerImage from '../assets/characters/archer_new.png';
import dragonImage from '../assets/characters/dragon_new.png';
import goblinImage from '../assets/characters/goblin_new.png';
import skeletonImage from '../assets/characters/skeleton_new.png';
import slimeImage from '../assets/characters/slime_new.png';

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    const { width, height } = this.cameras.main;
    this.add.rectangle(width / 2, height / 2, width, height, 0x101a35);
    this.add.image(width / 2, height / 2 - 70, 'logo').setScale(1.2);
    const bar = this.add.graphics();
    this.add.text(width / 2, height / 2 + 20, 'Loading adventure...', {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#ffe7a6',
    }).setOrigin(0.5);
    this.load.on('progress', (value) => {
      bar.clear();
      bar.fillStyle(0x24314f, 1).fillRoundedRect(width / 2 - 170, height / 2 + 65, 340, 22, 10);
      bar.fillStyle(0xffc64d, 1).fillRoundedRect(width / 2 - 166, height / 2 + 69, 332 * value, 14, 7);
    });

    this.load.image('menu_bg', menuBackground);
    // Keep legacy UI and onboarding assets used by the Options, Credits and name screens.
    this.load.image('button', '../src/assets/components/button.png');
    this.load.image('button_hover', '../src/assets/components/button_hover.png');
    this.load.image('checkedBox', '../src/assets/components/checkedBox.png');
    this.load.image('box', '../src/assets/components/box.png');
    this.load.image('background', '../src/assets/images/background.jpeg');
    this.load.image('hero', heroImage);
    this.load.image('mage', mageImage);
    this.load.image('archer', archerImage);
    this.load.image('dragon', dragonImage);
    this.load.image('goblin', goblinImage);
    this.load.image('skeleton', skeletonImage);
    this.load.image('slime', slimeImage);
    this.load.image('closed_chest', '../src/assets/images/chest_closed.png');
    this.load.audio('theme', ['../src/assets/sound/theme_sound.ogg']);
    this.load.audio('battle', ['../src/assets/sound/battle_theme.mp3']);
    this.load.image('tiles', '../src/assets/tiles/tiles.png');
    this.load.tilemapTiledJSON('map', '../src/assets/tiles/map.json');
  }

  create() {
    this.scene.start('UserInfo');
  }
}
