function BFS(speed) {
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

      explorationTime += speed;
    }

    let dxy = [-1, 0, 1, 0, -1];
    for (let i = 0; i < 4; ++i) {
      let tx = row + dxy[i];
      let ty = col + dxy[i + 1];

      if (
        !(
          tx < 0 ||
          tx >= totalRows ||
          ty < 0 ||
          ty >= totalCols ||
          distanceFromSrc[tx][ty] !== inf ||
          document
            .getElementById(`row-${tx}-col-${ty}`)
            .classList.contains("obstacle-cell")
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
      for (let i = 0; i < 4; ++i) {
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
          break;
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
      finalPathExplorationTime += speed;
    }

    console.log("Path UI done");
    console.log(finalPath);
  }
}
