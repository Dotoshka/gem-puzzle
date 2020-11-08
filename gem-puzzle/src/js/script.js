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
    });
    // console.log(this.emptyCoords);
  }

  move = (event) => {
    const currChip = event.target;
    const currCoords = { x: currChip.dataset.index[0], y: currChip.dataset.index[2] };
    const emptyChip = document.querySelector(`[data-index="${this.emptyCoords.x}-${this.emptyCoords.y}"]`);
    console.log(currChip);
    console.log(currCoords);
    console.log(emptyChip);
    if ((this.emptyCoords.x === currCoords.x && Math.abs(currCoords.y - this.emptyCoords.y) === 1)
    || (this.emptyCoords.y === currCoords.y && Math.abs(currCoords.x - this.emptyCoords.x) === 1)) {
      emptyChip.innerText = currChip.innerText;
      this.emptyCoords = currCoords;
      currChip.classList.add('empty');
      emptyChip.classList.remove('empty');
      console.log(this.emptyCoords);
    }
  }
}

const size = 4;
new Game(size).init().createElements();
