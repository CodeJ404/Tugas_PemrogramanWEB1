const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls .dpad i");
const resetBtn = document.querySelector(".btn");
const bgAudio = new Audio("sound/background.mp3");
const blipAudio = new Audio("sound/blip.mp3");
const lossAudio = new Audio("sound/loss.mp3");

let gameOver = false;
let foodX, foodY;
let snakeX = 5,
  snakeY = 10;
let snakeBody = [];
let velocityX = 0,
  velocityY = 0;
let setIntervalId;
let score = 0;

// Mengambil high score dari penyimpanan local
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score : ${highScore}`;

const changeFoodPosition = () => {
  // Memberikan angka random dengan nilai 0 - 30 sebagai posisi food
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
  // Mereset timer dan memulai ulang halaman saat game over
  clearInterval(setIntervalId);
  alert("Game Over! Tekan OK untuk memulai ulang");
  location.reload();
};

const changeDirection = (e) => {
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

controls.forEach((key) => {
  key.addEventListener("click", () => {
    changeDirection({ key: key.dataset.key });
  });
});

resetBtn.addEventListener("click", () => {
  lossAudio.volume = 0.1;
  lossAudio.play();
  alert("halaman dimuat ulang!");
  location.reload();
});

const initGame = () => {
  bgAudio.volume = 0.2;
  bgAudio.play();
  if (gameOver) {
    lossAudio.volume = 0.2;
    lossAudio.play();
    return handleGameOver();
  }

  let htmlMarkup = `<div class="food" style="grid-area : ${foodY} / ${foodX}"></div>`;

  // memeriksa jika ular mengenai makanan
  if (snakeX === foodX && snakeY === foodY) {
    changeFoodPosition();
    snakeBody.push([foodX, foodY]); // memasukkan posisi makanan ke array badan ular
    score++; // menambah score 1

    blipAudio.play();
    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score : ${score}`;
    highScoreElement.innerText = `High Score : ${highScore}`;
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    // menggeser nilai kedepan dari elemen kedalam badan ular satu-persatu
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY]; // mengatur elemen pertama dari badan ular ke posisi ular

  // mengupdate posisi ular berdasarkan arah velocity
  snakeX += velocityX;
  snakeY += velocityY;

  // mengecek jika ular keluar dari batas, jika iya maka gameOver bernilai true
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }

  for (let i = 0; i < snakeBody.length; i++) {
    // menambahkan div untuk setiap bagian badan ular
    htmlMarkup += `<div class="head" style="grid-area : ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

    // mengecek jika ular mengenai badan, jika iya maka game over bernilai true
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }

  playBoard.innerHTML = htmlMarkup;
};

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);
