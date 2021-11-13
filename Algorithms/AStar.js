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

function AStar(speed) {
  const pq = new PriorityQueue((a, b) => {
    if (a[0] == b[0]) {
      let ha = Math.abs(desRow - a[1]) + Math.abs(desCol - a[2]);
      let hb = Math.abs(desRow - b[1]) + Math.abs(desCol - b[2]);
      return ha < hb;
    }
    return a[0] < b[0];
  }); // OPEN

  pq.push([0, srcRow, srcCol]);

  let visited = []; // CLOSED
  let distance = [];
  let parent = [];

  let inf = 100000;

  for (let i = 0; i < totalRows; ++i) {
    let currentRowDistance = [];
    let currentRowParent = [];
    let currentRowVisited = [];
    for (let j = 0; j < totalCols; ++j) {
      if (i === srcRow && j === srcCol) currentRowDistance.push(0);
      else currentRowDistance.push(inf);
      currentRowParent.push([null, null]);
      currentRowVisited.push(false);
    }
    distance.push(currentRowDistance);
    parent.push(currentRowParent);
    visited.push(currentRowVisited);
  }

  // Exploration time in milliseconds
  let explorationTime = speed;
  while (!pq.isEmpty()) {
    let currentCell = pq.pop();
    let cur_f_cost = currentCell[0];
    let row = currentCell[1];
    let col = currentCell[2];
    if (visited[row][col]) continue; // Dead nodes
    console.log("Hi");

    visited[row][col] = true; // Adding to CLOSED

    console.log(row, col);
    if (row == desRow && col == desCol) {
      console.log("YES Milgya");
      break;
    }
    console.log("Hello");

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
          visited[tx][ty] ||
          document
            .getElementById(`row-${tx}-col-${ty}`)
            .classList.contains("obstacle-cell")
        )
      ) {
        let g_cost = Math.abs(srcRow - tx) + Math.abs(srcCol - ty);
        let distToNbr = g_cost + 1;

        let h_cost = Math.abs(desRow - tx) + Math.abs(desCol - ty);
        let f_cost = g_cost + h_cost;

        if (distance[tx][ty] > distToNbr) {
          distance[tx][ty] = distToNbr;
          parent[tx][ty] = [row, col];
          pq.push([f_cost, tx, ty]);
        }
      }
    }
  }
  console.log("AStar done");
  console.log(distance[desRow][desCol]);

  if (parent[desRow][desCol][0]) {
    let curX = desRow,
      curY = desCol;
    let finalPath = [];
    while (curX !== srcRow || curY !== srcCol) {
      console.log(curX, curY, parent[curX][curY]);
      let a = parent[curX][curY][0];
      let b = parent[curX][curY][1];
      curX = a;
      curY = b;
      finalPath.push([curX, curY]);
    }
    finalPath.reverse();

    if (finalPath) {
      let finalPathExplorationTime = explorationTime;
      for (let i = 1; i < finalPath.length; ++i) {
        let row = finalPath[i][0];
        let col = finalPath[i][1];
        setTimeout(() => {
          let currentCellHTML = document.getElementById(
            `row-${row}-col-${col}`
          );
          currentCellHTML.classList.add("finalpath-cell");
        }, finalPathExplorationTime);
        finalPathExplorationTime += speed;
      }

      console.log(parent[10][26]);

      console.log("Path UI done");
      console.log(finalPath);
    }
  }
}
