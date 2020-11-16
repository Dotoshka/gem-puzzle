/* eslint-disable class-methods-use-this */
const fields = [
  { size: 3, name: 'Easy' },
  { size: 4, name: 'Classic' },
  { size: 5, name: 'Hard' },
  { size: 6, name: 'Very hard' },
  { size: 7, name: 'Expert' },
  { size: 8, name: 'Pro' },
];

const modes = [
  { mode: 'images', name: 'Images' },
  { mode: 'numbers', name: 'Numbers' },
];

export default class Settings {
  constructor(container) {
    this.container = container;
  }

  get fieldSize() {
    return localStorage.getItem('field-size') || '4';
  }

  set fieldSize(val) {
    localStorage.setItem('field-size', val);
  }

  get gameMode() {
    return localStorage.getItem('game-mode') || 'images';
  }

  set gameMode(val) {
    localStorage.setItem('game-mode', val);
  }

  getScreen = () => {
    // Create container and title
    this.settingsContainer = document.createElement('div');
    this.settingsContainer.classList.add('settings-container');
    this.settingsContainer.dataset.screen = 'settings';
    this.settingsContainer.classList.add('hidden');
    this.container.appendChild(this.settingsContainer);
    this.screenTitle = document.createElement('h2');
    this.screenTitle.innerText = 'Settings';
    this.settingsContainer.appendChild(this.screenTitle);
    // Create field options
    this.sizeSelectTitle = document.createElement('h3');
    this.sizeSelectTitle.innerText = 'Field size';
    this.settingsContainer.appendChild(this.sizeSelectTitle);
    this.sizeSelect = document.createElement('select');
    this.sizeSelect.classList.add('field-size');
    this.settingsContainer.appendChild(this.sizeSelect);
    for (let i = 0; i < fields.length; i++) {
      let option = '';
      option = document.createElement('option');
      option.classList.add('size-value');
      option.setAttribute('value', fields[i].size);
      option.innerText = `${fields[i].name} (${fields[i].size}✕${fields[i].size})`;
      this.sizeSelect.appendChild(option);
    }
    this.sizeSelect.value = this.fieldSize;
    this.sizeSelect.onchange = this.changeSize;
    // Create game mode options
    this.modeSelectTitle = document.createElement('h3');
    this.modeSelectTitle.innerText = 'Game mode';
    this.settingsContainer.appendChild(this.modeSelectTitle);
    this.modeSelect = document.createElement('select');
    this.modeSelect.classList.add('game-mode');
    this.settingsContainer.appendChild(this.modeSelect);
    for (let i = 0; i < modes.length; i++) {
      let option = '';
      option = document.createElement('option');
      option.classList.add('mode-value');
      option.setAttribute('value', modes[i].mode);
      option.innerText = modes[i].name;
      this.modeSelect.appendChild(option);
    }
    this.modeSelect.value = this.gameMode;
    this.modeSelect.onchange = this.changeMode;
    // Create sound options
    // Create Go back button
    const goBackBtn = document.createElement('button');
    goBackBtn.classList.add('nav-btn');
    goBackBtn.dataset.nextScreen = 'menu';
    goBackBtn.innerText = 'Go back';
    this.settingsContainer.appendChild(goBackBtn);
    return this;
  }

  changeSize = () => {
    this.fieldSize = this.sizeSelect.value;
    this.updateField();
  }

  changeMode = () => {
    this.gameMode = this.modeSelect.value;
    this.updateField();
  }
}
