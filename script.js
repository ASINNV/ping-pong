var pause_screen = document.getElementById("pause-screen");
var start_screen = document.getElementById("start-screen");
var start_label = document.getElementById("start-label");
var adjacent = document.getElementById("adjacent");
var opposite = document.getElementById("opposite");
// var hypotenuse = document.getElementById("hypotenuse");
var play = document.getElementById("play");
// var pause = document.getElementById("pause");
var counter = document.getElementById("counter");
var leaderboard = document.getElementById("highscore");
var speedCounter = document.getElementById("speed-counter");
var up = document.getElementById("up");
var down = document.getElementById("down");
var count = 0;
var highscore = 0;
var red = document.getElementById("red");
var green = document.getElementById("green");
var blue = document.getElementById("blue");
var orange = document.getElementById("orange");
var bgColor = "#51835C";
var canvas;
var canvasContext;
var ballRadius = 20;
var velocityX = 5;
var velocityY = 5;

var PADDLE_HEIGHT = 100;
// var PADDLE_WIDTH = 10;
var framesPerSecond = 48;
var paddle1Y = 200;
var paddle2Y = 150;

var getRandomIntInclusive = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
};

var ballXPosition = 380;
var ballYPosition = getRandomIntInclusive(40, 410);


var drawElement = function(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
};

var drawCircle = function(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  // canvasContext.shadowBlur = 10;
  // canvasContext.shadowColor = "#fff";
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
};

var drawEverything = function() {
  // Draws the background
  drawElement(0, 0, canvas.width, canvas.height, bgColor);
  // Draws Player1 paddle
  drawElement(canvas.width - 20, paddle1Y, 10, 100, "white");
  // Draws Player2 paddle
  drawElement(10, paddle2Y, 10, 100, "white");
  // Draws the puck
  drawCircle(ballXPosition, ballYPosition, ballRadius, "white");
};

var showPlayButton = function() {
  adjacent.style.transform = "translateX(-50%) translateY(-27%) rotateZ(60deg)";
  adjacent.style.left = "55%";
  opposite.style.transform = "translateX(-50%) translateY(-72%) rotateZ(-60deg)";
  opposite.style.left = "55%";

  // tell the label to switch to pause when game has started and hide pause screen
  start_label.innerText = "play";
  pause_screen.style.display = "block";
  pause_screen.style.cursor = "default";
  canvas.style.cursor = "default";
  setTimeout(function() {
      pause_screen.style.opacity = 1;
  }, 50);

};

var showPauseButton = function() {
  adjacent.style.left = "60%";
  opposite.style.left = "60%";
  adjacent.style.transform = "translateX(-50%) translateY(-50%)";
  opposite.style.transform = "translateX(-50%) translateY(-50%)";

  // tell the label to switch to start when game is paused and put up pause screen
  start_label.innerText = "pause";
  pause_screen.style.opacity = 0;
  pause_screen.style.cursor = "none";
  canvas.style.cursor = "none";
  setTimeout(function() {
      pause_screen.style.display = "none";
  }, 200);

};

var hideStartScreen = function() {
  start_screen.style.cursor = "none";
  start_screen.style.opacity = "0";
  setTimeout(function() {
      start_screen.style.display = "none";
  }, 200);
};

var showStartScreen = function() {
  adjacent.style.transform = "translateX(-50%) translateY(-27%) rotateZ(60deg)";
  adjacent.style.left = "55%";
  opposite.style.transform = "translateX(-50%) translateY(-72%) rotateZ(-60deg)";
  opposite.style.left = "55%";

  // tell the label to switch to pause when game has started and hide pause screen
  start_label.innerText = "play";
  start_screen.innerText = "Press Play to Begin";
  start_screen.style.display = "block";
  start_screen.style.cursor = "default";
  canvas.style.cursor = "default";
  setTimeout(function() {
      start_screen.style.opacity = 1;
  }, 150);

};

var ballReset = function() {
  showStartScreen();
  counter.style.color = "#fff";
  counter.style.textShadow = "none";
  velocityX *= -1;
  ballXPosition = canvas.width/2;
  ballYPosition = canvas.height/2;
};

