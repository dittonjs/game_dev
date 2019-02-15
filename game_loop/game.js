"use strict";

class GameEvent {
  constructor(name, interval, iterations) {
    this.name = name;
    this.interval = interval;
    this.iterations = iterations;
    this.ready = false;
    this.elapsedTime = 0;
  }

  update(timeSinceLastUpdate) {
    this.elapsedTime += timeSinceLastUpdate;
    if (this.elapsedTime >= this.interval) {
      this.ready = true;
      this.elapsedTime = 0;
    }
    return this.ready;
  }

  fireAndCheckIfNeedsReload() {
    this.ready = false;
    this.elapsedTime = 0;
    this.iterations -= 1;
    return this.iterations !== 0;
  }
}

class Game {
  constructor(){
    this.activeEvents = {};
    this.elapsedTime = 0;
    this.gameLoop = this.gameLoop.bind(this)
    requestAnimationFrame(this.gameLoop);
    this.readyForFire = [];
  }

  addEvent(event){
    if (this.activeEvents[event.name]) {
      this.activeEvents[event.name] = event;
      return false;
    }
    this.activeEvents[event.name] = event;
    return true;
  }

  gameLoop(timestamp) {
    const timeSinceLastUpdate = timestamp - this.elapsedTime;
    this.elapsedTime = timestamp;
    this.update(timeSinceLastUpdate);
    this.render();
    requestAnimationFrame(this.gameLoop);
  }

  update(timeSinceLastUpdate){
    this.readyForFire = _.map(this.activeEvents, (event) => {
      if (event.update(timeSinceLastUpdate)) {
        return event;
      }
    });
    this.readyForFire = _.compact(this.readyForFire);
    _.each(this.readyForFire, (event) => {
      const needsReload = event.fireAndCheckIfNeedsReload();

      if(!needsReload){
        delete this.activeEvents[event.name];
      }
    });
  }

  render(){
    _.each(this.readyForFire, (event) => {
      const container = document.getElementById('output-container');
      container.innerHTML = `<div class="event-box">EVENT: ${event.name} (${event.iterations} remaining)</div>` + container.innerHTML;
      container.scrollTop = Infinity;
    });
  }
}

function validatePresence(e, field){
  if(!e.target.value || e.target.value === ''){
    document.getElementById('error-container').innerHTML = `<span id="${field}-presence-error">${field} cannot be blank.</span>`;
    return false;
  } else {
    const error = document.getElementById(`${field}-number-error`);
    if (error) {
      error.outerHTML = '';
    }
  }
  return true;
}

function validateNumber(e, field){
  if (isNaN(parseInt(e.target.value)) || parseInt(e.target.value) < 1) {
    document.getElementById('error-container').innerHTML = `<span id="${field}-number-error">${field} must be a number greater than 0.</span>`;
    return false;
  } else {
    const error = document.getElementById(`${field}-number-error`);
    if (error) {
      error.outerHTML = "";
    }
  }
  return true;
}

(function(){
  const nameInput = document.getElementById('name-input');
  const intervalInput = document.getElementById('interval-input');
  const iterationInput = document.getElementById('iteration-input');
  const createButton = document.getElementById('create-button');
  const game = new Game();
  nameInput.addEventListener('blur', (e) => {
    validatePresence(e, 'Name');
  });

  intervalInput.addEventListener('blur', (e) => {
    validatePresence(e, 'Interval');
    validateNumber(e, 'Interval');
  });

  iterationInput.addEventListener('blur', (e) => {
    validatePresence(e, 'Iteration');
    validateNumber(e, 'Iteration');
  });

  createButton.addEventListener('click', (e) => {
    const allIsWell = validatePresence({target: nameInput}, 'Name') &&
                      validatePresence({target: intervalInput}, 'Interval') &&
                      validatePresence({target: iterationInput}, 'Iteration') &&
                      validateNumber({target: intervalInput}, 'Interval') &&
                      validateNumber({target: iterationInput}, 'Iteration');
    if(allIsWell){
      document.getElementById('error-container').innerHTML =  '';
      const newEvent = new GameEvent(
        nameInput.value,
        parseInt(intervalInput.value),
        parseInt(iterationInput.value)
      );
      game.addEvent(newEvent);

      document.getElementById('success-container').innerHTML =  '<span class="success">Successfully created event.</span>';
      nameInput.value = '';
      intervalInput.value = '';
      iterationInput.value = '';

      // test set timeouts have nothing to do with the game loop
      setTimeout(() => {
        const successes = document.getElementsByClassName('success')
        successes.length && (successes[0].className += ' color-success');
      }, 6000);

      setTimeout(() => {
        document.getElementById('success-container').innerHTML = '';
      }, 7000);

    }
  });

})();
