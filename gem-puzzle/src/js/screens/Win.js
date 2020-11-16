export default class Win {
  constructor(container) {
    this.container = container;
  }

  getScreen = (minutes, seconds, moves, size) => {
    // Create container and title
    this.winContainer = document.createElement('div');
    this.winContainer.classList.add('win-container');
    this.winContainer.dataset.screen = 'win';
    this.winContainer.classList.add('active');
    this.container.appendChild(this.winContainer);
    this.screenTitle = document.createElement('h2');
    this.screenTitle.innerText = 'Congratulations!';
    this.winContainer.appendChild(this.screenTitle);
    // Create description
    const winDescription = document.createElement('p');
    winDescription.innerText = `You won the game in ${moves} moves! You've spent ${minutes} min ${seconds} sec and you solved ${size}x${size} puzzle!`;
    this.winContainer.appendChild(winDescription);
    // Create Go back button
    const goBackBtn = document.createElement('button');
    goBackBtn.classList.add('nav-btn');
    goBackBtn.dataset.nextScreen = 'menu';
    goBackBtn.innerText = 'Go back';
    this.winContainer.appendChild(goBackBtn);
    goBackBtn.addEventListener('click', this.close);
  }

  close = () => {
    this.winContainer.remove();
    const nextScreen = document.querySelector('[data-screen=menu]');
    nextScreen.classList.remove('hidden');
    nextScreen.classList.add('active');
  }
}
