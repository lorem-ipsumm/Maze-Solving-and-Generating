# Maze-Solving-and-Generating
This is a program I've created that generates and solves mazes using DFS and Randomized Prim's Algorithm!


After watching one numberphile video on maze solving I decided to jump in and make my own with no prior experience with mazes or algorithms. My first attempt at making a maze solver only worked in extremely specific situation so I had to do some research and look into how these kinds of things are implemented. That's when I came across DFS (Depth First Search) and Recursive Backtracking. It wasn't too long until I was able to get a basic version of that running. After it solved my small 5x5 maze that I made in GIMP I tried making some more mazes by hand, and after a while that because very tedious so I decided to look into maze generation. My first attempt was to just jump right in again with my new found knowledge of DFS. That failed miserably, but it wasn't long until I found out about Randomized Prim's Algorithm. I saw several algorithms, but this one seemed to fit my needs the most. It took quite a bit for me to get it up and running, but eventually it all came together. This is the final product!:



![alt tag](/res/screenshot.PNG)



For image manipulation I used [Jimp](https://github.com/oliver-moran/jimp), so I could create images and read individual pixels. Other than that the code was purely javascript(node to be specific)


Algorithms Page:
https://en.wikipedia.org/wiki/Maze_generation_algorithm


# How To Run:

Clone the repository to the directory of your choice:
```bash
git clone https://github.com/SolarFloss/Maze-Solving-and-Generating.git
```

Then move into the root directory and run:
``` bash
npm generate.js
```



Feel free to create an issue if you run into any problems.

