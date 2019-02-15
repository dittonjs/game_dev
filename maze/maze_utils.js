class Coord {
  constructor(x,y){
    this.x = x;
    this.y = y;
  }
}

class Player extends GameObject {
  constructor(startCell, game, parent){
    super(game, parent);
    this.currentCell = startCell;
    this.transform = new Transform(
      (this.currentCell.coord.x * this.game.cellWidth) + (this.game.cellWidth / 2),
      (this.currentCell.coord.y * this.game.cellWidth) + (this.game.cellWidth / 2)
    );
    this.movements = [];
  }

  mapInputToWall(key){
    switch (key) {
      case 'right':
        return 'right';

      case 'left':
        return 'left';

      case 'up':
       return 'top';

      case 'down':
        return 'bottom';

      default:
        return '';
    }
  }

  flipWall(wall){
    if(wall == 'left') return 'right';
    if(wall == 'right') return 'left';
    if(wall == 'top') return 'bottom';
    if(wall == 'bottom') return 'top';
  }

  moveTo(to, over){
    this.movements.push({to, over, progress: 0});
  }

  updateMovements(elapsedTime){
    const activeMovement = this.movements[0];
    if(!activeMovement) return;
    const xDistanceToGo = activeMovement.to.x - this.transform.x;
    const yDistanceToGo = activeMovement.to.y - this.transform.y;
    activeMovement.progress += elapsedTime;
    if(activeMovement.progress >= activeMovement.over){
      this.transform.x = activeMovement.to.x;
      this.transform.y = activeMovement.to.y;
      this.movements[0] = null;
      this.movements = _.compact(this.movements);
    } else {
      this.transform.x += xDistanceToGo * (activeMovement.progress / activeMovement.over);
      this.transform.y += yDistanceToGo * (activeMovement.progress / activeMovement.over);
    }

  }

  update(elapsedTime){
    _.each(this.game.readyInput, input => {
      let wall = this.mapInputToWall(input.key);
      const edge = _.find(this.currentCell.edges,
        edge => (edge.cellA == this.currentCell ? edge.sharedWall == wall : edge.sharedWall == this.flipWall(wall))
      );
      if(edge){
        this.currentCell.playerVisited = true;
        this.currentCell = this.currentCell == edge.cellA ? edge.cellB : edge.cellA;
        this.game.updateScore(this.currentCell.isOnPath);
        const to = new Transform(
          (this.currentCell.coord.x * this.game.cellWidth) + (this.game.cellWidth / 2),
          (this.currentCell.coord.y * this.game.cellWidth) + (this.game.cellWidth / 2)
        )

        this.moveTo(to, 100);
        if(this.currentCell == this.game.exitCell){
          this.game.endGame();
        }
        this.game.getHintCell();
      }
    });
    this.updateMovements(elapsedTime);
  }

  render(){
    this.game.graphics.drawCircle(
      this.transform,
      this.game.cellWidth / 3,
      {
        fillStyle: "#009688",
        strokeStyle: "#009688"
      }
    );
  }
}

class HintCell extends GameObject {
  constructor(...args){
    super(...args);
    this.currentCell = null;
    this.transform = new Transform(-10000, -10000);
    this.movements = [];
  }

  changeHintCell(cell){
    this.currentCell = cell;
    const to = new Transform(
      (this.currentCell.coord.x * this.game.cellWidth) + (this.game.cellWidth / 2),
      (this.currentCell.coord.y * this.game.cellWidth) + (this.game.cellWidth / 2)
    )
    this.moveTo(to, 100);
  }

  moveTo(to, over){
    this.movements.push({to, over, progress: 0});
  }

  updateMovements(elapsedTime){
    const activeMovement = this.movements[0];
    if(!activeMovement) return;
    const xDistanceToGo = activeMovement.to.x - this.transform.x;
    const yDistanceToGo = activeMovement.to.y - this.transform.y;
    activeMovement.progress += elapsedTime;
    if(activeMovement.progress >= activeMovement.over){
      this.transform.x = activeMovement.to.x;
      this.transform.y = activeMovement.to.y;
      this.movements[0] = null;
      this.movements = _.compact(this.movements);
    } else {
      this.transform.x += xDistanceToGo * (activeMovement.progress / activeMovement.over);
      this.transform.y += yDistanceToGo * (activeMovement.progress / activeMovement.over);
    }

  }

  update(elapsedTime){
    this.updateMovements(elapsedTime);
  }

