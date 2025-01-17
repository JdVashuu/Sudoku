const N = 9;
let K = 47;
const SRN = 3;
let mat = new Array(N);
for (let i = 0; i < N; i++) {
  mat[i] = new Array(N);
  mat[i].fill(0);
}
let user_mat;

//creating the board and giving each one of them unique ID
const board = document.getElementById("grid-container");
var count = 1;

for (let i = 0; i < 9; i++) {
  const parentdiv = document.createElement(`div`);
  parentdiv.classList.add("parent");
  parentdiv.id = `parent${i}`;

  for (let j = 0; j < 9; j++) {
    const childDiv = document.createElement(`div`);
    const value = document.createTextNode("");

    childDiv.classList.add("child");
    childDiv.id = count;
    childDiv.appendChild(value);
    count++;
    parentdiv.appendChild(childDiv);
  }
  board.appendChild(parentdiv);
}

//to set a particular value of the tile
function setValue(place, value) {
  const tile = document.getElementById(place);
  if (tile) {
    tile.textContent = value;
  } else {
    console.log(`tile with ID ${place} not found.`);
  }
  return;
}

function rng() {
  return Math.floor(Math.random() * 9 + 1);
}

let activeBoard = false;

async function ActuallygenerateBoard() {
  console.log("Generating the sudoku");

  fillDiagonal();
  await fillRemaining(0, 0);
  removeElement();
  matrixConvert();

  assignColour();
  console.log("Finished generating sudoku");
  activeBoard = true;

  user_mat = mat.map((innerArray) => [...innerArray]);
}

function assignColour() {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (mat[i][j] === 0) {
        let parent = findParent(i, j);
        let temp = (i % 3) * 3 + (j % 3);
        let place = 9 * parent + temp;

        let tile = document.getElementById(place);
        tile.classList.add("editable");
      }
    }
  }
}

function generateBoard() {
  if (activeBoard == false) {
    ActuallygenerateBoard();
  } else {
    return;
  }
}

function fillDiagonal() {
  for (let i = 0; i < N; i += SRN) {
    fillBox(i, i);
  }
}

function unUsedInBox(rowStart, colStart, num) {
  for (let i = 0; i < SRN; i++) {
    for (let j = 0; j < SRN; j++) {
      if (mat[rowStart + i][colStart + j] === num) {
        return false;
      }
    }
  }
  return true;
}

function unUsedInRow(i, num) {
  for (let j = 0; j < N; j++) {
    if (mat[i][j] === num) {
      return false;
    }
  }
  return true;
}

function unUsedInCol(j, num) {
  for (let i = 0; i < N; i++) {
    if (mat[i][j] === num) {
      return false;
    }
  }
  return true;
}

function fillBox(row, col) {
  let num = 0;
  for (let i = 0; i < SRN; i++) {
    for (let j = 0; j < SRN; j++) {
      while (true) {
        num = rng();
        if (unUsedInBox(row, col, num)) {
          break;
        }
      }
      mat[row + i][col + j] = num;
    }
  }
}

function matrixConvert() {
  let place = 0;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      let parent = findParent(i, j);
      let temp = (i % 3) * 3 + (j % 3);
      place = 9 * parent + temp + 1;

      let value = mat[i][j];
      if (value === 0) continue;

      setValue(place, value);
    }
  }
}

function findParent(i, j) {
  let row = Math.floor(i / 3);
  let col = Math.floor(j / 3);
  let parent = 3 * row + col;
  return parent;
}

function checkSafety(i, j, num) {
  return (
    unUsedInBox(i - (i % SRN), j - (j % SRN), num) &&
    unUsedInRow(i, num) &&
    unUsedInCol(j, num)
  );
}

async function fillRemaining(i, j) {
  if (i === N - 1 && j === N - 1) return true;

  if (j === N) {
    i += 1;
    j = 0;
  }
  if (mat[i][j] !== 0) return fillRemaining(i, j + 1);

  for (let num = 1; num <= N; num++) {
    if (checkSafety(i, j, num)) {
      mat[i][j] = num;
      if (await fillRemaining(i, j + 1)) {
        return true;
      }
      mat[i][j] = 0;
    }
  }
  return false;
}

