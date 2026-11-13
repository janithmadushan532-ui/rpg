import Phaser from 'phaser';
import questions from '../data/questions';

export default class QuizScene extends Phaser.Scene {
  constructor() {
    super('Quiz');
  }

  create() {
    const { width, height } = this.cameras.main;
    const globals = this.sys.game.globals;
    if (!globals.seenQuestions) globals.seenQuestions = [];

    let available = questions.map((item, index) => index)
      .filter((index) => !globals.seenQuestions.includes(index));
    if (!available.length) {
      globals.seenQuestions = [];
      available = questions.map((item, index) => index);
    }
    const selected = Phaser.Utils.Array.GetRandom(available);
    globals.seenQuestions.push(selected);
    this.question = questions[selected];
    this.answered = false;

    const font = '"Noto Sans Sinhala", "Iskoola Pota", sans-serif';
    const cx = width / 2;
    this.add.rectangle(cx, height / 2, width, height, 0x101b32);
    this.add.rectangle(cx, 44, width - 28, 72, 0x1b3155).setStrokeStyle(2, 0xf2bd54);
    this.add.text(cx, 28, 'TREASURE CHALLENGE  •  MCQ', {
      fontFamily: 'Georgia, serif', fontSize: '23px', color: '#ffe29b', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(cx, 68, `ප්‍රශ්නය ${globals.seenQuestions.length} / ${questions.length}     •     නිවැරදි පිළිතුරට POWER +10`, {
      fontFamily: font, fontSize: '14px', color: '#e9f3ff', align: 'center',
    }).setOrigin(0.5);

    this.add.rectangle(cx, 166, width - 44, 150, 0x1a2946).setStrokeStyle(2, 0x6f91bd);
    const q = String(this.question.question || 'ප්‍රශ්නය ලබාගත නොහැක');
    const qSize = q.length > 115 ? 16 : q.length > 75 ? 18 : 20;
    this.add.text(cx, 166, q, {
      fontFamily: font, fontSize: `${qSize}px`, color: '#ffffff', fontStyle: 'bold',
      align: 'center', valign: 'middle', wordWrap: { width: width - 82 },
      lineSpacing: 5,
    }).setOrigin(0.5);

    this.optionButtons = [];
    const optionY = [285, 350, 415, 480];
    this.question.options.forEach((option, index) => {
      const y = optionY[index];
      const button = this.add.rectangle(cx, y, width - 64, 54, 0x254d71)
        .setStrokeStyle(2, 0x8bb9e8).setInteractive({ useHandCursor: true });
      const label = this.add.text(cx, y, `${index + 1}. ${String(option)}`, {
        fontFamily: font, fontSize: String(option).length > 55 ? '14px' : '17px',
        color: '#ffffff', align: 'center', valign: 'middle',
        wordWrap: { width: width - 100 }, lineSpacing: 2,
      }).setOrigin(0.5);
      button.on('pointerover', () => { if (!this.answered) button.setFillStyle(0x356b96); });
      button.on('pointerout', () => { if (!this.answered) button.setFillStyle(0x254d71); });
      button.on('pointerdown', () => this.chooseAnswer(index));
      this.optionButtons.push({ button, label });
    });

    this.feedbackPanel = this.add.rectangle(cx, 445, width - 50, 205, 0x172b25, 0.98)
      .setStrokeStyle(2, 0xd6ad52).setVisible(false);
    this.feedback = this.add.text(cx, 430, '', {
      fontFamily: font, fontSize: '15px', color: '#ffffff', align: 'center',
      valign: 'middle', wordWrap: { width: width - 86 }, lineSpacing: 4,
    }).setOrigin(0.5).setVisible(false);
    this.continueButton = this.add.rectangle(cx, height - 35, 250, 48, 0xc58b32)
      .setStrokeStyle(2, 0xffdf8a).setInteractive({ useHandCursor: true }).setVisible(false);
    this.continueLabel = this.add.text(cx, height - 35, 'සටනට යන්න  ▶', {
      fontFamily: font, fontSize: '18px', color: '#201608', fontStyle: 'bold',
    }).setOrigin(0.5).setVisible(false);
    this.continueButton.disableInteractive();
    this.continueButton.on('pointerdown', () => {
      if (this.answered) this.scene.start('Battle');
    });
  }

  chooseAnswer(index) {
    if (this.answered) return;
    this.answered = true;
    const correct = index === this.question.answer;
    this.optionButtons.forEach((item, optionIndex) => {
      item.button.disableInteractive();
      if (optionIndex === this.question.answer) item.button.setFillStyle(0x287a43);
      else if (optionIndex === index) item.button.setFillStyle(0x873b35);
      item.label.setAlpha(0.25);
      item.button.setAlpha(0.25);
    });
    if (correct) this.sys.game.globals.power = (this.sys.game.globals.power || 0) + 10;
    const answer = String(this.question.options[this.question.answer]);
    const explanation = String(this.question.explanation || 'මෙම කරුණ නැවත කියවා මතක තබාගන්න.');
    const heading = correct ? 'නිවැරදියි!  POWER +10' : `වැරදියි!  නිවැරදි පිළිතුර: ${answer}`;
    this.feedback.setText(`${heading}\n\nවිවරණය:\n${explanation}`);
    this.feedback.setColor(correct ? '#baffc5' : '#ffe0d8');
    this.feedbackPanel.setVisible(true);
    this.feedback.setVisible(true);
    this.continueButton.setVisible(true).setInteractive({ useHandCursor: true });
    this.continueLabel.setVisible(true);
  }
}