var moveEverything = function() {
  if (ballXPosition > canvas.width - ballRadius - 20) {
    if (ballYPosition > paddle1Y && ballYPosition < paddle1Y + PADDLE_HEIGHT) {
      velocityX *= -1;
      count++;
      if (count >= highscore) {
        highscore = count;
      }
    } else {
        clearInterval(window.interval);
        window.interval = null;
        ballReset();
        if (count > highscore) {
          highscore = count;
        }
        count = 0;

    }

    leaderboard.innerText = highscore;
    counter.innerText = count;
  }
  if (ballXPosition < 0 + ballRadius + 20) {
    if (ballYPosition > paddle2Y && ballYPosition < paddle2Y + PADDLE_HEIGHT) {
      velocityX *= -1;
      count++;
      if (count >= highscore) {
        highscore = count;
      }
    } else {
        clearInterval(window.interval);
        window.interval = null;
        ballReset();
        if (count > highscore) {
          highscore = count;
        }
        count = 0;
    }
    leaderboard.innerText = highscore;
    counter.innerText = count;

  }



  // IMPORTANT!
  // I reversed these from velocityY *= -1 and velocityX *= -1
  // if (ballYPosition < 0 + ballRadius) {
  //   velocityY *= 1;
  // }
  // if (ballYPosition > canvas.height - ballRadius) {
  //   velocityY *= 1;
  // }

  // if (velocityX < 0 && velocityY < 0) {
    ballXPosition += velocityX;
    ballYPosition += velocityY;


  // ball motion in the y-coordinate plane
  if (ballYPosition >= (canvas.height - ballRadius) || ballYPosition <= ballRadius) {
    velocityY *= -1;
  }
};


function calculateMousePosition(e) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = e.clientX - rect.left - root.scrollLeft;
  var mouseY = e.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  };
}

var startGame = function() {
  if (!window.interval) {

    window.interval = setInterval(function() {
      moveEverything();
      drawEverything();
    }, 1000/framesPerSecond);
    // show pause icon
    hideStartScreen();
    showPauseButton();

  } else {
    clearInterval(window.interval);
    window.interval = null;
    // show play icon
    showPlayButton();
  }

};

window.onload = function() {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");
    // var interval = setInterval(function() {
    //   moveEverything();
    //   drawEverything();
    // }, 1000/framesPerSecond);
    drawElement(0, 0, canvas.width, canvas.height, bgColor);
    speedCounter.innerText = velocityX;
    canvas.addEventListener('mousemove', function(e) {
        var mousePos = calculateMousePosition(e);
        paddle2Y = paddle1Y = mousePos.y - PADDLE_HEIGHT/2;
    });

    start_screen.addEventListener('click', startGame);
    pause_screen.addEventListener('click', startGame);
    play.addEventListener('click', startGame);


    document.body.addEventListener('keydown', function(e) {
      if (e.keyCode === 32) {
        if (!window.interval) {
          hideStartScreen();
          showPauseButton();
          window.interval = setInterval(function() {
            moveEverything();
            drawEverything();
          }, 1000/framesPerSecond);

        } else {
          showPlayButton();
          clearInterval(window.interval);
          window.interval = null;
        }
      }
    });


    // pause.addEventListener('click', function() {
    //   console.log(window.interval);
    //   clearInterval(window.interval);
    // });
    red.addEventListener('click', function() {
      bgColor = "#AD716B";
      drawEverything();
    });
    green.addEventListener('click', function() {
      bgColor = "#51835C";
      drawEverything();
    });
    blue.addEventListener('click', function() {
      bgColor = "#43636B";
      drawEverything();
    });
    orange.addEventListener('click', function() {
      bgColor = "#AD906B";
      drawEverything();
    });

    up.addEventListener('click', function() {
      this.blur();

      if (velocityX < 0) {
        velocityX--;
      } else if (velocityX >= 0){
        velocityX++;
      }

      if (velocityY < 0) {
        velocityY--;
      } else if (velocityY >= 0){
        velocityY++;
      }

      speedCounter.innerText = Math.abs(velocityX);
    });
    down.addEventListener('click', function() {
      this.blur();

      if (velocityX < 0) {
        velocityX++;
      } else if (velocityX > 0) {
        velocityX--;
      }

      if (velocityY < 0) {
        velocityY++;
      } else if (velocityY > 0) {
        velocityY--;
      }

      speedCounter.innerText = Math.abs(velocityX);
    });

};
