/*
Team Eikon - Spike Exercise - Snake Game

Purpose: To get our team familiar with moving and manipulating objects around the DOM with React JS.
          This will assist us with creating tree visualizations and node transitions 
          for our final project.

CITATIONS: Resources, tutorials, and websites used and referenced for this spike exercise are below.

  1. Snake in 100 Lines Tutorial: https://github.com/weibenfalk/react-snake-starter-files
  2. INK - ReactJS Console Applications (Snake Tutorial): https://www.youtube.com/watch?v=GaRXxmofjhw
  3. https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform
  4. https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect
  5. https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
  6. Snake Tutorial: https://github.com/ChigabigaChannel/react-hour-projects/tree/master/snake-game/src
                    https://www.youtube.com/watch?v=-oOgsGP3t5o && https://www.youtube.com/watch?v=lgK7OTdT-eo
  7. SNAKE GAME in React js: https://www.youtube.com/watch?v=SGsRHWu_01U
  8. Making a snake game using React Hooks: https://dev.to/aligumustosun/making-a-snake-game-using-react-hooks-5606
  9. React Documentation: https://reactjs.org/docs/refs-and-the-dom.html
*/

import Button from "@material-ui/core/Button";
import { useInterval as useInterval } from "./reactHook";
import React from "react";
import { useState, useEffect, useRef } from "react";

const snakeWindowSize = [window.innerWidth - 600, window.innerHeight - 200];
let totalScore = 0;
let snakeCoordinates = [[11, 10]];
/*
  This vairable contains the last arrow key code that was pushed.
  This helps avoid key collisions with the snake. For example,
  pressing the left arrow followed by the right arrow can kill the
  snake if the last arrow key is not kept track of.
*/
let lastArrowPushed = 0;

//Generates random coordinates for apple placement
let appleCoordinates = [
  Math.floor(Math.random() * 5),
  Math.floor(Math.random() * 5),
];
//resizes shape objects
let resizingFactor = 34;
//Controls snake speed
let snakeSpeed = 220;

//Creates a new target rectangle for the snake to eat upon collision
function createNewTargetShape(
  snakeEatsTargetShape,
  newTargetShape,
  arrayCopy,
  createNewTargetShape
) {
  while (snakeEatsTargetShape(newTargetShape, arrayCopy)) {
    newTargetShape = createNewTargetShape();
  }
  return newTargetShape;
}

/*
  function getArrowKeyEvent
  Takes in a key event to direct snake movement.
  Logic helps avoid collisions with body parts 
  of the snake. (e.g. pressing up arrow followed by down arrow)
*/
function getArrowKeyEvent(changeSnakeDirection) {
  return ({ keyCode }) => {
    console.log("snake is moving");
    console.log(keyCode);
    if (keyCode === 38) {
      console.log("Up ARROW pushed");
      if (!(lastArrowPushed === 40)) {
        console.log("ALL IS GOOD");
        lastArrowPushed = 38;
        changeSnakeDirection([0, -1]);
      }
    } else if (keyCode === 39) {
      console.log("Right ARROW pushed");
      if (!(lastArrowPushed === 37)) {
        console.log("ALL IS GOOD");
        lastArrowPushed = 39;
        changeSnakeDirection([1, 0]);
      }
    } else if (keyCode === 40) {
      console.log("Down ARRAOW pushed");
      if (!(lastArrowPushed === 38)) {
        console.log("ALL IS GOOD");
        lastArrowPushed = 40;
        changeSnakeDirection([0, 1]);
      }
    } else if (keyCode === 37) {
      console.log("Left ARROW pushed");
      if (!(lastArrowPushed === 39)) {
        console.log("All is good");
        lastArrowPushed = 37;
        changeSnakeDirection([-1, 0]);
      }
    }
  };
}

/*
  function stopAllAnimation
    Stops all animation when the game is over.
*/
function stopAllAnimation(setSnakeSpeed, playerLoses) {
  return () => {
    //Kills the snake speed
    setSnakeSpeed(null);
    //sets player loss variable to true
    playerLoses(true);
    //Give alert message
    alert("Nice Job! You ate " + totalScore + " apples!");
  };
}

function placeNewApple(targetShape) {
  return () => {
    return targetShape.map((obj, foodObject) => Math.floor(Math.random() * (snakeWindowSize[foodObject] / resizingFactor)));
  };
}

