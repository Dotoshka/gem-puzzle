/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
import DragManager from './DragManager';
import exchange from './utils/exchange';
import bgImages from './images';
import moveSound from '../assets/sounds/move_sound.wav';

export default class Puzzle {
  constructor(size, container, movesContainer) {
    this.container = container;
    this.movesContainer = movesContainer;
    this.size = size;
    this.isShuffling = false;
    this.clicks = 0;
    this.counter = 0;
    this.fieldState = [];
  }

  init() {
    // Create field
    this.field = document.createElement('div');
    this.field.classList.add('field');
    this.field.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
    this.field.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;
    this.container.appendChild(this.field);
    // Create moves field
    this.moves = document.createElement('div');
    this.movesContainer.appendChild(this.moves);
    this.updateMoveField();
    // Add drag-n-drop manager
    this.dragMan = new DragManager(this.field).init();
    this.moveAudio = document.createElement('audio');
    this.moveAudio.src = moveSound;
    document.body.appendChild(this.moveAudio);
    document.addEventListener('mousedown', (event) => {
      if (this.isShuffling) return;
      this.dragMan.onMouseDown(event);
    });
    return this;
  }

  createElements(gameMode) {
    // Create chips
    this.bgImgIndex = this.getBgIndex();
    let chip = '';
    for (let i = 0, k = 1; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        chip = document.createElement('div');
        chip.classList.add('chip');
        chip.classList.add('draggable');
        chip.innerText = k;
        chip.dataset.index = `${i}-${j}`;
        // Set background
        if (gameMode === 'images') {
          const bgPosition = `${-(j * (this.field.offsetWidth / this.size))}px 
          ${-(i * (this.field.offsetHeight / this.size))}px`;
          chip.style.background = `url(${bgImages[this.bgImgIndex]})`;
          chip.style.backgroundSize = '320px 320px';
          chip.style.backgroundPosition = bgPosition;
          chip.style.color = 'transparent';
        }
        // ---
        this.field.appendChild(chip);
        if (k === this.size ** 2) {
          chip.classList.add('empty');
        }
        k++;
      }
    }
    this.chips = document.querySelectorAll('.chip');
    this.chips.forEach((elem) => {
      elem.style.width = window.getComputedStyle(chip).width;
      elem.style.height = window.getComputedStyle(chip).height;
    });
    this.emptyChip = document.querySelector('.empty');
    this.emptyCoords = this.getEmptyCoords();
  }

  getBgIndex() {
    const index = Math.floor(Math.random() * Math.floor(bgImages.length));
    return index;
  }

  shuffle = (stepsArray, iterations) => {
    this.isShuffling = true;
    const { dragElCoords } = stepsArray[this.counter];
    const dragEl = document.querySelector(`[data-index="${dragElCoords.x}-${dragElCoords.y}"]`);
    const dropEl = document.querySelector('.empty');
    // const animation = this.animateMoving(dragEl);
    // animation.addEventListener('finish', () => {
    exchange(dragEl, dropEl, this.field);
    this.counter++;
    if (this.counter < iterations) {
      this.shuffle(stepsArray, iterations);
    } else if (this.counter === iterations) {
      this.isShuffling = false;
      this.counter = 0;
    }
    // });
  }

  move = (event, cb, soundMode) => {
    if (this.isShuffling) return;
    const currChip = event.target;
    if (!currChip) return;
    const currCoords = {
      x: parseFloat(currChip.dataset.index[0]),
      y: parseFloat(currChip.dataset.index[2]),
    };
    this.emptyCoords = this.getEmptyCoords();
    const change = () => {
      this.logArray.push({
        dragElCoords: currCoords,
        dropElCoords: this.emptyCoords,
      });
      exchange(currChip, this.emptyChip, this.field);
      this.clicks++;
      this.updateMoveField();
      this.fieldState = this.getFieldState();
      cb();
    };
    if (
      (this.emptyCoords.x === currCoords.x
      && Math.abs(this.emptyCoords.y - currCoords.y) === 1)
      || (this.emptyCoords.y === currCoords.y
      && Math.abs(currCoords.x - this.emptyCoords.x) === 1)
    ) {
      if (soundMode === 'on') {
        this.playSound();
      }
      const animation = this.animateMoving(currChip);
      animation.addEventListener('finish', change);
    }
  };

  getMoves = (cb, soundMode) => {
    if (this.dragMan.isMoved) {
      if (soundMode === 'on') {
        this.playSound();
      }
      this.clicks++;
      this.updateMoveField();
      this.fieldState = this.getFieldState();
      this.logArray.push({
        dragElCoords: this.dragMan.dragCoords,
        dropElCoords: this.dragMan.dropCoords,
      });
      cb();
    }
  };

  getFieldState = () => {
    const fieldState = [];
    this.field.childNodes.forEach((child) => {
      fieldState.push(parseFloat(child.innerText));
    });
    return fieldState;
  }

  updateMoveField = () => {
    this.moves.innerText = `Moves ${this.clicks}`;
  }

  animateMoving = (activeEl) => {
    const options = 50;
    const activeElPosition = activeEl.getBoundingClientRect();
    const emptyElPosition = this.emptyChip.getBoundingClientRect();
    const distanceX = emptyElPosition.left - activeElPosition.left;
    const distanceY = emptyElPosition.top - activeElPosition.top;
    const keyframes = [
      { transform: 'translate(0)' },
      { transform: `translate(${distanceX}px, ${distanceY}px)` },
    ];
    return activeEl.animate(keyframes, options);
  };

  createLogArray = (curEmptyCoords, size, iterations) => {
    this.logArray = [];
    let newEmptyCoords = curEmptyCoords;
    let count = 0;
    while (count < iterations) {
      const currX = parseFloat(newEmptyCoords.x);
      const currY = parseFloat(newEmptyCoords.y);
      let emptyChipCoords = { x: currX, y: currY };
      const leftChipCoords = { x: currX, y: currY - 1 };
      const rightChipCoords = { x: currX, y: currY + 1 };
      const upChipCoords = { x: currX - 1, y: currY };
      const downChipCoords = { x: currX + 1, y: currY };
      const rand = Math.round(3 * Math.random());
      switch (rand) {
        case 0:
          if (upChipCoords.x >= 0 && this.isLast !== 'down') {
            count++;
            this.isLast = 'up';
            this.logArray.push({
              dragElCoords: upChipCoords,
              dropElCoords: emptyChipCoords,
            });
            emptyChipCoords = upChipCoords;
          }
          break; // to up
        case 1:
          if (rightChipCoords.y < size && this.isLast !== 'left') {
            count++;
            this.isLast = 'right';
            this.logArray.push({
              dragElCoords: rightChipCoords,
              dropElCoords: emptyChipCoords,
            });
            emptyChipCoords = rightChipCoords;
          }
          break; // to right
        case 2:
          if (downChipCoords.x < size && this.isLast !== 'up') {
            count++;
            this.isLast = 'down';
            this.logArray.push({
              dragElCoords: downChipCoords,
              dropElCoords: emptyChipCoords,
            });
            emptyChipCoords = downChipCoords;
          }
          break; // to down
        case 3:
          if (leftChipCoords.y >= 0 && this.isLast !== 'right') {
            count++;
            this.isLast = 'left';
            this.logArray.push({
              dragElCoords: leftChipCoords,
              dropElCoords: emptyChipCoords,
            });
            emptyChipCoords = leftChipCoords;
          }
          break; // to left
        default:
          break;
      }
      newEmptyCoords = emptyChipCoords;
    }
    return this.logArray;
  };

  solve = (stepsArray, iterations) => {
    this.isShuffling = true;
    const { dropElCoords } = stepsArray[iterations];
    const dragEl = document.querySelector(`[data-index="${dropElCoords.x}-${dropElCoords.y}"]`);
    const dropEl = document.querySelector('.empty');
    const animation = this.animateMoving(dragEl);
    animation.addEventListener('finish', () => {
      exchange(dragEl, dropEl, this.field);
      if (iterations > 0) {
        this.solve(stepsArray, --iterations);
      }
    });
  };

  getEmptyCoords() {
    const emptyChip = document.querySelector('.empty');
    return {
      x: parseFloat(emptyChip.dataset.index[0]),
      y: parseFloat(emptyChip.dataset.index[2]),
    };
  }

  playSound = () => {
    this.moveAudio.currentTime = 0;
    this.moveAudio.play();
  }
}
