var Jimp = require('jimp');
var stdio = require('stdio');
var generator = require('./generate');
var rows,cols;
var map;
var start;
var spot;
var values;
var image;
var out;
var startSpot;
var endSpot;
var interest;
var filePath;
var found = false;



function chooseEnd(){
  var endFound = false;
  while(!endFound){
    var x = Math.round((Math.random() * ((cols-2))));
    if(map[rows-1][x] == 0){
      endSpot = new Point(x,rows-1);
      console.log("end found");
      out.setPixelColor(Jimp.rgbaToInt(255,0,0, 255),x,rows-1);
      endFound = true;
    }
  }
}

function chooseStart(){
  var startFound = false;
  while(!startFound){
    var x = Math.round((Math.random() * ((cols-2))));
    if(map[0][x] == 0){
      spot = new Point(x,0);
      startSpot = spot;
      //map[0][x] = 2;
      console.log("start found");
      out.setPixelColor(Jimp.rgbaToInt(0,255,0, 255),x,0);
      startFound = true;
    }
  }
}

function begin(){
  stdio.question("Maze filepath",function(err, name){
    filePath = name;
    readMaze();
  });
}


//Read the maze image and turn it into an array
var readMaze = function(fP){
  Jimp.read(fP,function(err,im){
    image = im;
    out = im.clone();

    cols = im.bitmap.width;
    rows = im.bitmap.height;
    map = new Array(cols);

    console.time('Building Array');

    //Create 2D array
    for(var i = 0; i < rows; i++){
      map[i] = new Array(rows);
      for(var j = 0;j < cols; j++){
        if(im.getPixelColor(j,i) == 255){
          map[i][j] = 1;
        }else{
          map[i][j] = 0;
        }
        if(i == 0 && map[i][j] == 0 && found == false){
          //This is the start
          //found = true;
          //map[i][j] = 2;
          //spot = new Point(j,i);
          //startSpot = spot;
        }
        if(i == rows-1 && map[i][j] == 0){
          //This is the end
          //endSpot = new Point(j,i);
        }
      }
    }
    console.timeEnd('Building Array');
    console.log("Rows: " + rows);
    console.log("Columns: " + cols);
    //out.setPixelColor(Jimp.rgbaToInt(0, 0,255, 255),spot.x,spot.y);
    chooseStart();
    chooseEnd();
    console.time("Finished");

    dfs();
  });
}
function Point(x,y){
  this.x = x;
  this.y = y;
}

//0 = Open, 1 = Wall, 2 = Visited
function checkLeft(){
  if(spot.x-1 >= 0)
    return(map[spot.y][spot.x-1] == 0);
  else
    return false;
}

function checkRight(){
  if(spot.x+1 <= cols)
    return(map[spot.y][spot.x+1] == 0);
  else
    return false;
}

function checkUp(){
  if(spot.y-1 >= 0){
    return(map[spot.y-1][spot.x] == 0);
  }else{
    return false;
  }
}

function checkDown(){
  if(spot.y+1 < rows)
    return(map[spot.y+1][spot.x] == 0);
  else
    return false;
}


var done = false;
var sequence = [];
var backtracking = false;

function dfs(){

  if(!(spot.x == endSpot.x && spot.y == endSpot.y)){
    if(checkUp()){
      spot = new Point(spot.x,spot.y - 1);
      backtracking = false;
    }else if(checkRight()){
      spot = new Point(spot.x + 1,spot.y);
      backtracking = false;
    }else if(checkDown()){
      spot = new Point(spot.x,spot.y + 1);
      backtracking = false;
    }else if(checkLeft()){
      spot = new Point(spot.x - 1,spot.y);
      backtracking = false;
    }else{
      if(spot.x == endSpot.x && spot.y == endSpot.y){
        done = true;
      }else{
        //Dead end
        var backtracking = true;
        sequence.pop();
      }
    }
  }else{
    done = true;
  }

  if(!backtracking){
    map[spot.y][spot.x] = 2;
    sequence.push(new Point(spot.x,spot.y));
    out.setPixelColor(Jimp.rgbaToInt(0,0,255,255),spot.x,spot.y);
  }else{
    out.setPixelColor(Jimp.rgbaToInt(255,255,255,255),spot.x,spot.y);
    spot = sequence[sequence.length - 1]
  }


  if(!done){

    //This is for watching the solver in action
    //setTimeout(dfs,20);
    //out.write("./output/solve.png");


    dfs();
  }else{

    //Done solving!(hopefully) stop timer and show the start and finish points, and then save the picture
    console.log("\n");
    console.timeEnd("Finished");
    out.setPixelColor(Jimp.rgbaToInt(255,0,0,255),spot.x,spot.y);
    out.setPixelColor(Jimp.rgbaToInt(0,255,0, 255),startSpot.x,startSpot.y);
    out.write("./output/solve.png");
  }
}


module.exports = readMaze;