const App = () => {
  let [gameBackgroundColor, setBackgroundColor] = useState("black");
  let [gameBorderColor, setBorderColor] = useState("lightgreen");
  let [youLose, setYouLose] = useState(false);
  let [snakeShapes, startingSnakePosition] = useState(snakeCoordinates);
  let [targetShape, targetShapeLocation] = useState(appleCoordinates);
  let [snakeDirections, changeSnakeDirection] = useState([0, -1]);
  let [snakeSpeed, setSnakeSpeed] = useState(null);
  let canvas = useRef();
  let [snakeColor, setSnakeColor] = useState("lightgreen");
  let [currentSnakeSize, setSnakeSize] = useState(.92);


  useInterval(() => snakeController(), snakeSpeed);

  let stopMovement = stopAllAnimation(setSnakeSpeed, setYouLose);
  let backgroundButtonClicked = false;

  const snakeKeyMovement = getArrowKeyEvent(changeSnakeDirection);

  const playSnakeGame = () => {
    //Sets snake speed upon hitting the play button
    //This overrides snake speed above.
    //Adjust here for different speeds.
    snakeSpeed = 180;
    //Gives random apple coordinates for next game
    appleCoordinates = [
      Math.floor(Math.random() * 5),
      Math.floor(Math.random() * 5),
    ];
    //Resets total apple score
    totalScore = 0;
    //Sets the location of the target shape (apple)
    targetShapeLocation(appleCoordinates);
    //Sets starting snake position
    startingSnakePosition(snakeCoordinates);
    //Sets the initial snake direction
    changeSnakeDirection([0, -1]);
    //Sets snake speed
    setSnakeSpeed(snakeSpeed);
    //Resets player loss
    setYouLose(false);
  };

  const increaseSpeed = () => {
    snakeSpeed = snakeSpeed - 10;
    setSnakeSpeed(snakeSpeed);
  };

  const decreaseSpeed = () => {
    snakeSpeed = snakeSpeed + 10;
    setSnakeSpeed(snakeSpeed);
  };

  const quitGame = () => {
    setYouLose(true);
    stopAllAnimation(null, true);
  };

  const changeBackgroundColor = () => {
    if (gameBackgroundColor === "black") {
      setBackgroundColor("lightblue");
      setBorderColor("black");
    } else {
      setBackgroundColor("black");
      setBorderColor("lightgreen");
    }
  };

  const createNewTargetShape = placeNewApple(targetShape);

  const shapeResizingFactor = (snakeItem, snakeBody = snakeShapes) => {
    if (
      snakeItem[0] * resizingFactor >= snakeWindowSize[0] ||
      snakeItem[0] < 0 ||
      snakeItem[1] * resizingFactor >= snakeWindowSize[1] ||
      snakeItem[1] < 0
    ) {
      return true;
    }
    for (let snakeShape of snakeBody) {
      if (snakeItem[0] === snakeShape[0] && snakeItem[1] === snakeShape[1])
        return true;
    }
    return false;
  };

  const decreaseSnakeSize = () => 
  {
    setSnakeSize(currentSnakeSize - 0.2);
  };

  const snakeEatsApple = (arrayCopy) => 
  {
    if (
      targetShape[0] === arrayCopy[0][0] && targetShape[1] === arrayCopy[0][1]
    ) {
      //creates a new target shape for the snake
      let newTargetShape = createNewTargetShape();
      newTargetShape = createNewTargetShape(
        shapeResizingFactor,
        newTargetShape,
        arrayCopy,
        createNewTargetShape
      );
      targetShapeLocation(newTargetShape);
      //slowly increases snake speed as apples are eaten
      if (snakeSpeed >= 70) 
      {
        snakeSpeed = snakeSpeed - 10;
        setSnakeSpeed(snakeSpeed);
      }
      //increments score
      totalScore += 1;
      return true;
    }
    return false;
  };

  const changeSnakeColor = () => {
    if (snakeColor === "lightgreen") {
      setSnakeColor("purple");
    } else {
      setSnakeColor("lightgreen");
    }
  };

  const snakeController = () => {
    const snakeCopy = JSON.parse(JSON.stringify(snakeShapes));
    //creates snake head from array and copies directions over
    const newSnakeHead = [
      snakeCopy[0][0] + snakeDirections[0],
      snakeCopy[0][1] + snakeDirections[1],
    ];
    snakeCopy.unshift(newSnakeHead);
    if (shapeResizingFactor(newSnakeHead)) {
      stopMovement();
    }
    if (!snakeEatsApple(snakeCopy)) {
      snakeCopy.pop();
    }
    startingSnakePosition(snakeCopy);
  };

  useEffect(() => {
    const allShapes = canvas.current.getContext("2d");
    allShapes.setTransform(resizingFactor, 0, 0, resizingFactor, 0, 0);
    let snakeGradient = allShapes.createLinearGradient(255, 50, 50, 200);

    //creates color of snake body parts
    snakeGradient.addColorStop(0, snakeColor);
    snakeGradient.addColorStop(1, snakeColor);
    allShapes.clearRect(0, 0, window.innerWidth, window.innerHeight);

    snakeShapes.forEach(([x, y]) => {
      allShapes.fillStyle = snakeGradient;

      //size of snake body parts (.91)
      allShapes.fillRect(x, y, currentSnakeSize, currentSnakeSize);
    });


    allShapes.fillStyle = "red";
    allShapes.fillRect(
      targetShape[0],
      targetShape[1],
      currentSnakeSize,
      currentSnakeSize
    );
  }, [snakeShapes, targetShape, youLose]);

  const increaseSnakeSize = () => 
  {
    setSnakeSize(currentSnakeSize + 0.2);
  };


  return (
    <div 
      onKeyDown={(e) => snakeKeyMovement(e)}
      style={{
        border: "none",
        outline: "none",
        backgroundColor: gameBackgroundColor,
      }}
    >
      <Button color="secondary" onClick={playSnakeGame}>
        Play
      </Button>
      <Button color="secondary" onClick={increaseSpeed}>
        Faster
      </Button>
      <Button color="secondary" onClick={decreaseSpeed}>
        Slower
      </Button>
      <Button color="secondary" onClick={quitGame}>
        Quit
      </Button>
      <Button color="secondary" onClick={changeBackgroundColor}>
        Change Background
      </Button>
      <Button color="secondary" onClick={changeSnakeColor}>
        Change Snake Color
      </Button>
      <Button color="secondary" onClick={increaseSnakeSize}>
        Increase Size
      </Button>
      <Button color="secondary" onClick={decreaseSnakeSize}>
        Decrease Size
      </Button>
      <center>
        <canvas style={{ border: "10px solid", borderColor: gameBorderColor }} 
        ref={canvas} height={`${snakeWindowSize[1]}px`} 
        width={`${snakeWindowSize[0]}px`}/>
      </center>
    </div>
  );
};
export default App;
