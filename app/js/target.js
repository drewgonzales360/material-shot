

var mouse = require('mouse-event')
var mX = 0;
var mY = 0;

const moment = require('moment');

const secondsToTime = (s) => {
  let momentTime = moment.duration(s, 'seconds');
  let sec = momentTime.seconds() < 10 ? ('0' + momentTime.seconds()) : momentTime.seconds();
  let min = momentTime.minutes() < 10 ? ('0' + momentTime.minutes()) : momentTime.minutes();

  return `${min}:${sec}`
};

const canvas   = document.getElementById('range');
const ctx = canvas.getContext('2d')

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

ctx.fillStyle = "dimGray"
ctx.fillRect( 0,0,ctx.canvas.width,ctx.canvas.height);

var shrinkFactor = 100; // lower is harder to shoot.

setInterval(function(){
  drawTarget(Math.floor(Math.random()*ctx.canvas.width), Math.floor(Math.random()*ctx.canvas.height), Math.floor(Math.random()*100));
}, 700);

displayTime(50)
function displayTime( time ) {
  setInterval( function(){
    time -= 1
    ctx.font="30px Orbitron";
    // Create gradient
    // gradient.addColorStop("0","magenta");
    // gradient.addColorStop("0.5","blue");
    // gradient.addColorStop("1.0","red");
    // Fill with gradient
    ctx.fillStyle= "lime";
    ctx.fillText(secondsToTime(time),10,10);

  }, 1000);
}

function drawTarget(x, y, radius) {
  let timeRad = radius
  let origRad = radius + 2; // just for good measure.
  let target = setInterval(function(){
    ctx.beginPath();
    ctx.arc(x,y,origRad,0,2*Math.PI);
    ctx.fillStyle = "dimGray";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x,y,radius,0,2*Math.PI);
    ctx.fillStyle = "lime";
    ctx.fill();
    if (radius > 0) {
      radius -= 1;
      origRad -= 1;
    }
  }, shrinkFactor);

  // Player never got it.
  setTimeout(function(){
    clearInterval(target)
  }, shrinkFactor * timeRad+500);


  // Player shot it
  canvas.addEventListener("click", function(){
    if ( shotMade( mX, mY, x, y, radius)) {
      clearInterval(target)
      ctx.beginPath();
      ctx.arc(x,y,origRad,0,2*Math.PI);
      ctx.fillStyle = "dimGray";
      ctx.fill();
    }
  });

}
window.addEventListener('mousemove', function(ev) {
  mX = mouse.x(ev);
  mY = mouse.y(ev);
})

function shotMade(x,y, cx, cy, radius) {
  let wide = (x - cx) ** 2;
  let high = (y - cy) ** 2;

  if( Math.sqrt(wide+high) < radius){
    return true;
  } else {
    return false;
  }
}
