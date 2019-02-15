class Transform {
  constructor(x, y, rotation){
    this.x = x;
    this.y = y;
    this.rotation = rotation;
  }
}

class GameObject {

  constructor(game, parent){
    this.transform = new Transform(0,0);
    this.game = game;
    this.parent = parent;
  }

  awake(){}

  update(elapsedTime){}

  render(context){};
}

class Game {
  constructor(canvas){
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.graphics = new JdCanvasApi(this.context);
    this.pendingInput = [];
    this.readyInput = [];
    this.gameObjects = [];
    this.staticGameObjects = [];
    this.elapsedTime = 0;
    this.shouldContinue = true;
    this.gameLoop = this.gameLoop.bind(this);
    this.resetTimestamp = true;
  }

  awake(){
    this.start();
  }

  start(){
    requestAnimationFrame(this.gameLoop);
  }

  stop(){
    this.shouldContinue = false;
  }

  gameLoop(timestamp) {
    if(this.resetTimestamp){
      this.elapsedTime = timestamp;
      this.resetTimestamp = false;
      requestAnimationFrame(this.gameLoop);
      return;
    }
    const timeSinceLastUpdate = timestamp - this.elapsedTime;
    this.elapsedTime = timestamp;
    this.getInput();
    this.update(timeSinceLastUpdate);
    this.render();
    this.clearInput();
    this.shouldContinue && requestAnimationFrame(this.gameLoop);
  }

  getInput(){
    this.readyInput = [...this.pendingInput];
    this.pendingInput = [];
  }

  update(timeSinceLastUpdate){
    _.each(this.gameObjects, gameObject => gameObject.update(timeSinceLastUpdate));
  }

  render(){
    this.clearForRerender();
    _.each(this.staticGameObjects, gameObject => gameObject.render(this.context));
    _.each(this.gameObjects, gameObject => gameObject.render(this.context));
  }

  clearForRerender(){
    this.context.save();
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();
  }

  clearInput(){
    this.readyInput = [];
  }

  instantiate(gameObject, isStatic, constructArgs = [], parent){
    const obj = new gameObject(...constructArgs, this, parent);
    if(isStatic){
      this.staticGameObjects.push(obj);
    } else {
      this.gameObjects.push(obj);
    }
    return obj;
  }
}
