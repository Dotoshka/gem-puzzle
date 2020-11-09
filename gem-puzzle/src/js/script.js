/* eslint-disable no-param-reassign */

import '../styles/styles.css';

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
    // this.field = createField();
    // this.chips = createChips();
    this.chipsArray = createChipsArray(size);
    // console.log(this.chipsArray);
  }

  init() {
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
          this.emptyCoords = { x: chip.dataset.index[0], y: chip.dataset.index[2] };
        }
      }
    }
    this.chips = document.querySelectorAll('.chip');
    // console.log(this.chips);
    this.chips.forEach((elem) => {
      elem.addEventListener('click', this.move);
      // elem.addEventListener('transitionend', () => {
      //   console.log('HFHFHFHFHF');
      //   elem.style.transform = 'translate(0, 0)';
      // });
    });
    // console.log(this.emptyCoords);
  }

  move = (event) => {
    const currChip = event.target;
    const currCoords = { x: currChip.dataset.index[0], y: currChip.dataset.index[2] };
    const emptyChip = document.querySelector(`[data-index="${this.emptyCoords.x}-${this.emptyCoords.y}"]`);
    // console.log(currChip);
    // console.log(currCoords);
    // console.log(emptyChip);
    const change = () => {
      emptyChip.innerText = currChip.innerText;
      this.emptyCoords = currCoords;
      currChip.classList.add('empty');
      emptyChip.classList.remove('empty');
    };
    if (this.emptyCoords.x === currCoords.x && this.emptyCoords.y - currCoords.y === 1) {
      const animation = this.animateMoving(currChip, 'toRight');
      animation.addEventListener('finish', change);
    } else if (this.emptyCoords.x === currCoords.x && currCoords.y - this.emptyCoords.y === 1) {
      const animation = this.animateMoving(currChip, 'toLeft');
      animation.addEventListener('finish', change);
    } else if (this.emptyCoords.y === currCoords.y && currCoords.x - this.emptyCoords.x === 1) {
      const animation = this.animateMoving(currChip, 'up');
      animation.addEventListener('finish', change);
    } else if (this.emptyCoords.y === currCoords.y && this.emptyCoords.x - currCoords.x === 1) {
      const animation = this.animateMoving(currChip, 'down');
      animation.addEventListener('finish', change);
    }
  }

  animateMoving = (elem, direction) => {
    let keyframes = '';
    const options = 100;
    switch (direction) {
      case 'toRight':
        keyframes = [{ transform: 'translate(0)' },
          { transform: `translate(${elem.offsetWidth}px, 0)` }];
        break;
      case 'toLeft':
        keyframes = [{ transform: 'translate(0)' },
          { transform: `translate(-${elem.offsetWidth}px, 0)` }];
        break;
      case 'up':
        keyframes = [{ transform: 'translate(0)' },
          { transform: `translate(0, -${elem.offsetHeight}px)` }];
        break;
      case 'down':
        keyframes = [{ transform: 'translate(0)' },
          { transform: `translate(0, ${elem.offsetHeight}px)` }];
        break;
      default:
        break;
    }
    return elem.animate(keyframes, options);
  }
}

const size = 4;
new Game(size).init().createElements();