function removeElement() {
  let count = K;

  while (count !== 0) {
    let i = Math.floor(Math.random() * N);
    let j = Math.floor(Math.random() * N);
    if (mat[i][j] !== 0) {
      count--;
      mat[i][j] = 0;
    }
  }

  return;
}

async function clearBoard() {
  console.log("Removing elements");
  for (let i = 0; i < N; i++) {
    mat[i].fill(0);
  }

  for (let i = 1; i <= N * N; i++) {
    setValue(i, ""); // Set empty string as the value for each tile
  }
  activeBoard = false;
  checkSolved = false;
  document.querySelectorAll(".child.clicked").forEach((clickedDiv) => {
    clickedDiv.classList.remove("clicked");
  });
  document.querySelectorAll(".child.editable").forEach((clickedDiv) => {
    clickedDiv.classList.remove("editable");
  });
}

function findEmptyCell() {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (mat[i][j] === 0) {
        return [i, j];
      }
    }
  }
  return null;
}

function crossHatching(mat) {
  const possibilities = Array.from({ length: N }, () =>
    Array.from({ length: N }, () => []),
  );

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (mat[i][j] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (checkSafety(i, j, num)) {
            possibilities[i][j].push(num);
          }
        }
      }
    }
  }
  return possibilities;
}

function solveSudoku() {
  const possibilities = crossHatching(mat);
  return solveSudokuWithPossibilities(mat, possibilities);
}

function solveSudokuWithPossibilities(mat, possibilities) {
  const emptyCell = findEmptyCell(mat);
  if (!emptyCell) {
    return true;
  }
  const [i, j] = emptyCell;
  const nums = possibilities[i][j];

  for (const num of nums) {
    if (checkSafety(i, j, num)) {
      mat[i][j] = num;
      if (solveSudokuWithPossibilities(mat, possibilities)) {
        return true;
      }
      mat[i][j] = 0; //Backtrack
    }
  }
  return false;
}

let checkSolved = false;
function solveBoard() {
  if (activeBoard === true && checkSolved === false) {
    if (solveSudoku()) {
      // Check if solving was successful
      checkSolved = true;
      matrixConvert();

      console.log("attempting to solve");
      console.log(mat);
    } else {
      console.log("No solution exists");
    }
  } else {
    console.log("Either the board is not generated or it is already solved");
  }
}

document.querySelectorAll(".child").forEach((div) => {
  div.addEventListener("click", function () {
    if (this.classList.contains("clicked")) {
      this.classList.remove("clicked");
    } else {
      document.querySelectorAll(".child.clicked").forEach((clickedDiv) => {
        clickedDiv.classList.remove("clicked");
      });

      this.classList.toggle("clicked");
    }
  });
});

// Function to find the global position (i, j) from a given place
function findPosition(place) {
  place -= 1;
  let parent = Math.floor(place / 9);

  let localIndex = place % 9;
  let localRow = Math.floor(localIndex / 3);
  let localCol = localIndex % 3;

  let row = Math.floor(parent / 3) * 3 + localRow;
  let col = (parent % 3) * 3 + localCol;

  return [row, col];
}

function inputVal(num) {
  //make this smarter by only letting the empty places be valid to change
  const selected_tile = document.querySelector(".clicked");
  let place;

  if (selected_tile) {
    place = parseInt(selected_tile.id, 10);
    let [i, j] = findPosition(place);

    user_mat[i][j] = num;
    console.log(user_mat);
  } else {
    console.log("no tile is selected!");
  }

  if (num !== 0) {
    setValue(place, num);
  } else if (num === 0) {
    setValue(place, "");
  }
}

function compareMatrices() {
  //try to return true or false
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (user_mat[i][j] !== mat[i][j]) {
        return false;
      }
    }
  }
  return true;
}

//this is a test run of the keyboard  that i just recieved, looks good so far
function checkSoln() {
  let check = compareMatrices();
  if (check === true) {
    alert("you have successfully solved the board! congrats");
  } else {
    alert("the board seems incorrect");
    showErrors();
  }
}
