/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */

import '../styles/styles.css';
// import bgImg from '../assets/images/1.jpg';
// import DragManager from './DragManager';
// import exchange from './exchange';
import Menu from './screens/Menu';
import Rules from './screens/Rules';
import Settings from './screens/Settings';
import Puzzle from './Puzzle';
import Win from './screens/Win';

function addZero(number) {
  return (parseInt(number, 10) < 10 ? '0' : '') + number;
}

class Game {
  constructor() {
    // this.size = size;
    // this.clicks = 0;
    this.seconds = 0;
    this.minutes = 0;
    this.isStart = false;
    // this.field = createField();
    // this.chips = createChips();
    // this.isShuffling = false;
    // this.chipsArray = createChipsArray(size);
    // this.chipsArray = this.shuffle();
    // console.log(this.chipsArray);
  }

  init() {
    this.gameBox = document.createElement('div');
    this.gameBox.classList.add('game-box');
    document.body.prepend(this.gameBox);
    // ---
    this.gameContainer = document.createElement('div');
    this.gameContainer.classList.add('game-container');
    this.gameContainer.dataset.screen = 'new-game';
    this.gameBox.appendChild(this.gameContainer);
    this.gameContainer.classList.add('hidden');
    // ---
    // ---
    // const menu = new Menu(this.gameBox).init();
    // menu.open();
    // ---
    this.gamePanel = document.createElement('div');
    this.gamePanel.classList.add('game-panel');
    this.gameContainer.prepend(this.gamePanel);
    this.timer = document.createElement('div');
    this.gamePanel.prepend(this.timer);
    this.timer.innerText = `Time ${addZero(this.minutes)} : ${addZero(this.seconds)}`;
    const solveBtn = document.createElement('button');
    solveBtn.innerText = 'Solve';
    this.gamePanel.prepend(solveBtn);
    solveBtn.addEventListener('click', this.solve);
    // this.field = document.createElement('div');
    // this.field.classList.add('field');
    // this.field.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
    // this.field.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;
    // this.gameBox.appendChild(this.field);
    // this.dragMan = new DragManager().init();
    // document.addEventListener('mouseup', this.getMoves);
    // Init menu
    new Menu(this.gameBox).getScreen();
    new Rules(this.gameBox).getScreen();
    // Init Settings
    this.settings = new Settings(this.gameBox).getScreen();
    Settings.prototype.updateField = () => {
      this.puzzle.field.remove();
      this.puzzle.moves.remove();
      this.puzzle = new Puzzle(this.settings.fieldSize, this.gameContainer, this.gamePanel).init();
    };
    // ---
    this.puzzle = new Puzzle(this.settings.fieldSize, this.gameContainer, this.gamePanel).init();
    // ---
    // const resumeBtn = document.createElement('button');
    // resumeBtn.innerText = 'Resume game';
    // document.body.prepend(resumeBtn);
    // resumeBtn.addEventListener('click', this.resumeGame);
    const pauseBtn = document.createElement('button');
    pauseBtn.innerText = 'Pause';
    pauseBtn.dataset.nextScreen = 'menu';
    this.gamePanel.prepend(pauseBtn);
    pauseBtn.addEventListener('click', this.pauseGame);
    pauseBtn.addEventListener('click', this.switchScreen);
    // const newGameBtn = document.createElement('button');
    // newGameBtn.innerText = 'New game';
    // document.body.prepend(newGameBtn);
    // newGameBtn.addEventListener('click', this.startNewGame);
    // ------
    document.querySelectorAll('.nav-btn').forEach((button) => {
      button.addEventListener('click', this.switchScreen);
    });
    return this;
  }

  switchScreen = ({ target }) => {
    console.log(target);
    const currScreen = target.closest('.active');
    const nextScreen = document.querySelector(`[data-screen=${target.dataset.nextScreen}]`);
    console.log(currScreen, target.dataset.nextScreen, nextScreen);
    currScreen.classList.remove('active');
    currScreen.classList.add('hidden');
    nextScreen.classList.remove('hidden');
    nextScreen.classList.add('active');
    if (target.dataset.nextScreen === 'new-game') {
      this.startNewGame();
    }
  }

  pauseGame = () => {
    this.isStart = false;
    clearInterval(this.interval);
  };

  resumeGame = () => {
    if (!this.isStart) {
      this.isStart = true;
      this.startTime();
      // this.interval = setInterval(() => {
      //   this.time++;
      //   this.timer.innerText = `Time ${this.time}s`;
      // }, 1000);
    }
  };

  startTime = () => {
    this.seconds = 0;
    this.minutes = 0;
    this.interval = setInterval(() => {
      this.seconds++;
      if (this.seconds === 60) {
        this.seconds = 0;
        this.minutes += 1;
      }
      this.timer.innerText = `Time ${addZero(this.minutes)} : ${addZero(this.seconds)}`;
    }, 1000);
  }

  stopGame = () => {
    this.isStart = false;
    clearInterval(this.interval);
    this.seconds = 0;
    this.minutes = 0;
    this.timer.innerText = `Time ${addZero(this.minutes)} : ${addZero(this.seconds)}`;
  };

  startNewGame = () => {
    this.puzzle.clicks = 0;
    this.puzzle.updateMoveField();
    // for shuffle
    this.logArray = [];
    // this.counter = 0;
    this.isLast = '';
    // hhh
    this.stopGame();
    // this.resumeGame();
    while (this.puzzle.field.firstChild) {
      this.puzzle.field.removeChild(this.puzzle.field.firstChild);
    }
    // this.emptyCoords = { x: this.size - 1, y: this.size - 1 };
    // this.chipsArray = createChipsArray(this.size);
    // this.chipsArray = this.shuffle();
    this.puzzle.createElements(this.settings.gameMode);
    this.emptyCoords = this.puzzle.getEmptyCoords();
    console.log(this.emptyCoords);
    this.logArray = this.puzzle.createLogArray(this.emptyCoords, this.puzzle.size, 3);
    console.log(this.logArray);
    this.puzzle.shuffle(this.logArray, 3, this.resumeGame);
    // console.log(this.puzzle.isShuffling);
    // if (this.puzzle.isShuffling === false) {
    this.resumeGame();
    // }
    // this.emptyCoords = this.logArray[this.logArray.length - 1].dragElCoords;
    // this.clicks = 0;
    // this.gameTime = 0;
    // this.moves.innerText = `Moves ${this.clicks}`;
    document.addEventListener('mouseup', () => {
      this.puzzle.getMoves(this.isWin);
    });
    document.querySelectorAll('.chip').forEach((elem) => {
      elem.addEventListener('click', (event) => {
        this.puzzle.move(event, this.isWin);
      });
      // elem.addEventListener('mouseup', this.isWin);
    });
  };

  isWin = () => {
    const winState = [];
    for (let i = 0; i < this.puzzle.size ** 2; i++) {
      winState.push(i + 1);
    }
    let result = true;
    for (let i = 0; i < winState.length; i++) {
      if (this.puzzle.fieldState[i] !== winState[i]) {
        result = false;
      }
    }
    if (result) {
      console.log('win');
      new Win(this.gameBox)
        .getScreen(this.minutes, this.seconds, this.puzzle.clicks, this.puzzle.size);
      this.pauseGame();
      const currScreen = document.querySelector('.active');
      currScreen.classList.remove('active');
      currScreen.classList.add('hidden');
    }
  }
}

new Game().init();
