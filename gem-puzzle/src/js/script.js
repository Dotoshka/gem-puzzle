/* eslint-disable no-param-reassign */

import '../styles/styles.css';

// const swap = (arr, i1, i2, j1, j2) => {
//   const temp = arr[i1][j1];
//   arr[i1][j1] = arr[i2][j2];
//   arr[i2][j2] = temp;
// };

class Game {
  constructor(size) {
    this.size = size;
    // this.field = createField();
    // this.chips = createChips();
    this.chipsArray = this.createChipsArray(size);
    console.log(this.chipsArray);
  }

  init() {
    this.field = document.createElement('div');
    this.field.classList.add('field');
    this.field.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
    this.field.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;
    document.body.prepend(this.field);
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.chip = document.createElement('div');
        this.chip.classList.add('chip');
        this.field.appendChild(this.chip);
        this.chip.innerText = this.chipsArray[i][j];
        this.chip.dataset.number = this.chipsArray[i][j];
      }
    }
    if (this.chip.dataset.number === '0') {
      this.chip.classList.add('empty');
    }
    return this;
  }

  // eslint-disable-next-line class-methods-use-this
  createChipsArray(size) {
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
  }
}

const size = 4;
new Game(size).init();
