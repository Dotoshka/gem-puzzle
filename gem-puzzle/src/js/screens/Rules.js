export default class Rules {
  constructor(container) {
    this.container = container;
  }

  getScreen = () => {
    // Create container and title
    this.rulesContainer = document.createElement('div');
    this.rulesContainer.classList.add('rules-container');
    this.rulesContainer.dataset.screen = 'rules';
    this.rulesContainer.classList.add('hidden');
    this.container.appendChild(this.rulesContainer);
    this.screenTitle = document.createElement('h2');
    this.screenTitle.innerText = 'Rules';
    this.rulesContainer.appendChild(this.screenTitle);
    // Create description
    let rulesDescription = document.createElement('p');
    rulesDescription.innerText = 'The object of the puzzle is to place the tiles in order by making sliding moves that use the empty space.';
    this.rulesContainer.appendChild(rulesDescription);
    rulesDescription = document.createElement('p');
    rulesDescription.innerText = 'The current game for the selected field size will be saved automatically when you press the PAUSE button';
    this.rulesContainer.appendChild(rulesDescription);
    // Create Go back button
    const goBackBtn = document.createElement('button');
    goBackBtn.classList.add('nav-btn');
    goBackBtn.dataset.nextScreen = 'menu';
    goBackBtn.innerText = 'Go back';
    this.rulesContainer.appendChild(goBackBtn);
  }
}
