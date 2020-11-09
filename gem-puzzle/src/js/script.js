/* eslint-disable no-param-reassign */

import '../styles/styles.css';

const swap = (arr, i1, j1, i2, j2) => {
  const temp = arr[i1][j1];
  arr[i1][j1] = arr[i2][j2];
  arr[i2][j2] = temp;
};

const createChipsArray = (size) => {
  const arr = [];
  for (let i = 0, k = 1; i < size; i++) {
    arr[i] = [];
    for (let j = 0; j < size; j++) {
      if (i === size - 1 && j === size - 1) {
        arr[i].push(0);
      } else {
        arr[i].push(k);
        k++;
      }
    }
  }
  return arr;
};

class Game {
  constructor(size) {
    this.size = size;
    this.clicks = 0;
    this.time = 0;
    this.isStart = false;
    // this.field = createField();
    // this.chips = createChips();
    this.emptyCoords = { x: this.size - 1, y: this.size - 1 };
    this.chipsArray = createChipsArray(size);
    this.chipsArray = this.shuffle();
    // console.log(this.chipsArray);
  }

  init() {
    // Temporary
    this.timer = document.createElement('div');
    document.body.prepend(this.timer);
    this.timer.innerText = `Time ${this.time}s`;
    this.moves = document.createElement('div');
    document.body.prepend(this.moves);
    this.moves.innerText = `Moves ${this.clicks}`;
    const resumeBtn = document.createElement('button');
    resumeBtn.innerText = 'Resume game';
    document.body.prepend(resumeBtn);
    resumeBtn.addEventListener('click', this.resumeGame);
    const pauseBtn = document.createElement('button');
    pauseBtn.innerText = 'Pause game';
    document.body.prepend(pauseBtn);
    pauseBtn.addEventListener('click', this.pauseGame);
    const newGameBtn = document.createElement('button');
    newGameBtn.innerText = 'New game';
    document.body.prepend(newGameBtn);
    newGameBtn.addEventListener('click', this.startNewGame);
    // ------
    this.field = document.createElement('div');
    this.field.classList.add('field');
    this.field.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
    this.field.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;
    document.body.prepend(this.field);
    return this;
  }

  createElements() {
    let chip = '';
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        chip = document.createElement('div');
        chip.classList.add('chip');
        chip.innerText = this.chipsArray[i][j];
        chip.dataset.index = `${i}-${j}`;
        this.field.appendChild(chip);
        if (chip.innerText === '0') {
          chip.classList.add('empty');
          this.emptyCoords = {
            x: chip.dataset.index[0],
            y: chip.dataset.index[2],
          };
        }
      }
    }
    this.chips = document.querySelectorAll('.chip');
    this.chips.forEach((elem) => {
      elem.addEventListener('click', this.move);
    });
  }

  shuffle = () => {
    const arr = this.chipsArray;
    let currX = this.emptyCoords.x;
    let currY = this.emptyCoords.y;
    for (let i = 0; i < 1500; i++) {
      switch (Math.round(3 * Math.random())) {
        case 0:
          if (currX !== 0) swap(arr, currX, currY, --currX, currY);
          break; // up
        case 1:
          if (currY !== 3) swap(arr, currX, currY, currX, ++currY);
          break; // right
        case 2:
          if (currX !== 3) swap(arr, currX, currY, ++currX, currY);
          break; // down
        case 3:
          if (currY !== 0) swap(arr, currX, currY, currX, --currY);
          break; // left
        default:
          break;
      }
    }
    return arr;
  };

  startNewGame = () => {
    this.stopGame();
    this.resumeGame();
    while (this.field.firstChild) {
      this.field.removeChild(this.field.firstChild);
    }
    this.emptyCoords = { x: this.size - 1, y: this.size - 1 };
    this.chipsArray = createChipsArray(this.size);
    this.chipsArray = this.shuffle();
    this.createElements();
    this.clicks = 0;
    this.gameTime = 0;
    this.moves.innerText = `Moves ${this.clicks}`;
  }

  pauseGame = () => {
    this.isStart = false;
    clearInterval(this.interval);
  }

  resumeGame = () => {
    if (!this.isStart) {
      this.isStart = true;
      this.interval = setInterval(() => {
        this.time++;
        this.timer.innerText = `Time ${this.time}s`;
      }, 1000);
    }
  }

  stopGame = () => {
    this.pauseGame();
    this.time = 0;
    this.timer.innerText = `Time ${this.time}s`;
  }

  move = (event) => {
    const currChip = event.target;
    if (!currChip) return;
    const currCoords = {
      x: currChip.dataset.index[0],
      y: currChip.dataset.index[2],
    };
    const emptyChip = document.querySelector(
      `[data-index="${this.emptyCoords.x}-${this.emptyCoords.y}"]`,
    );
    // console.log(currChip);
    // console.log(currCoords);
    // console.log(emptyChip);
    const change = () => {
      emptyChip.innerText = currChip.innerText;
      this.emptyCoords = currCoords;
      currChip.classList.add('empty');
      emptyChip.classList.remove('empty');
    };
    if (
      this.emptyCoords.x === currCoords.x
      && this.emptyCoords.y - currCoords.y === 1
    ) {
      const animation = this.animateMoving(currChip, 'toRight');
      animation.addEventListener('finish', change);
      this.clicks++;
    } else if (
      this.emptyCoords.x === currCoords.x
      && currCoords.y - this.emptyCoords.y === 1
    ) {
      const animation = this.animateMoving(currChip, 'toLeft');
      animation.addEventListener('finish', change);
      this.clicks++;
    } else if (
      this.emptyCoords.y === currCoords.y
      && currCoords.x - this.emptyCoords.x === 1
    ) {
      const animation = this.animateMoving(currChip, 'up');
      animation.addEventListener('finish', change);
      this.clicks++;
    } else if (
      this.emptyCoords.y === currCoords.y
      && this.emptyCoords.x - currCoords.x === 1
    ) {
      const animation = this.animateMoving(currChip, 'down');
      animation.addEventListener('finish', change);
      this.clicks++;
    } else {
      return;
    }
    this.moves.innerText = `Moves ${this.clicks}`;
  };

  animateMoving = (elem, direction) => {
    let keyframes = '';
    const options = 100;
    switch (direction) {
      case 'toRight':
        keyframes = [
          { transform: 'translate(0)' },
          { transform: `translate(${elem.offsetWidth}px, 0)` },
        ];
        break;
      case 'toLeft':
        keyframes = [
          { transform: 'translate(0)' },
          { transform: `translate(-${elem.offsetWidth}px, 0)` },
        ];
        break;
      case 'up':
        keyframes = [
          { transform: 'translate(0)' },
          { transform: `translate(0, -${elem.offsetHeight}px)` },
        ];
        break;
      case 'down':
        keyframes = [
          { transform: 'translate(0)' },
          { transform: `translate(0, ${elem.offsetHeight}px)` },
        ];
        break;
      default:
        break;
    }
    return elem.animate(keyframes, options);
  };
}

const size = 4;
new Game(size).init().createElements();
