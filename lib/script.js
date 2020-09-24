var canvas = document.getElementById('sky');
var context = canvas.getContext('2d');

var airplane_drawing = document.getElementById('airplane');
var missile_drawing = document.getElementById('missile');
var explosion_drawing = document.getElementById('explosion');

var explosion_audio = document.getElementById('explosion_audio');

var audio = true;

function turnAudio(){
  if(audio){
    document.getElementById('turn_audio').innerHTML = 'Desabilitar Áudio';
  } else {
    document.getElementById('turn_audio').innerHTML = 'Habilitar Áudio';
  }
  audio = !audio;
}

var airplane = {
  x: 0,
  y: 0,
  angle: 0
};

var missile = {
  x: 60,
  y: 540,
  angle: 0,
  velocity: 3.0,
  released: false
};

var mouse = {
  x: 0,
  y: 0
};

canvas.addEventListener('mousemove', function(event){
  mouse.x = event.clientX - canvas.offsetLeft;
  mouse.y = event.clientY - canvas.offsetTop;
  airplane.x = mouse.x;
  airplane.y = mouse.y;
  context.save();
  context.beginPath();
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(airplane_drawing, airplane.x - 50, airplane.y - 50, 100, 100);
	context.closePath();
	context.restore();
  context.save();
	context.beginPath();
  missile.angle = computeAngle(airplane.x, airplane.y, missile.x, missile.y);
  context.translate(missile.x, missile.y);
  context.rotate(missile.angle + Math.PI);
  context.drawImage(missile_drawing, -25, -25, 50, 50);
	context.closePath();
  context.restore();

});

function missileMoving(){
  if (collision()){
    clearInterval(moving_missile);
    if(audio) explosion_audio.play();
    context.save();
    context.beginPath();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(explosion_drawing, airplane.x-100, airplane.y-100, 200, 200);
    context.closePath();
    context.restore();
    airplane = {
      x: 0,
      y: 0,
      angle: 0
    };
    missile = {
      x: 60,
      y: 540,
      angle: 0,
      velocity: 3.0,
      released: false
    };
  } else {
    missile.x += missile.velocity * Math.cos(missile.angle);
    missile.y += missile.velocity * Math.sin(missile.angle);

    context.save();
    context.beginPath();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(airplane_drawing, airplane.x - 50, airplane.y - 50, 100, 100);
    context.closePath();
    context.restore();
    context.save();
    context.beginPath();
    missile.angle = computeAngle(airplane.x, airplane.y, missile.x, missile.y);
    context.translate(missile.x, missile.y);
    context.rotate(missile.angle + Math.PI);
    context.drawImage(missile_drawing, -25, -25, 50, 50);
    context.closePath();
    context.restore();
  }
}

canvas.addEventListener('click',function(event){
	missile.released = true;
  moving_missile = setInterval(missileMoving, 5);
});

function collision(){
  return computeDistance() < 4;
}

function computeDistance(){
  return Math.sqrt((airplane.x-missile.x)^2+(airplane.y-missile.y)^2);
}

function computeAngle(destination_x, destination_y, origin_x, origin_y){
  if (destination_x == origin_x){
    if (destination_y >= origin_y){
      return Math.PI / 2;
    } else {
      return - Math.PI / 2;
    }
  } else {
    if (destination_x > origin_x){
      return Math.atan((destination_y - origin_y)/(destination_x - origin_x));
    } else {
      return Math.PI + Math.atan((destination_y - origin_y)/(destination_x - origin_x));
    }
  }
}