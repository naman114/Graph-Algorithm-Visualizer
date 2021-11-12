console.log("Connected");
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

// Adding obstacles on drag & bombs on right click
let allGridCells = document.querySelectorAll(".grid-cell");
let mouseDown = false;

for (let cell of allGridCells) {
  let row = cell.id.split("-")[1];
  let col = cell.id.split("-")[3];
  if ((row == srcRow && col == srcCol) || (row == desRow && col == desCol))
    continue;

  // Obstacles
  cell.addEventListener("mousedown", (e) => {
    if (e.ctrlKey) {
      cell.classList.add("bomb-cell");
    } else {
      mouseDown = true;
      cell.classList.add("obstacle-cell");
    }
  });
  cell.addEventListener("mouseover", (e) => {
    if (mouseDown) {
      cell.classList.add("obstacle-cell");
    }
  });
}
document.addEventListener("mouseup", () => {
  mouseDown = false;
});

// Starting Dijkstra on click
let startBtn = document.getElementById("start");
startBtn.addEventListener("click", () => {
  Dijkstra();
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

{
  const top = 0,
    parent = (c) => ((c + 1) >>> 1) - 1,
    left = (c) => (c << 1) + 1,
    right = (c) => (c + 1) << 1;
  class PriorityQueue {
    constructor(c = (d, e) => d > e) {
      (this._heap = []), (this._comparator = c);
    }
    size() {
      return this._heap.length;
    }
    isEmpty() {
      return 0 == this.size();
    }
    peek() {
      return this._heap[top];
    }
    push(...c) {
      return (
        c.forEach((d) => {
          this._heap.push(d), this._siftUp();
        }),
        this.size()
      );
    }
    pop() {
      const c = this.peek(),
        d = this.size() - 1;
      return (
        d > top && this._swap(top, d), this._heap.pop(), this._siftDown(), c
      );
    }
    replace(c) {
      const d = this.peek();
      return (this._heap[top] = c), this._siftDown(), d;
    }
    _greater(c, d) {
      return this._comparator(this._heap[c], this._heap[d]);
    }
    _swap(c, d) {
      [this._heap[c], this._heap[d]] = [this._heap[d], this._heap[c]];
    }
    _siftUp() {
      for (let c = this.size() - 1; c > top && this._greater(c, parent(c)); )
        this._swap(c, parent(c)), (c = parent(c));
    }
    _siftDown() {
      for (
        let d, c = top;
        (left(c) < this.size() && this._greater(left(c), c)) ||
        (right(c) < this.size() && this._greater(right(c), c));

      )
        (d =
          right(c) < this.size() && this._greater(right(c), left(c))
            ? right(c)
            : left(c)),
          this._swap(c, d),
          (c = d);
    }
  }
  window.PriorityQueue = PriorityQueue;
}

function Dijkstra() {
  const pq = new PriorityQueue((a, b) => a[0] < b[0]); // path weight, row, col
  pq.push([0, srcRow, srcCol, [[srcRow, srcCol]]]);

  let visited = [];

  for (let i = 0; i < totalRows; ++i) {
    let currentRow = [];
    for (let j = 0; j < totalCols; ++j) {
      currentRow.push(false);
    }
    visited.push(currentRow);
  }

  let finalPath;

  // Exploration time in milliseconds
  let explorationTime = 30;

  while (!pq.isEmpty()) {
    let currentCell = pq.pop();
    let weight = currentCell[0];
    let row = currentCell[1];
    let col = currentCell[2];
    let path = currentCell[3];

    console.log(weight);

    // console.log(weight);
    if (row == desRow && col == desCol) {
      console.log("YES");
      finalPath = path;
      break;
    }
    console.log("Hello");

    let currentCellHTML = document.getElementById(`row-${row}-col-${col}`);

    if (row !== srcRow || col !== srcCol) {
      setTimeout(() => {
        currentCellHTML.classList.add("explore-cell");
      }, explorationTime);
      explorationTime += 30;
    }

    let dxy = [-1, 0, 1, 0, -1];
    for (let i = 0; i < 4; ++i) {
      let tx = row + dxy[i];
      let ty = col + dxy[i + 1];
      // console.log(row, col, tx, ty);
      if (
        !(
          tx < 0 ||
          tx >= totalRows ||
          ty < 0 ||
          ty >= totalCols ||
          visited[tx][ty] ||
          document
            .getElementById(`row-${tx}-col-${ty}`)
            .classList.contains("obstacle-cell")
        )
      ) {
        let targetCellHTML = document.getElementById(`row-${tx}-col-${ty}`);
        let tempPath = path;
        tempPath.push([tx, ty]);

        if (targetCellHTML.classList.contains("bomb-cell")) {
          pq.push([weight + 10, tx, ty, tempPath]);
        } else {
          pq.push([weight + 1, tx, ty, tempPath]);
        }
        visited[tx][ty] = true;
      }
    }
  }
  console.log(finalPath);
  console.log("Dijkstra done");

  if (finalPath) {
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

      let targetCellHTML = document.getElementById(`row-${tx}-col-${ty}`);
      if (
        !(
          tx < 0 ||
          tx >= totalRows ||
          ty < 0 ||
          ty >= totalCols ||
          distanceFromSrc[tx][ty] !== inf ||
          targetCellHTML.classList.contains("obstacle-cell")
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