  render(){
    this.game.shouldShowHint && this.game.graphics.drawCircle(
      this.transform,
      5,
      {
        fillStyle: "#2196F3",
        shouldStroke: false,
        shadowBlur: 20,
        shadowColor: "#2196F3"
      }
    )
  }
}

class Edge {
  constructor(cellA, cellB, sharedWall){
    this.cellA = cellA;
    this.cellB = cellB;
    this.sharedWall = sharedWall;
    this._removeDuplicateWall();
  }

  _removeDuplicateWall(){
    if(this.sharedWall == 'top'){ this.cellB.walls.bottom = null; }
    if(this.sharedWall == 'right'){ this.cellB.walls.left = null; }
    if(this.sharedWall == 'left'){ this.cellB.walls.right = null; }
    if(this.sharedWall == 'bottom'){ this.cellB.walls.top = null; }
  }

  removeWall(){
    if(this.sharedWall == 'top'){ this.cellA.walls.top = null; }
    if(this.sharedWall == 'right'){ this.cellA.walls.right = null; }
    if(this.sharedWall == 'left'){ this.cellA.walls.left = null; }
    if(this.sharedWall == 'bottom'){ this.cellA.walls.bottom = null; }
  }
}

class Wall extends GameObject{
  constructor(side, game, parent){ // top bottom left right
    super(game, parent);
    this.side = side;
  }
  render(context){
    if(this.side == 'top'){
      const from = new Transform(this.parent.coord.x * this.game.cellWidth, this.parent.coord.y * this.game.cellWidth);
      const to = new Transform((this.parent.coord.x * this.game.cellWidth) + this.game.cellWidth, (this.parent.coord.y * this.game.cellWidth));
      this.game.graphics.drawLine(from, to, { strokeStyle: "white" });
    }
    if(this.side == 'left'){
      const from = new Transform(this.parent.coord.x * this.game.cellWidth, this.parent.coord.y * this.game.cellWidth);
      const to = new Transform((this.parent.coord.x * this.game.cellWidth), (this.parent.coord.y * this.game.cellWidth) + this.game.cellWidth);
      this.game.graphics.drawLine(from, to, { strokeStyle: "white" });
    }
    if(this.side == 'right'){
      const from = new Transform((this.parent.coord.x * this.game.cellWidth) + this.game.cellWidth, this.parent.coord.y * this.game.cellWidth);
      const to = new Transform((this.parent.coord.x * this.game.cellWidth) + this.game.cellWidth, (this.parent.coord.y * this.game.cellWidth) + this.game.cellWidth);
      this.game.graphics.drawLine(from, to, { strokeStyle: "white" });
    }
    if(this.side == 'bottom'){
      const from = new Transform(this.parent.coord.x * this.game.cellWidth, (this.parent.coord.y * this.game.cellWidth) + this.game.cellWidth);
      const to = new Transform((this.parent.coord.x * this.game.cellWidth) + this.game.cellWidth, (this.parent.coord.y * this.game.cellWidth) + this.game.cellWidth);
      this.game.graphics.drawLine(from, to, { strokeStyle: "white" });
    }
  }
}

class Cell extends GameObject{
  constructor(coord, game, parent){
    super(game, parent);
    this.coord = coord;
    this.transform = new Transform(
      (this.coord.x * this.game.cellWidth) + (this.game.cellWidth / 2),
      (this.coord.y * this.game.cellWidth) + (this.game.cellWidth / 2)
    );
    this.visited = false;
    this.playerVisited = false;
    this.isOnPath = false;
    this.isExit = false;
    this.walls = {
      top: new Wall('top', game, this),
      bottom: new Wall('bottom', game, this),
      left: new Wall('left', game, this),
      right: new Wall('right', game, this),
    };
    this.edges = [];
  };

  addEdge(edge){
    this.edges.push(edge);
  }

  removeEdge(edge){
    _.remove(this.edges, edge);
  }

  render(context){
    _.each(this.walls, (wall) => wall && wall.render(context));
    this.game.shouldShowBreadcrumb && this.playerVisited && this.game.graphics.drawCircle(
      this.transform,
      2,
      {
        strokeStyle: "rgb(255,235,59)",
        fillStyle: "rgb(255,235,59)",
        shadowBlur: 20,
        shadowColor: "rgb(255,235,59)"
      }
    );
    this.isExit && this.game.graphics.drawRect(
      this.transform,
      this.game.cellWidth,
      this.game.cellWidth,
      {
        fillStyle: "#4CAF50",
        strokeStyle: null,
      }
    );
    this.isOnPath && this.game.shouldShowSolution && this.game.graphics.drawCircle(
      this.transform,
      2,
      {
        strokeStyle: "#F44336",
        fillStyle: "#F44336",
        shadowBlur: 20,
        shadowColor: "#F44336"
      }
    )
  }
}

