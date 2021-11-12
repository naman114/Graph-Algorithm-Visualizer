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
  AStar();
});

// Reset grid button
let resetGridBtn = document.getElementById("reset-grid");
resetGridBtn.addEventListener("click", () => {
  resetGrid();
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

// Priority Queue
const top = 0;
const parent = i => ((i + 1) >>> 1) - 1;
const left = i => (i << 1) + 1;
const right = i => (i + 1) << 1;

class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this._heap = [];
    this._comparator = comparator;
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  peek() {
    return this._heap[top];
  }
  push(...values) {
    values.forEach(value => {
      this._heap.push(value);
      this._siftUp();
    });
    return this.size();
  }
  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > top) {
      this._swap(top, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }
  replace(value) {
    const replacedValue = this.peek();
    this._heap[top] = value;
    this._siftDown();
    return replacedValue;
  }
  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  _siftUp() {
    let node = this.size() - 1;
    while (node > top && this._greater(node, parent(node))) {
      this._swap(node, parent(node));
      node = parent(node);
    }
  }
  _siftDown() {
    let node = top;
    while (
      (left(node) < this.size() && this._greater(left(node), node)) ||
      (right(node) < this.size() && this._greater(right(node), node))
    ) {
      let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}

function AStar(){

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
  let explorationTime = 30;

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

      explorationTime += 30;
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
  console.log("BFS done");

  if (distanceFromSrc[desRow][desCol] !== inf) {
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
