// Defining Source and Destination Cells
const totalRows = 16;
const totalCols = 32;

const srcRow = 9;
const srcCol = 7;
const desRow = 11;
const desCol = 27;

// Setting the grid
let gridContainer = document.querySelector(".grid-container");
let createdGrid = "";

for (let i = 0; i < totalRows; ++i) {
  currentRow = `<div class="grid-cell-row">`;

  for (let j = 0; j < totalCols; ++j) {
    if (i === srcRow && j === srcCol)
      currentRow += `<div class="grid-cell source-cell" id="row-${i}-col-${j}"></div>`;
    else if (i === desRow && j === desCol)
      currentRow += `<div class="grid-cell destination-cell" id="row-${i}-col-${j}"></div>`;
    else {
      currentRow += `<div class="grid-cell" id="row-${i}-col-${j}"></div>`;
    }
  }
  currentRow += `</div>`;
  createdGrid += currentRow;
}

gridContainer.innerHTML = createdGrid;

// Adding obstacles on drag
let allGridCells = document.querySelectorAll(".grid-cell");
let mouseDown = false;

for (let cell of allGridCells) {
  let row = cell.id.split("-")[1];
  let col = cell.id.split("-")[3];
  if ((row == srcRow && col == srcCol) || (row == desRow && col == desCol))
    continue;

  cell.addEventListener("mousedown", () => {
    mouseDown = true;
    cell.classList.add("obstacle-cell");
  });
  cell.addEventListener("mouseover", () => {
    if (mouseDown) cell.classList.add("obstacle-cell");
  });
}
document.addEventListener("mouseup", () => {
  mouseDown = false;
});

// Starting BFS on click
let startBtn = document.getElementById("start");
startBtn.addEventListener("click", () => {
  DFS();
});

// Exploration time in milliseconds
let explorationTime = 30;

// Reset grid button
let resetGridBtn = document.getElementById("reset-grid");
resetGridBtn.addEventListener("click", () => {
  resetGrid();
  explorationTime = 30;
});

function resetGrid() {
  let allGridCells = document.querySelectorAll(".grid-cell");
  for (let cell of allGridCells) {
    let row = cell.id.split("-")[1];
    let col = cell.id.split("-")[3];
    if ((row == srcRow && col == srcCol) || (row == desRow && col == desCol))
      continue;

    cell.classList = "grid-cell";
  }
}

let distanceFromSrc;
const inf = 100000;
let state;

let dx=[0,0,1,-1];
let dy=[1,-1,0,0];


function pathFinder(row,col,dist){
    console.log(row,col);
    if(row==desRow && col==desCol)
    {
        distanceFromSrc[row][col]=dist;
        state=true;
        return;
    }

    let currentCellHTML = document.getElementById(`row-${row}-col-${col}`);

    if(row<0 || col<0 || row>=totalRows || col>=totalCols || currentCellHTML.classList.contains("obstacle-cell")
     || state==true || distanceFromSrc[row][col] !== inf)
    return;

    distanceFromSrc[row][col]=dist;

    if (row !== srcRow || col !== srcCol) {
        setTimeout(() => {
          currentCellHTML.classList.add("explore-cell");
        }, explorationTime);
  
        explorationTime += 30;
      }

      for (let i = 0; i < 4; ++i){
          pathFinder(row+dx[i],col+dy[i],dist+1);
      }
}


function DFS(){
    console.log("Hello");
    distanceFromSrc = [];
    // Initialise distanceFromSrc for every cell as inf except src cell
    for (let i = 0; i < totalRows; ++i) {
        let currentRow = [];
        for (let j = 0; j < totalCols; ++j) {
        if (i === srcRow && j === srcCol) currentRow.push(inf);
        else currentRow.push(inf);
        }
        distanceFromSrc.push(currentRow);
    }

    state = false;

    // call a function pathFinder
    pathFinder(srcRow,srcCol,0);
    console.log(distanceFromSrc[desRow][desCol]);
    console.log(state);

    if (state) {
        let finalPath = [[desRow, desCol]];
        let curX = desRow;
        let curY = desCol;
    
        while (curX !== srcRow || curY !== srcCol) {
          let dxy = [-1, 0, 1, 0, -1];
          for (let i = 0; i < 5; ++i) {
            let tx = curX + dxy[i];
            let ty = curY + dxy[i + 1];
    
            if (
              !(
                tx < 0 ||
                tx >= totalRows ||
                ty < 0 ||
                ty >= totalCols ||
                distanceFromSrc[tx][ty] !== distanceFromSrc[curX][curY] - 1 ||
                document
                  .getElementById(`row-${tx}-col-${ty}`)
                  .classList.contains("obstacle-cell")
              )
            ) {
              finalPath.push([tx, ty]);
              curX = tx;
              curY = ty;
              // break;
            }
          }
        }
    
        console.log("Path done");
    
        finalPath.reverse();
        let finalPathExplorationTime = explorationTime;
        for (let i = 1; i < finalPath.length - 1; ++i) {
          let row = finalPath[i][0];
          let col = finalPath[i][1];
          setTimeout(() => {
            let currentCellHTML = document.getElementById(`row-${row}-col-${col}`);
            currentCellHTML.classList.add("finalpath-cell");
          }, finalPathExplorationTime);
          finalPathExplorationTime += 30;
        }
    
        console.log("Path UI done");
        console.log(finalPath);
      }
}