class Timer extends GameObject {
  constructor(timeElement, ...args){
    super(...args);
    this.elapsedTime = 0;
    this.timeElement = timeElement;
  }

  getRenderableTime() {
    const minutes = Math.floor(this.elapsedTime / 60000);
    let seconds = ((this.elapsedTime % 60000) / 1000).toFixed(0);
    seconds == 60 && (seconds = 0);
    return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
  }

  update(elapsedTime){
    this.elapsedTime += elapsedTime;
  }

  render(){
    // this is hacky but its so the time doesnt keep updating when you finish
    this.game.acceptInput && (this.timeElement.innerHTML = this.getRenderableTime());
  }
}

function getAndReferenceEdges(cells){
  let edges = [];
  _.each(cells, (cell) => {
    if(!cell.visited){
      _.each(cells, (adjCell) => {
        if(adjCell.coord.y == cell.coord.y && (adjCell.coord.x == cell.coord.x + 1 || adjCell.coord.x == cell.coord.x - 1)) {
          const sharedWall = adjCell.coord.x == cell.coord.x + 1 ? 'right' : 'left';
          const edge = new Edge(cell, adjCell, sharedWall);
          edges.push(edge);
          cell.addEdge(edge);
          adjCell.addEdge(edge);
          adjCell.visited = true;
        }
        if(adjCell.coord.x == cell.coord.x && (adjCell.coord.y == cell.coord.y + 1 || adjCell.coord.y == cell.coord.y - 1)) {
          const sharedWall = adjCell.coord.y == cell.coord.y + 1 ? 'bottom' : 'top';
          const edge = new Edge(cell, adjCell, sharedWall);
          cell.addEdge(edge);
          edges.push(edge);
          adjCell.addEdge(edge);
          adjCell.visited = true;
        }
      });
      cell.visited = true;
    }
  });
  resetVisit(cells);
  return edges;
}

function getCellSets(cells){
  return _.map(cells, cell => [cell]);
}

function resetVisit(cells){
  _.each(cells, cell => { cell.visited = false; });
}

function randomKruskals(edges, cellSets){
  let edgesCopy
  if(edges.length == 0) return _.flatten(cellSets);
  const randomIndex = random(edges.length);
  const edge = edges[randomIndex];
  const indecies = getSetIndecies(edge.cellA, edge.cellB, cellSets);
  if(indecies[0] != indecies[1]){
    newSets = joinSets(indecies, cellSets)
    edge.removeWall()
    edges[randomIndex] = null;
    return randomKruskals(_.compact(edges), newSets);
  } else {
    edge.cellA.removeEdge(edge);
    edge.cellB.removeEdge(edge);
    edges[randomIndex] = null;
    return randomKruskals(_.compact(edges), cellSets);
  }
}


function getSetIndecies(cell1, cell2, cellSets){
  let indecies = [];
  indecies.push(_.findIndex(cellSets, set => _.includes(set, cell1)));
  indecies.push(_.findIndex(cellSets, set => _.includes(set, cell2)));
  return indecies;
}

function joinSets(indecies, cellSets){
  cellSets[indecies[0]] = [...cellSets[indecies[0]], ...cellSets[indecies[1]]];
  cellSets[indecies[1]] = null;
  return _.compact(cellSets);
};

function random(top){
  return Math.floor((Math.random() * top));
}

function timer(func, funcName){
  const t0 = performance.now();
  const returnVal = func();
  const t1 = performance.now();
  console.log('================================================');
  console.log(`Function: (${funcName}) took ${t1-t0}ms to run`);
  console.log('================================================');
  return returnVal;
}

function shortestPath(start, end){
  const priorityQueue = [{previous: null, distance: 0, node: start}];
  let i = 0;
  while(i < priorityQueue.length){
    const element = priorityQueue[i];
    element.node.visited = true;
    if(element.node == end){
      let nodes = [element.node];
      let previous = element.previous;
      while(previous != null){
        nodes.push(previous.node);
        previous = previous.previous; //kinda weird but make sense semantically
      }
      return nodes;
    }
    _.each(element.node.edges, (edge)=>{
      const cellKey = edge.cellA == element.node ? 'cellB' : 'cellA';
      !edge[cellKey].visited && priorityQueue.push({
        previous: element,
        distance: element.distance + 1,
        node: edge[cellKey],
      });
    });
    i++;
  }
  throw("for some reason this maze has no solution");
}
