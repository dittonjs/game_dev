function drawShortestPath(solutionCells, context, cellWidth) {
  _.each(solutionCells, (cell) => {
    context.beginPath();
    context.arc((cell.coord.x * cellWidth) + (cellWidth / 2), (cell.coord.y * cellWidth) + (cellWidth / 2), cellWidth / 3, 0, 2 * Math.PI, false);
    context.fill();
    context.stroke();
  });
}

class MazeGame extends Game {
  constructor(size, canvas){
    super(canvas);
    this.size = size;
    this.cells = [];
    this.edges = [];
    this.cellWidth = canvas.width / this.size;
    this.shouldShowSolution = false;
    this.exitCell = null;
    this.hintCell = null;
    this.shouldShowHint = false;
    this.shouldShowBreadcrumb = false;
    this.player = null;
    this.inputListener = this.inputListener.bind(this);
    this.highScores = MazeGame.highScores;
    this.awake();
  }

  awake(){
    this.setupInput();
    const cells = this.generateCells(this.size, this.size);
    this.edges = getAndReferenceEdges(cells);
    const cellSets = getCellSets(cells);
    this.cells = randomKruskals(this.edges, cellSets);
    resetVisit(this.cells);
    const topLeftCell = _.find(this.cells, cell => cell.coord.x == 0 && cell.coord.y == 0);
    this.player = this.instantiate(Player, false, [topLeftCell]);
    this.hintCell = this.instantiate(HintCell, false);
    this.instantiate(Timer, false, [document.getElementById('timer')]);
    this.exitCell = _.find(this.cells, cell => cell.coord.x == this.size - 1 && cell.coord.y == this.size - 1);
    this.exitCell.isExit = true;
    this.score = 0;
    this.acceptInput = true;
    const score = document.getElementById('score');
    score.innerHTML = `SCORE: ${this.score}`;
    this.getHintCell();
    super.awake();
    window.GAME = this;
  }

  getHintCell(){
    const path = shortestPath(this.player.currentCell, this.exitCell);
    this.resetSolutionCells(path);
    const shift = path.length >= 2 ? path.length - 2 : path.length - 1;
    this.hintCell.changeHintCell(path[shift]);
    resetVisit(this.cells);
  }

  resetSolutionCells(path){
    _.each(this.cells, cell => { cell.isOnPath = false; });
    _.each(path, cell => { cell.isOnPath = true; });
    // dont put a dot in the same cell the user is on
    path[path.length - 1].isOnPath = false;
  }

  toggleHint(){
    this.shouldShowHint = !this.shouldShowHint;
  }

  toggleSolution(){
    this.shouldShowSolution = !this.shouldShowSolution;
  }

  toggleBreadcrumb(){
    this.shouldShowBreadcrumb = !this.shouldShowBreadcrumb;
  }

  toggleScore(){
    const score = document.getElementById('score');
    if(score.className === 'hidden'){
      score.className = '';
    } else {
      score.className = 'hidden';
    }
  }

  updateScore(rightDirection){
    rightDirection && (this.score += 10);
    !rightDirection && (this.score -= 20);
    const score = document.getElementById('score');
    score.innerHTML = `SCORE: ${this.score}`;
  }

  setupInput(){
    window.addEventListener("keydown", this.inputListener);
  }

  endGame(){
    this.acceptInput = false;
    const modal = document.getElementById('start-modal')
    modal.className = 'start-modal';
    this.setHighScores();
    if(_.includes(MazeGame.highScores, this.score)){
      modal.innerHTML = "<h2>HIGH SCORE!</h2><div class='restart-message'>SELECT A SIZE TO PLAY AGAIN</div>"
    } else {
      modal.innerHTML = "<h2>YOU DID NOT GET A HIGH SCORE</h2><div class='restart-message'>SELECT A SIZE TO PLAY AGAIN</div>"
    }
  }

  setHighScores(){
    this.highScores.push(this.score);
    this.highScores = _.sortBy(this.highScores, score => score).slice(-5).reverse();
    MazeGame.highScores = this.highScores;
    const hsContainer = document.getElementById('high-score-container');
    hsContainer.innerHTML = "";
    _.each(MazeGame.highScores, (score)=>{
      hsContainer.innerHTML += `<div class="score">${score}</div>`;
    });
  }

  inputListener(e){
    e.preventDefault();
    if(!this.acceptInput) return;
    switch (e.keyCode) {
      case 38:
      case 87:
      case 73:
        this.pendingInput.push({key: 'up'});
        break;
      case 40:
      case 83:
      case 75:
        this.pendingInput.push({key: 'down'});
        break;
      case 37:
      case 65:
      case 74:
        this.pendingInput.push({key: 'left'});
        break;
      case 39:
      case 68:
      case 76:
        this.pendingInput.push({key: 'right'});
        break;
      case 72:
        this.toggleHint();
        break
      case 80:
        this.toggleSolution();
        break;
      case 66:
        this.toggleBreadcrumb();
        break;
      case 89:
        this.toggleScore();
        break
      default:
        break;
    }
  }

  generateCells(){
    let cells = [];
    for (var y = 0; y < this.size; y++) {
      for(var x = 0; x < this.size; x++) {
        cells.push(this.instantiate(Cell, true, [new Coord(x,y)]));
      }
    }
    return cells;
  }
}
MazeGame.highScores = []; // cuz static doesnt work in browser :(

function startGame(size){
  document.getElementById('start-modal').className = 'start-modal hide-modal';
  const canvas = document.getElementById('main-canvas');
  return new MazeGame(size, canvas);
};

(function(){
  let game;
  const five = document.getElementById('5-by-5');
  const ten = document.getElementById('10-by-10');
  const fifteen = document.getElementById('15-by-15');
  const twenty = document.getElementById('20-by-20');
  _.each([five,ten,fifteen,twenty], (thing, index)=>{
    const sizes = [5,10,15,20];
    thing.addEventListener('click', function(){
      game && game.stop();
      game = startGame(sizes[index]);
    });
  });
})();
