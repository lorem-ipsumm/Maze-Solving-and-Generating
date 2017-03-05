var stdio = require('stdio');
var Jimp = require('jimp');
var solver = require('./index');



var rows,cols;
var map;
var maze;
var startingSpot,spot,endingSpot;
var sequence = [];

var start = function(){
stdio.question("Rows & Colums(odd number pls)",function(err, r){
  rows = r;
  cols = rows;
  var image = new Jimp(Number(rows),Number(cols), Jimp.rgbaToInt(0, 0,0, 255), function(err,i){
    maze = i.clone();
    maze.write("./output/new_maze.png");
    console.time("Maze Generated");
    createArray();
  });
});
}






function createArray(){
  map = new Array(cols);

  for(var i = 0;i < rows;i++){
    map[i] = new Array(rows);
    for(var j = 0;j < cols;j++){
      map[i][j] = 0;
    }
  }
  //console.log(map);
  var x = Math.round((Math.random() * ((cols-2))));
  //var y = Math.round((Math.random() * ((rows-1))));
  startingSpot = new Point(x,2);


  //Pick a cell, mark it as part of the maze. Add the wallls of the cell to the wall list
  spot = startingSpot;
  map[spot.y][spot.x] = 1;
  //console.log("Starting: [" + spot.x + "," + spot.y + "]");
  //console.log(map);
  maze.setPixelColor(Jimp.rgbaToInt(255,255,255,255),spot.x,spot.y);
  maze.write("./output/new_maze.png");

  walls.push(new Point(spot.x,spot.y+1));
  if(spot.x+1 < cols)
    walls.push(new Point(spot.x+1,spot.y));
  if(spot.x-1 >= 0)
    walls.push(new Point(spot.x-1,spot.y));

  //console.log(walls);

  create();
}

//Data structure to hold main position and wall positions
function Point(x,y){
  this.x = x;
  this.y = y;
}


//Checking for taken spaces in all directions
function checkLeft(wall){
  if(wall.x - 1 >= 0){
    if(wall.x + 1 < cols)
      return(map[wall.y][wall.x-1] == 1 && map[wall.y][wall.x+1] != 1);
  }else {
    return false;
  }
}

function checkRight(wall){
  if(wall.x + 1 < cols){
    if(wall.x-1 >= 0)
      return(map[wall.y][wall.x+1] == 1 && map[wall.y][wall.x-1] != 1);
  }else {
    return false;
  }
}

function checkUp(wall){
  if(wall.y - 1 >= 0){
    if(wall.y+1 < rows)
      return(map[wall.y-1][wall.x] == 1 && map[wall.y+1][wall.x] != 1);
  }else {
    return false;
  }
}

function checkDown(wall){
  if(wall.y + 1 < rows){
    if(wall.y - 1 >= 0)
      return(map[wall.y+1][wall.x] == 1 && map[wall.y-1][wall.x] != 1);
  }else {
    return false;
  }
}




var backtracking = false;
var backtrack = 1;
var done = false;
var directions = [];
var direction;
var walls = [];


//Adding neighboring walls
function addNeighbors(x,y){
  //Add neighbors
  if(x+1 < cols){
    walls.push(new Point(x+1,y));
    map[y][x+1] = 1;
  }
  if(x-1 >= 0){
    walls.push(new Point(x-1,y));
    map[y][x-1] = 1;
  }
  if(y+1 < rows){
    walls.push(new Point(x,y+1));
    map[y+1][x] = 1;
  }
  if(y-1 >= 0){
    walls.push(new Point(x,y-1));
    map[y-1][x] = 1;
  }
}


//Recursive maze builder using Randomized Kruskal's Algorithm
//More here: https://en.wikipedia.org/wiki/Maze_generation_algorithm
function create(){
  //Reset the available directions
  directions = [];

  rWall = walls[Math.floor(Math.random() * walls.length)];
  //console.log(rWall);


  //maze.setPixelColor(Jimp.rgbaToInt(255,255,255,255),wall.x,wall.y);
  //map[wall.y][wall.x] = 1;

  //If only one of the two cells that he wall divides is visited
  //Find what's divided first
  if(checkUp(rWall)){
    map[rWall.y+1][rWall.x] = 1;
    spot = new Point(rWall.x,rWall.y+1);
    maze.setPixelColor(Jimp.rgbaToInt(255,255,255,255),rWall.x,rWall.y);
    addNeighbors(rWall.x,rWall.y+1);
  }else if(checkRight(rWall)){
    map[rWall.y][rWall.x-1] = 1
    spot = new Point(rWall.x-1,rWall.y);
    maze.setPixelColor(Jimp.rgbaToInt(255,255,255,255),rWall.x,rWall.y);
    addNeighbors(rWall.x-1,rWall.y);
  }else if(checkDown(rWall)){
    map[rWall.y-1][rWall.x] = 1;
    spot = new Point(rWall.x,rWall.y-1);
    maze.setPixelColor(Jimp.rgbaToInt(255,255,255,255),rWall.x,rWall.y);
    map[rWall.y][rWall.x] = 1;
    addNeighbors(rWall.x,rWall.y-1);
  }else if(checkLeft(rWall)){
    map[rWall.y][rWall.x+1] = 1;
    maze.setPixelColor(Jimp.rgbaToInt(255,255,255,255),rWall.x,rWall.y);
    spot = new Point(rWall.x+1,rWall.y);
    addNeighbors(rWall.x+1,rWall.y);
  }



  maze.setPixelColor(Jimp.rgbaToInt(255,255,255,255),spot.x,spot.y);
  var index = walls.indexOf(rWall);
  if(index > -1)
    walls.splice(index,1);



  if(walls.length > 0){

    //This is for watching the generator in action
    //setTimeout(create,20);
    //maze.write("./output/new_maze.png");


    create();
  }else{
    console.timeEnd("Maze Generated");
    console.log("\n");
    maze.write("./output/new_maze.png");
    //Start solver
    solver("./output/new_maze.png");
  }
}



start();
module.exports = start;
