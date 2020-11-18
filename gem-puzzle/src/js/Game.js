/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */

import '../styles/styles.css';
import bgImg from '../assets/images/bg.jpg';
import Menu from './screens/Menu';
import Rules from './screens/Rules';
import Settings from './screens/Settings';
import Puzzle from './Puzzle';
import Win from './screens/Win';
import Scores from './screens/Scores';

function addZero(number) {
  return (parseInt(number, 10) < 10 ? '0' : '') + number;
}

class Game {
  constructor() {
    this.seconds = 0;
    this.minutes = 0;
    this.isStart = false;
  }

  init() {
    document.body.style.background = `url(${bgImg})`;
    const title = document.createElement('h1');
    title.innerText = 'FIFTEEN PUZZLE';
    document.body.appendChild(title);
    this.gameBox = document.createElement('div');
    this.gameBox.classList.add('game-box');
    document.body.appendChild(this.gameBox);
    // ---
    this.gameContainer = document.createElement('div');
    this.gameContainer.classList.add('game-container');
    this.gameContainer.dataset.screen = 'new-game';
    this.gameBox.appendChild(this.gameContainer);
    this.gameContainer.classList.add('hidden');
    // ---
    this.gamePanel = document.createElement('div');
    this.gamePanel.classList.add('game-panel');
    this.gameContainer.prepend(this.gamePanel);
    this.timer = document.createElement('div');
    this.gamePanel.prepend(this.timer);
    this.timer.innerText = `Time ${addZero(this.minutes)} : ${addZero(this.seconds)}`;
    new Menu(this.gameBox).getScreen();
    new Rules(this.gameBox).getScreen();
    // Init Settings
    Settings.prototype.updateField = () => {
      this.puzzle.field.remove();
      this.puzzle.moves.remove();
      this.puzzle = new Puzzle(this.settings.fieldSize, this.gameContainer, this.gamePanel).init();
      this.scores.getScreen(this.settings.fieldSize);
    };
    this.settings = new Settings(this.gameBox).getScreen();
    this.puzzle = new Puzzle(this.settings.fieldSize, this.gameContainer, this.gamePanel).init();
    this.scores = new Scores(this.gameBox);
    this.scores.getScreen(this.settings.fieldSize);
    // ---
    this.gameButtons = document.createElement('div');
    this.gameButtons.classList.add('game-btns');
    this.gameContainer.appendChild(this.gameButtons);
    const pauseBtn = document.createElement('button');
    pauseBtn.innerText = 'Pause';
    pauseBtn.dataset.nextScreen = 'menu';
    this.gameButtons.prepend(pauseBtn);
    pauseBtn.addEventListener('click', () => {
      this.pauseGame();
      this.saveGame();
    });
    pauseBtn.addEventListener('click', this.switchScreen);
    this.solveBtn = document.createElement('button');
    this.solveBtn.innerText = 'Give up';
    this.gameButtons.appendChild(this.solveBtn);
    this.solveBtn.addEventListener('click', this.finishGame);
    // ------
    document.querySelectorAll('.nav-btn').forEach((button) => {
      button.addEventListener('click', this.switchScreen);
      if (button.dataset.nextScreen === 'continue-game') {
        button.setAttribute('disabled', 'true');
      }
    });
    document.addEventListener('mouseup', () => {
      this.puzzle.getMoves(this.isWin, this.settings.sound);
    });
    return this;
  }

  switchScreen = ({ target }) => {
    const currScreen = target.closest('.active');
    const nextScreen = document.querySelector(`[data-screen=${target.dataset.nextScreen}]`);
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
    this.solveBtn.removeAttribute('disabled');
    this.isLast = '';
    this.stopGame();
    while (this.puzzle.field.firstChild) {
      this.puzzle.field.removeChild(this.puzzle.field.firstChild);
    }
    this.puzzle.createElements(this.settings.gameMode);
    this.emptyCoords = this.puzzle.getEmptyCoords();
    const numberOfShuffles = this.puzzle.size * 50;
    this.puzzle.createLogArray(this.emptyCoords, this.puzzle.size, numberOfShuffles);
    this.puzzle.shuffle(this.puzzle.logArray, numberOfShuffles);
    this.puzzle.clicks = 0;
    this.puzzle.updateMoveField();
    this.resumeGame();
    document.querySelectorAll('.chip').forEach((elem) => {
      elem.addEventListener('click', (event) => {
        this.puzzle.move(event, this.isWin, this.settings.sound);
      });
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
      new Win(this.gameBox)
        .getScreen(this.minutes, this.seconds, this.puzzle.clicks, this.puzzle.size);
      this.pauseGame();
      const currScreen = document.querySelector('.active');
      currScreen.classList.remove('active');
      currScreen.classList.add('hidden');
      const scores = JSON.parse(localStorage.getItem('scores') || '[]');
      const currDate = `${addZero(new Date().getDate())}.${addZero(new Date().getMonth() + 1)}.${new Date().getFullYear()}`;
      scores.push([this.puzzle.size, currDate, this.puzzle.clicks, this.minutes, this.seconds]);
      localStorage.setItem('scores', JSON.stringify(scores));
      this.scores.getScreen(this.settings.fieldSize);
    }
  }

  finishGame = () => {
    this.solveBtn.setAttribute('disabled', 'true');
    this.pauseGame();
    const iterations = this.puzzle.logArray.length - 1;
    this.puzzle.solve(this.puzzle.logArray, iterations);
  }

  optimizeArray = (arr) => {
    for (let i = 0; i < arr.length - 1; i++) {
      if ((arr[i].dragElCoords === arr[i + 1].dropElCoords)
      && (arr[i].dropElCoords === arr[i + 1].dragElCoords)) {
        arr.splice(arr[i], 2);
        i--;
      }
    }
    return arr;
  }

  saveGame() {
    const value = {
      field: this.puzzle.fieldState,
      mins: this.minutes,
      secs: this.seconds,
      moves: this.puzzle.clicks,
      size: this.puzzle.size,
      bg: this.puzzle.bgImgIndex,
    };
    localStorage.setItem('saved-game', JSON.stringify(value));
  }
}

new Game().init();
