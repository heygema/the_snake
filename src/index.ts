let canvas = <HTMLCanvasElement>document.getElementById('vanGogh');
let context = canvas.getContext('2d');

const BASE_SIZE = 30;

function draw({X, Y}, score = 1, direction = 'RIGHT') {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  type SnakeBody = {
    X: number;
    Y: number;
  };

  let snakeBodies: Array<SnakeBody> = [];

  context.fillStyle = 'blue';
  context.fillRect(X, Y, BASE_SIZE, BASE_SIZE);
  // TODO: longer snake
  // context.fillRect(X + BASE_SIZE, Y, BASE_SIZE, BASE_SIZE);
}

type Collision = {};

function isCollide(X, Y): Collision {
  return {};
}

let createMovement = ({state, setState}) => (
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT',
) => {
  const STEP = 5;
  switch (direction) {
    case 'UP': {
      setState({Y: state.Y - STEP});
      break;
    }
    case 'DOWN': {
      setState({Y: state.Y + STEP});
      break;
    }
    case 'LEFT': {
      setState({X: state.X - STEP});
      break;
    }
    case 'RIGHT': {
      setState({X: state.X + STEP});
      break;
    }
    default: {
      break;
    }
  }
};

function getDirection(state) {
  switch (state.keyPressed) {
    /* 40 down, 38 up, 39 right, 37 left */
    case 38: {
      return 'UP';
    }
    case 40: {
      return 'DOWN';
    }
    case 37: {
      return 'LEFT';
    }
    case 39:
    default: {
      return 'RIGHT';
    }
  }
}

function Scene({state, setState, draw}) {
  return {
    state,
    setState,
    run(time = 0) {
      let {lastTime, X, Y, keyPressed, moveCounter, moveInterval} = this.state;

      const MAX_WIDTH = canvas.width;
      const MAX_HEIGHT = canvas.height;

      let deltaTime = time - lastTime;

      let move = createMovement({
        state: this.state,
        setState: this.setState.bind(this),
      });

      this.setState({
        lastTime: time,
        moveCounter: moveCounter + deltaTime,
      });

      if (moveCounter > moveInterval) {
        let direction = getDirection(this.state);
        if (X >= MAX_WIDTH) {
          this.setState({X: -BASE_SIZE});
        } else if (direction === 'LEFT' && X <= -BASE_SIZE) {
          this.setState({X: MAX_WIDTH - 1});
        } else if (Y >= MAX_HEIGHT) {
          this.setState({Y: -BASE_SIZE});
        } else if (direction === 'UP' && Y <= -BASE_SIZE) {
          this.setState({Y: MAX_HEIGHT - 1});
        } else {
          move(direction);
        }
        this.setState({moveCounter: 0});
      }
      draw({X, Y});
    },
  };
}

function DataStore(initState) {
  this.state = initState;
  this.getState = function() {
    return this.state;
  };
  this.setState = function(newState) {
    this.state = {...this.state, ...newState};
  };
}

/*
 * Starting with the semicolon is in case whatever line of code above this example
 * relied on automatic semicolon insertion (ASI). The browser could accidentally
 * think this whole example continues from the previous line. The leading semicolon
 * marks the beginning of our new line if the previous one was not empty or terminated.
 */

(function() {
  const INITIAL_STATE = {
    moveCounter: 0,
    moveInterval: 10,
    lastTime: 0,
    X: 0,
    Y: 0,
    /* 40 down, 38 up, 39 right, 37 left */
    keyPressed: null,
  };

  /*
  doesn't run here because the state is the initialized state
    */

  let game = new Scene({
    ...new DataStore(INITIAL_STATE),
    draw,
  });

  document.addEventListener('keydown', event => {
    game.setState({keyPressed: event.keyCode});
  });

  function main(time = 0) {
    window.requestAnimationFrame(main);

    // Your main loop contents

    game.run(time);
  }

  main(); // Start the cycle
})();
