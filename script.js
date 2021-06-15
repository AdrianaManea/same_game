// canvas is going to be a handle on the information about the dimensions of out display area
let canvas;
// underlying graphical information that we can then draw rectangulars and circles and images to 
let canvasContext;
let ballX = 50;
let ballY = 50;
let ballSpeedX = 10;
let ballSpeedY = 4;

let player1Score = 0;
let player2Score = 0;
const winnig_Score = 3;

let showWinScreen = false;


let paddle1Y = 250;
let paddle2Y = 250;
const paddle_Thickness = 10;
const paddle_Height = 100;


// Calculate mouse position
function calculateMousePosition(e) {
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;
  let mouseX = e.clientX - rect.left - root.scrollLeft;
  let mouseY = e.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  };
}


function handleMouseClick(e) {
  if (showWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showWinScreen = false;
  }
}


window.onload = function () {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  let framesPerSecond = 30;
  setInterval(function () {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);

  canvas.addEventListener('mousedown', handleMouseClick);

  canvas.addEventListener('mousemove', (e) => {
    let mousePos = calculateMousePosition(e);
    paddle2Y = mousePos.y - (paddle_Height / 2);
  });
};


// Ball Reset
function ballReset() {
  // Reset both scores when either team wins
  if (player1Score >= winnig_Score || player2Score >= winnig_Score) {
    // player1Score = 0;
    // player2Score = 0;
    showWinScreen = true;
  }

  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}


// Computer Movement Paddle
function computerMovement() {
  let paddle1YCenter = paddle1Y + paddle_Height / 2;
  if (paddle1YCenter < ballY - 35) {
    paddle1Y += 6;
  } else if (paddle1YCenter > ballY + 35) {
    paddle1Y -= 6;
  }
}


// Move Everything
function moveEverything() {
  if (showWinScreen) {
    return;
  }

  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + paddle_Height) {
      ballSpeedX = -ballSpeedX;

      // Give ball control based where it hits
      let deltaY = ballY - (paddle1Y + paddle_Height / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player2Score++; // Score before ballReset()
      ballReset();
    }
  }

  if (ballX > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + paddle_Height) {
      ballSpeedX = -ballSpeedX;

      // Give ball control based where it hits
      let deltaY = ballY - (paddle2Y + paddle_Height / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player1Score++; // Score before ballReset()
      ballReset();
    }
  }

  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }

  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

}


function drawNet() {
  for (let i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, "#333");
  }
}


// Draw Everything
function drawEverything() {
  // draw the back of our game
  colorRect(0, 0, canvas.width, canvas.height, "#63619C");

  // Show Win Screen
  if (showWinScreen) {
    canvasContext.fillStyle = "#c0bfd7";
    canvasContext.font = "30px Montserrat";

    if (player1Score >= winnig_Score) {
      canvasContext.fillText("Left Player Won!", 270, 200);
    } else if (player2Score >= winnig_Score) {
      canvasContext.fillText("Right Player Won!", 270, 200);
    }

    canvasContext.fillText("Click to continue!", 270, 500);
    return;
  }

  // Draw Net
  drawNet();

  // draw left player paddle
  colorRect(0, paddle1Y, paddle_Thickness, paddle_Height, "#c0bfd7");

  // draw right computer paddle
  colorRect(canvas.width - paddle_Thickness, paddle2Y, paddle_Thickness, paddle_Height, "#c0bfd7");

  // draw the ball
  colorCircle(ballX, ballY, 10, "#c0bfd7");

  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvas.width - 100, 100);
}


function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();

}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}