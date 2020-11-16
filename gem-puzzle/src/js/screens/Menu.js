const buttons = [
  { name: 'New game', nextScreen: 'new-game' },
  { name: 'Continue', nextScreen: 'continue-game' },
  { name: 'Best scores', nextScreen: 'scores' },
  { name: 'Rules', nextScreen: 'rules' },
  { name: 'Settings', nextScreen: 'settings' },
];

export default class Menu {
  constructor(container) {
    this.container = container;
  }

  getScreen = () => {
    this.menuContainer = document.createElement('div');
    this.menuContainer.classList.add('menu-container');
    this.menuContainer.dataset.screen = 'menu';
    this.menuContainer.classList.add('active');
    this.container.appendChild(this.menuContainer);
    // ---
    for (let i = 0; i < buttons.length; i++) {
      let button = '';
      button = document.createElement('button');
      button.classList.add('nav-btn');
      button.dataset.nextScreen = buttons[i].nextScreen;
      button.innerText = buttons[i].name;
      this.menuContainer.appendChild(button);
    }
    // return this;
  }

  // open() {
  //   this.menuContainer.classList.add('active');
  //   this.menuContainer.classList.remove('hidden');
  // }

  // close() {
  //   this.menuContainer.classList.add('hidden');
  //   this.menuContainer.classList.remove('active');
  // }
}
