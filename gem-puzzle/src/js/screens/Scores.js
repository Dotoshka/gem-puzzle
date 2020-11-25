function addZero(number) {
  return (parseInt(number, 10) < 10 ? '0' : '') + number;
}

export default class Rules {
  constructor(container) {
    this.container = container;
    // Create scores container
    this.scoresContainer = document.createElement('div');
    this.scoresContainer.classList.add('scores-container');
    this.scoresContainer.dataset.screen = 'scores';
    this.scoresContainer.classList.add('hidden');
    this.container.appendChild(this.scoresContainer);
    // Create title
    this.screenTitle = document.createElement('h2');
    this.scoresContainer.appendChild(this.screenTitle);
    // Create no results
    this.noResults = document.createElement('p');
    this.noResults.innerText = 'No results yet';
    this.scoresContainer.appendChild(this.noResults);
    // Create table
    this.resultsTable = document.createElement('table');
    this.scoresContainer.appendChild(this.resultsTable);
    // Create Go back button
    const goBackBtn = document.createElement('button');
    goBackBtn.classList.add('nav-btn');
    goBackBtn.dataset.nextScreen = 'menu';
    goBackBtn.innerText = 'Go back';
    this.scoresContainer.appendChild(goBackBtn);
  }

  getScreen = (size) => {
    // this.scoresContainer.innerHTML = '';
    this.noResults.style.display = 'none';
    this.resultsTable.innerHTML = '';
    this.screenTitle.innerText = `Best scores for ${size}x${size} size`;
    this.scores = JSON.parse(localStorage.getItem('scores') || '[]');
    const currScores = this.scores
      .filter((elem) => elem[0] === size)
      .sort((a, b) => a[2] - b[2])
      .slice(0, 10);
    if (currScores.length === 0) {
      this.noResults.style.display = 'block';
    } else {
      const headRow = document.createElement('tr');
      this.resultsTable.appendChild(headRow);
      const position = document.createElement('th');
      position.innerText = '#';
      headRow.appendChild(position);
      const date = document.createElement('th');
      date.innerText = 'Date';
      headRow.appendChild(date);
      const moves = document.createElement('th');
      moves.innerText = 'Moves';
      headRow.appendChild(moves);
      const time = document.createElement('th');
      time.innerText = 'Time';
      headRow.appendChild(time);
      let tr = '';
      let tdPosition = '';
      let tdDate = '';
      let tdMoves = '';
      let tdTime = '';
      for (let i = 0; i < currScores.length; i++) {
        tr = document.createElement('tr');
        tdPosition = document.createElement('td');
        tdPosition.innerText = `${i + 1}`;
        tdDate = document.createElement('td');
        tdDate.innerText = `${currScores[i][1]}`;
        tdMoves = document.createElement('td');
        tdMoves.innerText = `${currScores[i][2]}`;
        tdTime = document.createElement('td');
        tdTime.innerText = `${addZero(currScores[i][3])}:${addZero(currScores[i][4])}`;
        tr.appendChild(tdPosition);
        tr.appendChild(tdDate);
        tr.appendChild(tdMoves);
        tr.appendChild(tdTime);
        this.resultsTable.appendChild(tr);
      }
    }
  }
}
