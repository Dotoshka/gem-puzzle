/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
import DragManager from './DragManager';
import exchange from './utils/exchange';
import bgImages from './images';

export default class Puzzle {
  constructor(size, container, movesContainer) {
    this.container = container;
    this.movesContainer = movesContainer;
    this.size = size;
    this.isShuffling = false;
    this.clicks = 0;
    // this.dragMan = new DragManager().init();
    // document.addEventListener('mouseup', this.getMoves);
    this.counter = 0;
    this.fieldState = [];
    // this.isMoved = false;
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
    // document.addEventListener('mouseup', this.getMoves);
    return this;
  }

  createElements(gameMode) {
    // Create chips
    // console.log(bgImages);
    // const bgImgIndex = this.getBgIndex();
    // console.log(bgImgIndex);
    // this.clicks = 0;
    const bgImgIndex = this.getBgIndex();
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
          chip.style.background = `url(${bgImages[bgImgIndex]})`;
          chip.style.backgroundSize = '320px 320px';
          chip.style.backgroundPosition = bgPosition;
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
      // elem.addEventListener('click', this.move);
      // elem.addEventListener('mousedown', this.onMouseDown);
    });
    this.emptyChip = document.querySelector('.empty');
    this.emptyCoords = this.getEmptyCoords();
  }

  // getBgPosition(gameMode, i, j) {
  //   let bgPosition = '';
  //   if (gameMode === 'images') {
  //     bgPosition = `${-(j * (this.field.offsetWidth / this.size))}px
  //     ${-(i * (this.field.offsetHeight / this.size))}px`;
  //   }
  //   return bgPosition;
  // }

  getBgIndex() {
    const index = Math.floor(Math.random() * Math.floor(bgImages.length));
    return index;
  }

  shuffle = (stepsArray, iterations, callback) => {
    // console.log(this.logArray);
    // console.log(this.counter);
    this.isShuffling = true;
    const { dragElCoords } = stepsArray[this.counter];
    // const { dropElCoords } = stepsArray[this.counter];
    const dragEl = document.querySelector(`[data-index="${dragElCoords.x}-${dragElCoords.y}"]`);
    // const dropEl = document.querySelector(`[data-index="${dropElCoords.x}-${dropElCoords.y}"]`);
    const dropEl = document.querySelector('.empty');
    // console.log(dropEl);
    const animation = this.animateMoving(dragEl);
    animation.addEventListener('finish', () => {
      exchange(dragEl, dropEl, this.field);
      this.counter++;
      if (this.counter < iterations) {
        this.shuffle(stepsArray, iterations);
      } else if (this.counter === iterations) {
        if (callback) callback();
        console.log(callback);
        // callback();
        this.isShuffling = false;
        console.log(this.isShuffling);
        this.counter = 0;
      }
    });
  }

  move = (event, cb) => {
    if (this.isShuffling) return;
    const currChip = event.target;
    if (!currChip) return;
    const currCoords = {
      x: parseFloat(currChip.dataset.index[0]),
      y: parseFloat(currChip.dataset.index[2]),
    };
    this.emptyCoords = this.getEmptyCoords();
    const change = () => {
      exchange(currChip, this.emptyChip, this.field);
      this.clicks++;
      this.updateMoveField();
      this.fieldState = this.getFieldState();
      // this.isMoved = true;
      cb();
    };
    if (
      (this.emptyCoords.x === currCoords.x
      && Math.abs(this.emptyCoords.y - currCoords.y) === 1)
      || (this.emptyCoords.y === currCoords.y
      && Math.abs(currCoords.x - this.emptyCoords.x) === 1)
    ) {
      const animation = this.animateMoving(currChip);
      animation.addEventListener('finish', change);
    }
  };

  getMoves = (cb) => {
    if (this.dragMan.isMoved) {
      console.log('kuku');
      this.clicks++;
      this.updateMoveField();
      this.fieldState = this.getFieldState();
      cb();
      // this.isMoved = true;
    }
  };

  getFieldState = () => {
    const fieldState = [];
    this.field.childNodes.forEach((child) => {
      fieldState.push(parseFloat(child.innerText));
    });
    console.log(fieldState);
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
    const logArray = [];
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
            logArray.push({
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
            logArray.push({
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
            logArray.push({
              dragElCoords: downChipCoords,
              dropElCoords: emptyChipCoords,
            });
            emptyChipCoords = downChipCoords;
          }
          break; // to down
        case 3:
          if (leftChipCoords.y > 0 && this.isLast !== 'right') {
            count++;
            this.isLast = 'left';
            logArray.push({
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
    console.log(logArray);
    return logArray;
  };

  solve = () => {
    this.isShuffling = true;
    console.log(this.logArray[this.counter]);
    const { dragElCoords } = this.logArray[this.counter];
    // const { dropElCoords } = this.logArray[this.counter - 1];
    const dragEl = document.querySelector(`[data-index="${dragElCoords.x}-${dragElCoords.y}"]`);
    // const dropEl = document.querySelector(`[data-index="${dropElCoords.x}-${dropElCoords.y}"]`);
    const dropEl = document.querySelector('.empty');
    console.log(dragEl);
    console.log(dropEl);
    const animation = this.animateMoving(dragEl);
    animation.addEventListener('finish', () => {
      exchange(dragEl, dropEl, this.field);
      this.counter--;
      if (this.counter >= 0) {
        this.solve();
        console.log(this.counter);
      } else if (this.counter < 0) {
        this.isShuffling = false;
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
}
