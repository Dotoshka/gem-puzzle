const buttons = [
  { name: 'New game', nextScreen: 'game' },
  { name: 'Continue', nextScreen: 'game' },
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
      if (buttons[i].name === 'New game') {
        button.dataset.start = 'new';
      } else if (buttons[i].name === 'Continue') {
        button.dataset.start = 'load';
      }
      this.menuContainer.appendChild(button);
    }
  }
}
