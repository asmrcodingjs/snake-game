const gameContainer = document.querySelector(".game-space");
const scoreElement =
  document.querySelector("#score__value");
const hightScoreElement = document.querySelector(
  "#high-score__value"
);
const buttons = document.querySelectorAll(".key-btn");

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };

let dx = 1;
let dy = 0;

let score = 0;
let gameOver = false;

document.addEventListener("DOMContentLoaded", initGame);

function initGame() {
  gameLoop();

  const previousHighScore =
    localStorage.getItem("highScore") || 0;
  hightScoreElement.textContent = previousHighScore;

  document.addEventListener("keydown", handleKeyDown);

  buttons.forEach((button) => {
    button.addEventListener("click", handleButtonClick);
  });
}

function gameLoop() {
  update();
  draw();
  checkCollisionWithItSelf();

  if (!gameOver) setTimeout(gameLoop, 100);
}

async function update() {
  if (gameOver) return;
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (head.x < 0) head.x = 19;
  if (head.x > 19) head.x = 0;

  if (head.y < 0) head.y = 19;
  if (head.y > 19) head.y = 0;

  if (
    head.x < 0 ||
    head.x > 19 ||
    head.y < 0 ||
    head.y > 19
  ) {
    handleGameOver();
    return;
  }

  snake.unshift(head);
  if (head.x === food.x && head.y == food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20),
    };
    await playAudio("./eating.mp3");
    scoreElement.textContent = score;
  } else {
    snake.pop();
  }
}

function draw() {
  gameContainer.innerHTML = "";
  snake.forEach((segment) => {
    const div = document.createElement("div");
    div.style.left = segment.x * 20 + "px";
    div.style.top = segment.y * 20 + "px";
    div.id = "snake";
    gameContainer.appendChild(div);
  });

  const foodDiv = document.createElement("div");
  foodDiv.style.left = food.x * 20 + "px";
  foodDiv.style.top = food.y * 20 + "px";
  foodDiv.id = "food";

  gameContainer.appendChild(foodDiv);
}

function handleKeyDown(event) {
  if (gameOver) return;
  const directions = {
    ArrowUp: { dx: 0, dy: -1 },
    ArrowDown: { dx: 0, dy: 1 },
    ArrowLeft: { dx: -1, dy: 0 },
    ArrowRight: { dx: 1, dy: 0 },
  };

  const direction = directions[event.key];
  if (direction) setDirection(direction.dx, direction.dy);
}

function setDirection(newDx, newDy) {
  if (dx === -newDx || dy === -newDy) return;

  dx = newDx;
  dy = newDy;
}

function checkCollisionWithItSelf() {
  const head = snake[0];
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      handleGameOver();
      break;
    }
  }
}

async function handleGameOver() {
  gameOver = true;
  const previousHighScore =
    localStorage.getItem("highScore") || 0;

  if (score > previousHighScore) {
    localStorage.setItem("highScore", score);
    hightScoreElement.textContent = score;
  } else {
    hightScoreElement.textContent = previousHighScore;
  }

  const oldScore = score;
  resetGame();
  await playAudio("./game-over.mp3");
  alert(`Game Over ! Your Score: ${oldScore}`);
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  food = { x: 5, y: 5 };

  dx = 1;
  dy = 0;

  score = 0;
  gameOver = false;
}

function handleButtonClick() {
  if (gameOver) return;

  const direction = this.getAttribute("data-key");

  switch (direction) {
    case "up":
      if (dy !== 1) {
        dx = 0;
        dy = -1;
      }
      break;
    case "down":
      if (dy !== -1) {
        dx = 0;
        dy = 1;
      }
      break;
    case "left":
      if (dx !== 1) {
        dx = -1;
        dy = 0;
      }
      break;
    case "right":
      if (dx !== -1) {
        dx = 1;
        dy = 0;
      }
      break;
  }
}

async function playAudio(url) {
  const audio = new Audio(url);
  await audio.play();
  return audio;
}
