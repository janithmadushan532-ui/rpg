import Phaser from 'phaser';
import questions from '../data/questions';

export default class QuizScene extends Phaser.Scene {
  constructor() {
    super('Quiz');
  }

  create() {
    if (!this.wakeHandlerAdded) {
      this.sys.events.on('wake', this.refreshQuiz, this);
      this.wakeHandlerAdded = true;
    }
    const { width, height } = this.cameras.main;
    const globals = this.sys.game.globals;
    if (!globals.seenQuestions) globals.seenQuestions = [];

    let available = questions.map((item, index) => index)
      .filter((index) => !globals.seenQuestions.includes(index));
    if (available.length === 0) {
      globals.seenQuestions = [];
      available = questions.map((item, index) => index);
    }
    const selected = Phaser.Utils.Array.GetRandom(available);
    globals.seenQuestions.push(selected);
    this.question = questions[selected];
    this.answered = false;

    this.add.rectangle(width / 2, height / 2, width, height, 0x10251b);
    this.add.rectangle(width / 2, 62, width - 44, 82, 0x183d2b)
      .setStrokeStyle(2, 0x9bd17c);
    this.add.text(width / 2, 35, 'TREASURE CHALLENGE • MCQ', {
      fontSize: '23px', color: '#ffe08a', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 77, 'නිවැරදි පිළිතුර තෝරන්න — නිවැරදි නම් POWER +10', {
      fontSize: '17px', color: '#ffffff', align: 'center',
    }).setOrigin(0.5);

    this.add.text(width / 2, 145, this.question.question, {
      fontSize: '23px', color: '#ffffff', fontStyle: 'bold',
      align: 'center', wordWrap: { width: width - 90 },
    }).setOrigin(0.5, 0);

    this.optionButtons = [];
    this.question.options.forEach((option, index) => {
      const y = 245 + index * 62;
      const button = this.add.rectangle(width / 2, y, width - 110, 48, 0x28583d)
        .setStrokeStyle(2, 0x8fbd78)
        .setInteractive({ useHandCursor: true });
      const label = this.add.text(width / 2, y, `${index + 1}. ${option}`, {
        fontSize: '19px', color: '#ffffff', align: 'center',
        wordWrap: { width: width - 145 },
      }).setOrigin(0.5);
      button.on('pointerdown', () => this.chooseAnswer(index));
      this.optionButtons.push({ button, label });
    });

    this.feedback = this.add.text(width / 2, 510, '', {
      fontSize: '18px', color: '#ffffff', align: 'center',
      wordWrap: { width: width - 70 },
    }).setOrigin(0.5, 0);

    this.continueButton = this.add.rectangle(width / 2, 570, 220, 44, 0xd49a35)
      .setStrokeStyle(2, 0xffe08a)
      .setInteractive({ useHandCursor: true });
    this.continueLabel = this.add.text(width / 2, 570, 'සටනට යන්න', {
      fontSize: '20px', color: '#1b1b1b', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.continueButton.setVisible(false);
    this.continueLabel.setVisible(false);
    this.continueButton.on('pointerdown', () => {
      if (this.answered) this.scene.switch('Battle');
    });
  }

  refreshQuiz() {
    this.children.removeAll(true);
    this.create();
  }

  chooseAnswer(index) {
    if (this.answered) return;
    this.answered = true;
    const correct = index === this.question.answer;
    this.optionButtons.forEach((item, optionIndex) => {
      item.button.disableInteractive();
      if (optionIndex === this.question.answer) {
        item.button.setFillStyle(0x287a43);
      } else if (optionIndex === index) {
        item.button.setFillStyle(0x873b35);
      }
    });

    if (correct) {
      this.sys.game.globals.power = (this.sys.game.globals.power || 0) + 10;
      this.feedback.setColor('#9cffaa');
      this.feedback.setText(`නිවැරදියි! POWER +10\n${this.question.explanation}`);
    } else {
      this.feedback.setColor('#ffd0c9');
      this.feedback.setText(`වැරදියි! නිවැරදි පිළිතුර: ${this.question.options[this.question.answer]}\n${this.question.explanation}`);
    }
    this.continueButton.setVisible(true);
    this.continueLabel.setVisible(true);
  }
}
