/****************************************************************
FileName: target.js
Kenneth Drew Gonzales
Material Shot

Description:
This file holds the logic for the in game experience. Drawing
targets, keeping score, and displaying accuracy.

Last Edited: 9/6/16
****************************************************************/
const ipcRenderer   = require('electron').ipcRenderer;
const moment        = require('moment');
var mouse           = require('mouse-event')

const canvas        = document.getElementById('range');
const ctx           = canvas.getContext('2d')

ctx.canvas.width    = window.innerWidth * 0.80;
ctx.canvas.height   = window.innerHeight * 0.96;

var mX    = 0;
var mY    = 0;
var score = 0;

ctx.fillStyle     = "dimGray"
ctx.fillRect( 0,0,ctx.canvas.width,ctx.canvas.height);

startGame();

/****************************************************************
displayTime
  summary: This function will stop drawing new targets after
    the time limit has been reached. Right now, game times are
    set to a standard 30 seconds.
  param: time - seconds allowed for play time.
          game - the setInterval that is continually calling
          drawTarget.
****************************************************************/
function displayTime(time, game ) {
    let timer = setInterval( function(){
        time -= 1
        if( time < 1 ){
            clearInterval(game);
        }
        document.getElementById("time").innerHTML = secondsToTime(time);
    }, 1000);
    setTimeout(function(){
        clearInterval(timer);
        document.getElementById("time").innerHTML = "Time's up.";
        document.getElementById('score').innerHTML = "Final: " + score;
    }, time*1000);
}

/****************************************************************
drawTarget
  summary: This will draw an individual target and add to the
    score if the target has been shot.
  params: x,y coordinates in the canvas to draw the target.
****************************************************************/
function drawTarget(x, y, radius, shrinkFactor) {
    let timeRad = radius;
    let origRad = radius + 2; // just for good measure.
    var target = setInterval(function(){
        ctx.beginPath();
        ctx.arc(x,y,origRad,0,2*Math.PI);
        ctx.fillStyle = "dimGray";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x,y,radius,0,2*Math.PI);
        ctx.fillStyle = "lime";
        ctx.fill();
        if (radius > 0) {
            radius  -= 1;
            origRad -= 1;
        }
    }, shrinkFactor);

    // Player never got it.
    setTimeout(function(){
        clearInterval(target)
    }, shrinkFactor * timeRad + 500);


    // Player shot it
    canvas.addEventListener("click", function(){
        if ( shotMade( mX, mY, x, y, radius)) {
            clearInterval(target);
            ctx.beginPath();
            ctx.arc(x,y,origRad,0,2*Math.PI);
            ctx.fillStyle = "dimGray";
            ctx.fill();
            radius = 0;           // don't allow double targeting.
            x = 0;
            y = 0;
        }
    });
}

/****************************************************************
shotMade
  summary: this logic will determine if the user click was close
  enough to the center of the target.
****************************************************************/
function shotMade(x,y, cx, cy, radius) {
    let wide = (x - cx) ** 2;
    let high = (y - cy) ** 2;
    if( Math.sqrt(wide+high) < radius){
        score++;
        document.getElementById("score").innerHTML = "Score: " + score;
        return true;
    } else {
        return false;
    }
}


/****************************************************************
startGame
  summary: begins drawingTargets and updating score and keeping
    time.
****************************************************************/
function startGame() {
    let difficulty = ipcRenderer.sendSync('get-difficulty');
    document.getElementById("time").innerHTML = "Start Game.";
    document.getElementById('score').innerHTML = "Score: " + score;
    console.log(difficulty);
    let game = setInterval(function(){
        let x = Math.floor(Math.random()*ctx.canvas.width);
        let y = Math.floor(Math.random()*ctx.canvas.height)
        drawTarget(x, y, difficulty.radius, difficulty.shrinkFactor);
    }, difficulty.targetSpawnRate);
    score = 0;
    displayTime(30, game);
}

const secondsToTime = (s) => {
    let momentTime = moment.duration(s, 'seconds');
    let sec = momentTime.seconds() < 10 ? ('0' + momentTime.seconds()) : momentTime.seconds();
    let min = momentTime.minutes() < 10 ? ('0' + momentTime.minutes()) : momentTime.minutes();
    return `${min}:${sec}`
};

window.addEventListener('mousemove', function(ev) {
  mX = mouse.x(ev);
  mY = mouse.y(ev);
});

window.addEventListener('mousemove', function(ev) {
  mX = mouse.x(ev);
  mY = mouse.y(ev);
});

document.getElementById('quit').addEventListener('click', function(){
  window.location.href = `file://${__dirname}/../menu.html`
});

document.getElementById('quit').addEventListener('click', function(){
  window.location.href = `file://${__dirname}/../menu.html`
});
