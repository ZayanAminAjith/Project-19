var PLAY = 1;
var END = 0;
var gameState = PLAY;

var ben, ben_running, ben_collided;
var ghost, ghost_running
var ground, invisibleGround, groundImage;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg
var score=0;
var jumpSound, collidedSound;

var gameOver, restart;


function preload(){
  jumpSound = loadSound("jump.wav")
  collidedSound = loadSound("collided.wav")
  
  backgroundImg = loadImage("backgroundImg.png")
  sunAnimation = loadImage("moon.png");
  
  ben_running = loadAnimation("ben-a.png","ben-b.png","ben-c.png","ben-d.png");
  ben_collided = loadAnimation("ben-collided.png");

  ghost_running = loadAnimation("ghost-standing.png","ghost-jumping.png")
  ghost_found = loadAnimation("ghost-standing.png")

  groundImage = loadImage("ground.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  moon = createSprite(width-50,100,10,10);
  moon.addAnimation("sun", sunAnimation);
  moon.scale = 0.1
  
  ben = createSprite(300,height-70,20,50);
  ben.addAnimation("running", ben_running);
  ben.addAnimation("collided", ben_collided);
  ben.setCollider('rectangle',0,0,50,160)
  ben.scale = 0.7
  //ben.debug=true

  ghost = createSprite(70,height-70,20,50);
  ghost.addAnimation("running", ghost_running);
  ghost.addAnimation("found", ghost_found);
  ghost.setCollider('rectangle',0,0,700,300)
  ghost.scale = 0.4
  //ghost.debug=true
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
  // invisibleGround.visible =false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);

  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && ben.y >= height-131) {
      jumpSound.play( )
      ben.velocityY = -13.5;
      touches = [];
    }
    
    ben.changeAnimation("running", ben_running);
    ghost.changeAnimation("running", ghost_running);

    ben.velocityY = ben.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    ben.collide(invisibleGround);
    ghost.collide(invisibleGround);
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(ben)){
        collidedSound.play()
        gameState = END;
    }

    if(obstaclesGroup.isTouching(ghost)){
      ghost.velocityY = -13.5;
    }

    ghost.velocityY = ghost.velocityY + 0.8
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    //set velcity of each game object to 0
    ground.velocityX = 0;
    ben.velocityY = 0;
    ghost.velocityY = 0
    obstaclesGroup.setVelocityXEach(0);
    
    //change the trex animation
    ben.changeAnimation("collided",ben_collided);
    ghost.changeAnimation("found",ghost_found);
    ghost.x = ben.x
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }

    
  
  if(gameState=== END && mousePressedOver(restart)){
    reset();
  }
  }
  
  drawSprites();

}
function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width,height-115,20,30);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.6;
    obstacle.lifetime = 900;
    obstacle.depth = ben.depth;
    ben.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  ben.changeAnimation("running",ben_running);
  ghost.x = 70
  
  score = 0;
  
}
