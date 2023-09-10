const X_CLASS = "x";
const CIRCLE_CLASS = "circle";
const LARGE_X_CLASS = "large-x";
const LARGE_CIRCLE_CLASS = "large-circle";
const LARGE_CELL_WINNING_COMBINATION = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const WINNING_COMBINATION = [];

for (let i = 0; i < 81; i += 9) {
  //horizontal & vertical
  for (let j = 0; j < 3; j++) {
    const horizontal = [i + j * 3, i + j * 3 + 1, i + j * 3 + 2];
    const vertical = [i + j, i + j + 3, i + j + 6];

    WINNING_COMBINATION.push(horizontal);
    WINNING_COMBINATION.push(vertical);
  }
  //diagonal
  for (let k = 0; k < 1; k++) {
    const diagonal1 = [i, i + 4, i + 8];
    const diagonal2 = [i + 2, i + 4, i + 6];

    WINNING_COMBINATION.push(diagonal1);
    WINNING_COMBINATION.push(diagonal2);
  }
}

const cellElements = document.querySelectorAll("[data-cell]");
const boardElements = document.querySelectorAll(".board");
const winningMessageElement = document.getElementById("winningMessage");
const restartButton = document.getElementById("restartButton");
const winningMessageTextElement = document.querySelector(
  "[data-winning-message-text]"
);
let circleTurn;

cellElements.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    console.log(`Cell index: ${index}`);
  });
});

boardElements.forEach((board, index) => {
  board.addEventListener("click", () => {
    console.log(`Large Cell index: ${index}`);
  });
});

//function declarations

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function checkWin(currentClass) {
  return WINNING_COMBINATION.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

function isDraw() {
  return [...cellElements].every((cell) => {
    return (
      cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    );
  });
}

function endMinigame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = "Draw!";
  } else {
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    const currentLargeClass = circleTurn ? LARGE_CIRCLE_CLASS : LARGE_X_CLASS;
    WINNING_COMBINATION.forEach((combination) => {
      if (
        combination.every((index) =>
          cellElements[index].classList.contains(currentClass)
        )
      ) {
        const boardIndex = Math.floor(combination[0] / 9); // Calculate the board (large cell) index
        const winningBoard = boardElements[boardIndex];
        winningBoard.querySelectorAll("[data-cell]").forEach((cell) => {
          cell.classList.remove("cell");
        });
        winningBoard.classList.add(currentLargeClass);
      }
    });
  }
  continueGame();
}

function switchTurns() {
  circleTurn = !circleTurn;
}

function setBoardHoverClass() {
  boardElements.forEach((board) => {
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    if (circleTurn) {
      board.classList.add(CIRCLE_CLASS);
    } else {
      board.classList.add(X_CLASS);
    }
  });
}

//end of function declarations

startGame();

restartButton.addEventListener("click", startGame);

function startGame() {
  circleTurn = false;
  boardElements.forEach((board) => {
    board.classList.add("allow-click");
  });
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove("show");
}

function continueGame() {
  switchTurns();
  cellElements.forEach((cell) => {
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove("show");
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  placeMark(cell, currentClass);
//when clicked, play in only that board
  const cellIndex = cell.getAttribute("data-cell-index");
  const boardIndex = cell.parentElement.getAttribute("data-board-index");
  boardElements.forEach((board) => {
    board.classList.remove("allow-click");
    board.classList.remove("disable-click");
  });
  document
    .querySelector(`[data-board-index="${cellIndex}"]`)
    .classList.add("allow-click");

  boardElements.forEach((board) => {
    if (board.getAttribute("data-board-index") !== cellIndex) {
      board.classList.add("disable-click");
    }
  });

  if (checkWin(currentClass)) {
    endMinigame(false);
  } else if (isDraw()) {
    endMinigame(true);
  } else {
    switchTurns();
    setBoardHoverClass();
  }
}
