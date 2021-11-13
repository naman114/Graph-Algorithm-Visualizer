let distanceFromSrc;
const inf = 100000;
let state;

let dx = [0, 0, 1, -1];
let dy = [1, -1, 0, 0];

let explorationTime;
let incrementSpeed;

function pathFinder(row, col, dist) {
  console.log(row, col);
  if (row == desRow && col == desCol) {
    distanceFromSrc[row][col] = dist;
    state = true;
    return;
  }

  let currentCellHTML = document.getElementById(`row-${row}-col-${col}`);

  if (
    row < 0 ||
    col < 0 ||
    row >= totalRows ||
    col >= totalCols ||
    currentCellHTML.classList.contains("obstacle-cell") ||
    state == true ||
    distanceFromSrc[row][col] !== inf
  )
    return;

  distanceFromSrc[row][col] = dist;

  if (row !== srcRow || col !== srcCol) {
    setTimeout(() => {
      currentCellHTML.classList.add("explore-cell");
    }, explorationTime);

    explorationTime += incrementSpeed;
  }

  for (let i = 0; i < 4; ++i) {
    pathFinder(row + dx[i], col + dy[i], dist + 1);
  }
}

function DFS(speed) {
  explorationTime = speed;
  incrementSpeed = speed;
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
  pathFinder(srcRow, srcCol, 0);
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
      finalPathExplorationTime += incrementSpeed;
    }

    console.log("Path UI done");
    console.log(finalPath);
  }
}
