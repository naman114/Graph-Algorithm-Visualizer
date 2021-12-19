// Defining Source and Destination Cells
let totalRows = 16;
let totalCols = 32;

let srcRow = 9;
let srcCol = 7;
let desRow = 11;
let desCol = 27;

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

let algoPicker = document.querySelectorAll(".dropdown-item.algo-option");
let visualizeBtn = document.getElementById("visualize-btn");
let resetBtn = document.getElementById("reset-btn");

// Reset grid button
resetBtn.addEventListener("click", () => {
  resetGrid();
});

function resetGrid() {
  let allGridCells = document.querySelectorAll(".grid-cell");
  for (let cell of allGridCells) {
    let row = cell.id.split("-")[1];
    let col = cell.id.split("-")[3];
    if (row == srcRow && col == srcCol)
      cell.classList = "grid-cell source-cell";
    else if (row == desRow && col == desCol)
      cell.classList = "grid-cell destination-cell";
    else cell.classList = "grid-cell";
  }
}

function clearExploration() {
  let allGridCells = document.querySelectorAll(".grid-cell");
  for (let cell of allGridCells) {
    cell.classList.remove("explore-cell");
    cell.classList.remove("finalpath-cell");
  }
}

let alogrithmCodes = {
  "Breadth First Search": 1,
  "Depth First Search": 2,
  "Dijkstra's Algorithm": 3,
  "A* Search Algorithm": 4,
};

for (let dropDownItem of algoPicker) {
  dropDownItem.addEventListener("click", () => {
    clearExploration();
    visualizeBtn.innerText = `Visualize ${dropDownItem.innerText}!`;
    visualizeBtn.value = alogrithmCodes[dropDownItem.innerText];
  });
}

let algoSpeedPicker = document.querySelectorAll(".dropdown-item.algo-speed");
let algoSpeed = document.getElementById("speed-dropdown");
let speedCodes = {
  Fast: "30",
  Average: "70",
  Slow: "100",
};
for (let dropDownItem of algoSpeedPicker) {
  dropDownItem.addEventListener("click", () => {
    algoSpeed.innerText = `Speed: ${dropDownItem.innerText}`;
    algoSpeed.dataset.speed = speedCodes[dropDownItem.innerText];
  });
}

// Starting visualization on click
visualizeBtn.addEventListener("click", () => {
  clearExploration();
  let explorationTime = Number(algoSpeed.dataset.speed);
  if (visualizeBtn.value == "1") BFS(explorationTime);
  else if (visualizeBtn.value == "2") DFS(explorationTime);
  else if (visualizeBtn.value == "3") Dijkstra(explorationTime);
  else if (visualizeBtn.value == "4") AStar(explorationTime);
  // console.clear();
});

/*
// Draggability
// https://jsfiddle.net/radonirinamaminiaina/zfnj5rv4/
var dragged;
let sourceCell = document.querySelector(".grid-cell.source-cell");
let destCell = document.querySelector(".grid-cell.destination-cell");

let cellsToDrag = document.querySelectorAll(".grid-cell");

for (let cell of cellsToDrag) {
  cell.addEventListener("drag", () => {}, false);

  cell.addEventListener(
    "dragstart",
    (e) => {
      dragged = e.target;
      e.target.style.opacity = 0.5;
    },
    false
  );

  cell.addEventListener(
    "dragend",
    (e) => {
      e.target.style.opacity = "";
    },
    false
  );

  cell.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  cell.addEventListener(
    "dragenter",
    (e) => {
      console.log(e.target.className);
      if (e.target.className == "grid-cell") {
        e.target.style.background = "rgba(128, 128, 128, 0.288)";
      }
    },
    false
  );

  cell.addEventListener(
    "dragleave",
    (e) => {
      if (e.target.className == "grid-cell") {
        e.target.style.background = "";
      }
    },
    false
  );

  cell.addEventListener(
    "drop",
    (e) => {
      e.preventDefault();
      if (e.target.className == "grid-cell") {
        e.target.style.background = "";
        if (dragged.classList.contains("source-cell")) {
          dragged.classList.remove("source-cell");
          e.target.classList.add("source-cell");
          let idData = e.target.id.split("-");
          let row = Number(idData[1]);
          let col = Number(idData[3]);
          srcRow = row;
          srcCol = col;
        } else {
          dragged.classList.remove("destination-cell");
          e.target.classList.add("destination-cell");
          let idData = e.target.id.split("-");
          let row = Number(idData[1]);
          let col = Number(idData[3]);
          desRow = row;
          desCol = col;
        }
      }
    },
    false
  );
}
*/
