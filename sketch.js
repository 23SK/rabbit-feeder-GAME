const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

var engine;
var world;
var ground, rope1,rope2,rope3, fruit, fruitLink1,fruitLink2,fruitLink3,rabbit;
var backgroundImg, rabbitImg, fruitImg, ropeCutImg;
var cutButton1,cutButton2,cutButton3;
var blink, eat, sad;
var airSound,eatingSound,cuttingSound,ropeCutSound,sadSound,backgroundSound
var muteButton,airBlower;
var canW,canH

function preload() {
  backgroundImg = loadImage("background.png");
  rabbitImg = loadImage("Rabbit-01.png");
  fruitImg = loadImage("melon.png")
  ropeCutImg = loadImage("cut_button.png");

  blink = loadAnimation("blink_1.png", "blink_2.png");
  eat = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
  sad = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");

  blink.playing = true;
  blink.looping = true;
  eat.playing = true;
  eat.looping = false;
  sad.playing = true;
  sad.looping = false;
  blink.frameDelay = 15;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  airSound = loadSound("air.wav");
  eatingSound = loadSound("eating_sound.mp3");
  ropeCutSound = loadSound("rope_cut.mp3");
  sadSound = loadSound("sad.wav");
  backgroundSound = loadSound("sound1.mp3");
}

function setup() {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile== true){
    canW = displayWidth;
    canH = displayHeight;
    createCanvas(canW+80,canH);
  }
  else{
    canW = windowWidth;
    canH = windowHeight;
    createCanvas(canW,canH);
  }

  frameRate(80);
  engine = Engine.create();
  world = engine.world;

  ground = new Ground(200, canH-10 , 2*canW , 20);
  rope1 = new Rope(6, { x: 250, y: 15 });
  rope2 = new Rope(7, { x: 350, y: 20 });
  rope3 = new Rope(5, { x: 150, y: 10 });

  var fruitOptions = {
    density: 0.001,
  }
  fruit = Bodies.circle(250, 150, 25, fruitOptions);
  Composite.add(rope1.body,fruit);

  fruitLink1 = new Link(rope1, fruit);
  fruitLink2 = new Link(rope2, fruit);
  fruitLink3 = new Link(rope3, fruit);

  cutButton1 = createImg("cut_button.png");
  cutButton1.position(225, 10)
  cutButton1.size(50, 50)
  cutButton1.mouseClicked(ropeCut1);

  cutButton2 = createImg("cut_button.png");
  cutButton2.position(325, 20)
  cutButton2.size(50, 50)
  cutButton2.mouseClicked(ropeCut2);

  cutButton3 = createImg("cut_button.png");
  cutButton3.position(125,5)
  cutButton3.size(50, 50)
  cutButton3.mouseClicked(ropeCut3);

  muteButton = createImg("mute.png");
  muteButton.position(canW-100,50)
  muteButton.size(50,50);
  muteButton.mouseClicked(mute);

  airBlower = createImg("balloon.png");
  airBlower.position(100,250);
  airBlower.size(100,100);
  airBlower.mouseClicked(blow);

  rabbit = createSprite(450, canH - 70 , 15, 15);
  rabbit.addImage(rabbitImg);
  rabbit.scale = 0.2
  rabbit.addAnimation("blinking", blink);
  rabbit.addAnimation("eating", eat);
  rabbit.addAnimation("crying", sad);
  rabbit.changeAnimation("blinking", blink);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)

 backgroundSound.play();
}

function draw() {
  background(backgroundImg);
  /*if(!backgroundSound.isPlaying()){
    backgroundSound.play();
    backgroundSound.setVolume(0.2);
  }*/

  Engine.update(engine);
  
  ground.show();
  rope1.show();
  rope2.show();
  rope3.show();

  if (fruit != null) {
    imageMode(CENTER)
    image(fruitImg, fruit.position.x, fruit.position.y, 75, 75);
  }

  if (collide(fruit, rabbit)) {
    rabbit.changeAnimation("eating");
    eatingSound.play();
  }

  if (collide(fruit, ground.body)) {
    rabbit.changeAnimation("crying");
    sadSound.play();
  }

  drawSprites();
}

function ropeCut1() {
  rope1.break();
  fruitLink1.detach();
  fruitLink1 = null;
  ropeCutSound.play();
}

function ropeCut2() {
  rope2.break();
  fruitLink2.detach();
  fruitLink2 = null;
  ropeCutSound.play();
}

function ropeCut3() {
  rope3.break();
  fruitLink3.detach();
  fruitLink3 = null;
  ropeCutSound.play();
}

function collide(body, sprite) {
  if (fruit != null) {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if (d <= 80) {
      World.remove(world, fruit);
      fruit = null;
      return true;
    }
    else {
      return false;
    }
  }
}

function mute(){
if(backgroundSound.isPlaying()){
  backgroundSound.stop();
}
else{
  backgroundSound.play();
}
}

function blow(){
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0.01,y:0})
}