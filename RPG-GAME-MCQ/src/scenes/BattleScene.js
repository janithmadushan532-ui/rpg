import Phaser from 'phaser';
import Player from '../characters/Hero';
import Enemy from '../characters/Enemy';
import { generateRandomNumberInRange } from '../utils/phaserHelper';

const heroTypes = [
  { key: 'hero', name: 'Knight', hp: 120 },
  { key: 'mage', name: 'Mage', hp: 90 },
  { key: 'archer', name: 'Archer', hp: 105 },
];
const enemyTypes = [
  { key: 'dragon', name: 'Dragon', hp: 90 },
  { key: 'goblin', name: 'Goblin', hp: 55 },
  { key: 'skeleton', name: 'Skeleton', hp: 65 },
  { key: 'slime', name: 'Slime', hp: 45 },
];

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super('Battle');
    this.turnBusy = false;
  }

  create() {
    this.score = 0;
    this.turnBusy = false;
    this.model = this.sys.game.globals.model;
    this.cameras.main.setBackgroundColor('#15243a');
    this.add.rectangle(400, 340, 800, 300, 0x355d4a).setAlpha(0.65);
    this.add.rectangle(400, 475, 800, 250, 0x172d28).setAlpha(0.8);
    this.add.text(400, 28, 'MONSTER BATTLE', {
      fontFamily: 'Georgia, serif', fontSize: '28px', color: '#ffe09a',
      stroke: '#261629', strokeThickness: 5,
    }).setOrigin(0.5);
    this.scoreText = this.add.text(18, 18, 'Score: 0', { fontSize: '18px', color: '#fff' });
    this.powerText = this.add.text(18, 45, `Power: ${this.sys.game.globals.power || 0}`, {
      fontSize: '18px', color: '#ffe08a',
    });
    this.startBattle();
  }

  startBattle() {
    const heroData = Phaser.Utils.Array.GetRandom(heroTypes);
    const enemyData = Phaser.Utils.Array.GetRandom(enemyTypes);
    const bonusPower = this.sys.game.globals.power || 0;
    const warrior = new Player(this, 620, 300, heroData.key, null, heroData.name, heroData.hp,
      generateRandomNumberInRange(18, 30) + Math.floor(bonusPower / 10));
    warrior.setScale(0.82);
    warrior.setFlipX(true);
    this.add.existing(warrior);

    const monster = new Enemy(this, 190, 300, enemyData.key, null, enemyData.name,
      enemyData.hp, generateRandomNumberInRange(8, 18));
    monster.setScale(0.82);
    this.add.existing(monster);

    this.heroes = [warrior];
    this.enemies = [monster];
    this.units = this.heroes.concat(this.enemies);
    this.index = -1;
    this.scene.launch('BattleMenu');
  }

  endBattle() {
    const result = this.checkEndBattle();
    this.time.removeAllEvents();
    this.units.forEach((unit) => unit.destroy());
    this.heroes.length = 0;
    this.enemies.length = 0;
    this.units.length = 0;
    this.index = -1;
    this.turnBusy = false;
    this.scene.stop('BattleMenu');
    if (result === 'gameOver') {
      this.sys.game.globals.model.score = this.score;
      this.scene.stop('Game');
      this.scene.start('GameOver');
    } else {
      this.scene.start('Game');
    }
  }

  receivePlayerSelection(action, target) {
    if (this.turnBusy) return;
    this.turnBusy = true;
    if (action === 'attack' && this.enemies[target] && this.enemies[target].living) {
      this.units[this.index].attack(this.enemies[target]);
      this.score += 10;
    }
    this.time.delayedCall(850, this.nextTurn, [], this);
  }

  exitBattle() {
    this.scene.stop('BattleMenu');
    this.scene.start('Game');
  }

  checkEndBattle() {
    const anyEnemyAlive = this.enemies.some((unit) => unit.living);
    const anyHeroAlive = this.heroes.some((unit) => unit.living);
    if (!anyEnemyAlive) return 'victory';
    if (!anyHeroAlive) return 'gameOver';
    return null;
  }

  nextTurn() {
    this.turnBusy = false;
    if (this.checkEndBattle()) {
      this.endBattle();
      return;
    }
    let attempts = 0;
    do {
      this.index = (this.index + 1) % this.units.length;
      attempts += 1;
      if (attempts > this.units.length + 1) {
        this.endBattle();
        return;
      }
    } while (!this.units[this.index].living);

    if (this.units[this.index] instanceof Player) {
      this.events.emit('PlayerSelect', this.index);
      return;
    }
    const livingHeroes = this.heroes.filter((hero) => hero.living);
    if (!livingHeroes.length) {
      this.endBattle();
      return;
    }
    this.turnBusy = true;
    const target = Phaser.Utils.Array.GetRandom(livingHeroes);
    this.units[this.index].attack(target);
    this.time.delayedCall(1000, this.nextTurn, [], this);
  }

  update() {
    if (this.scoreText) this.scoreText.setText(`Score: ${this.score}`);
    if (this.powerText) this.powerText.setText(`Power: ${this.sys.game.globals.power || 0}`);
  }
}
