// Defining Source and Destination Cells
const totalRows = 16;
const totalCols = 32;

const srcRow = 9;
const srcCol = 7;
const desRow = 11;
const desCol = 27;

// Setting / refreshing the grid
setGrid();

// Adding obstacles on drag
addObstacleEventListeners();

// Starting BFS on click
let startBtn = document.getElementById("start");
startBtn.addEventListener("click", () => {
  BFS();
});

// Reset grid button
let resetGridBtn = document.getElementById("reset-grid");
resetGridBtn.addEventListener("click", () => {
  resetGrid();
});

function setGrid() {
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
}

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

function addObstacleEventListeners() {
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
}

function BFS() {
  let bfsQueue = [];
  bfsQueue.push([srcRow, srcCol]);

  let distanceFromSrc = [];
  const inf = 100000;

  // Initialise distanceFromSrc for every cell as inf except src cell
  for (let i = 0; i < totalRows; ++i) {
    let currentRow = [];
    for (let j = 0; j < totalCols; ++j) {
      if (i === srcRow && j === srcCol) currentRow.push(0);
      else currentRow.push(inf);
    }
    distanceFromSrc.push(currentRow);
  }

  // Exploration time in milliseconds
  let explorationTime = 50;
  while (bfsQueue.length !== 0) {
    let currentCell = bfsQueue.shift();
    let row = currentCell[0];
    let col = currentCell[1];

    if (row == desRow && col == desCol) break;

    let currentCellHTML = document.getElementById(`row-${row}-col-${col}`);
    if (row !== srcRow || col !== srcCol) {
      setTimeout(() => {
        currentCellHTML.classList.add("explore-cell");
      }, explorationTime);

      explorationTime += 50;
    }

    let dxy = [-1, 0, 1, 0, -1];
    for (let i = 0; i < 5; ++i) {
      let tx = row + dxy[i];
      let ty = col + dxy[i + 1];

      if (
        !(
          tx < 0 ||
          tx >= totalRows ||
          ty < 0 ||
          ty >= totalCols ||
          distanceFromSrc[tx][ty] !== inf ||
          currentCellHTML.classList.contains("obstacle-cell")
        )
      ) {
        bfsQueue.push([tx, ty]);
        distanceFromSrc[tx][ty] = distanceFromSrc[row][col] + 1;
      }
    }
  }

  if (distanceFromSrc[desRow][desCol] !== inf) {
    let finalPath = [[desRow, desCol]];
    let curX = desRow;
    let curY = desCol;

    while (curX !== srcRow || curY !== srcCol) {
      let currentCellHTML = document.getElementById(`row-${curX}-col-${curY}`);
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
            currentCellHTML.classList.contains("obstacle-cell")
          )
        ) {
          finalPath.push([tx, ty]);
          curX = tx;
          curY = ty;
          break;
        }
      }
    }

    finalPath.reverse();
    let finalPathExplorationTime = explorationTime;
    for (let i = 1; i < finalPath.length - 1; ++i) {
      let row = finalPath[i][0];
      let col = finalPath[i][1];
      setTimeout(() => {
        let currentCellHTML = document.getElementById(`row-${row}-col-${col}`);
        currentCellHTML.classList.add("finalpath-cell");
      }, finalPathExplorationTime);
      finalPathExplorationTime += 50;
    }
  }
}
