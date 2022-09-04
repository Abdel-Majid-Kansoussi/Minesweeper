const container = document.querySelector(".container");
const timerEl = document.querySelector(".timer");
const btnRestart = document.querySelector(".btn-restart");
const flagsEl = document.querySelector(".flags");
const bombs = 10;
const rows = 9;
const columns = 9;
let squares = [];
let isGameOver = false;
let isWinning = false;
let isCounting = false;
let flags = 0;
let time = 0;

const startTimer = function () {
  if (isCounting) return;
  isCounting = true;
  const timerId = setInterval(function () {
    time++;
    timerEl.textContent = time;
    if (isGameOver || isWinning) clearInterval(timerId);
  }, 1000);
};

function createMines() {
  for (let i = 0; i < rows; i++) {
    squares.push(new Array(columns).fill(0));
  }
  squares.forEach((row, i) =>
    row.forEach((_, j) => {
      const square = document.createElement("div");
      container.appendChild(square);
      square.classList.add("mine");
      square.classList.add("square");
      square.dataset.row = i;
      square.dataset.column = j;
      squares[i][j] = square;
    })
  );
}

function addBombs() {
  for (let i = 1; i <= bombs; i++) {
    let r, c;
    do {
      r = Math.floor(Math.random() * rows);
      c = Math.floor(Math.random() * columns);
    } while (squares[r][c].classList.contains("bomb"));
    squares[r][c].classList.add("bomb");
    squares[r][c].dataset.value = "💣";
  }
}

function getAdjacentSquares(square) {
  const r = +square.dataset.row;
  const c = +square.dataset.column;
  let adjSquares = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (r + i < rows && r + i >= 0 && c + j < columns && c + j >= 0)
        if (i != 0 || j != 0) adjSquares.push(squares[r + i][c + j]);
    }
  }
  return adjSquares;
}

function countAdjacentBombs(square) {
  return getAdjacentSquares(square).filter((square) =>
    square.classList.contains("bomb")
  ).length;
}

function addNumbers() {
  squares.forEach((row) =>
    row.forEach((square) => {
      if (square.classList.contains("bomb")) return;
      const total = countAdjacentBombs(square);
      if (total == 0) square.dataset.value = "";
      else square.dataset.value = total;
      if (total == 1) square.classList.add("one");
      if (total == 2) square.classList.add("two");
      if (total == 3) square.classList.add("three");
      if (total == 4) square.classList.add("four");
      if (total == 5) square.classList.add("five");
      if (total == 6) square.classList.add("six");
      if (total == 7) square.classList.add("seven");
      if (total == 8) square.classList.add("eight");
      if (total == 9) square.classList.add("nine");
    })
  );
}

function displaySquare(square) {
  square.classList.remove("mine");
  square.classList.remove("flag");
  square.textContent = square.dataset.value;
}

function checkGameOver(square) {
  if (square.classList.contains("bomb")) isGameOver = true;
}

function checkWin() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (
        squares[i][j].classList.contains("mine") &&
        !squares[i][j].classList.contains("bomb")
      ) {
        return;
      }
    }
  }
  isWinning = true;
}

function Win() {
  if (!isWinning) return;
  container.removeEventListener("click", click);
  container.removeEventListener("contextmenu", addFlag);
  btnRestart.textContent = "😎";
  alert("YOU WIN");
}

function displayAdjacentSquares(square) {
  const adjSquares = getAdjacentSquares(square);
  adjSquares.forEach((square) => displaySquare(square));
}

function displayFreeArea(square) {
  if (square.dataset.value != 0) return;
  square.classList.add("visited");
  displayAdjacentSquares(square);
  const adjFreeSquares = getAdjacentSquares(square).filter(
    (sq) => sq.dataset.value == 0 && !sq.classList.contains("visited")
  );
  if (adjFreeSquares.length == 0) return;
  adjFreeSquares.forEach((square) => displayFreeArea(square));
}

function displayAllBombs() {
  if (!isGameOver) return;
  squares.forEach((row) =>
    row.forEach((square) => {
      if (!square.classList.contains("bomb")) return;
      square.classList.remove("mine");
      square.classList.remove("flag");
      square.textContent = square.dataset.value;
    })
  );
}

function addFlag(event) {
  if (!event.target.classList.contains("mine")) return;
  event.preventDefault();
  const square = event.target;
  if (!square.classList.contains("flag")) {
    square.classList.add("flag");
    square.textContent = "🚩";
    flags++;
  } else {
    square.classList.remove("flag");
    square.textContent = "";
    flags--;
  }
  flagsEl.textContent = bombs - flags;
}

function click(event) {
  if (!event.target.classList.contains("mine")) return;
  startTimer();
  displaySquare(event.target);
  displayFreeArea(event.target);
  checkGameOver(event.target);
  checkWin();
  gameOver();
  Win();
  displayAllBombs();
}

function gameOver() {
  if (!isGameOver) return;
  container.removeEventListener("click", click);
  container.removeEventListener("contextmenu", addFlag);
  btnRestart.textContent = "🤕";
}
function restart() {
  btnRestart.classList.add("pressed");
  setTimeout(() => btnRestart.classList.remove("pressed"), 200);
  isCounting = false;
  isGameOver = false;
  isWinning = false;
  time = 0;
  flags = 0;
  btnRestart.textContent = "🙂";
  timerEl.textContent = "0";
  flagsEl.textContent = bombs;
  squares.forEach((row) =>
    row.forEach((square) => {
      square.classList.remove("one");
      square.classList.remove("two");
      square.classList.remove("three");
      square.classList.remove("four");
      square.classList.remove("five");
      square.classList.remove("six");
      square.classList.remove("seven");
      square.classList.remove("eight");
      square.classList.remove("nine");
      square.classList.remove("visited");
      square.classList.remove("bomb");
      square.classList.remove("flag");
      square.classList.add("mine");
      square.textContent = "";
      square.dataset.value = "";
    })
  );
  addBombs();
  addNumbers();
  startTimer();
  container.addEventListener("click", click);
  container.addEventListener("contextmenu", addFlag);
}

function init() {
  timerEl.textContent = "0";
  flagsEl.textContent = bombs;
  createMines();
  addBombs();
  addNumbers();
  container.addEventListener("click", click);
  container.addEventListener("contextmenu", addFlag);
  btnRestart.addEventListener("click", restart);
}

init();
