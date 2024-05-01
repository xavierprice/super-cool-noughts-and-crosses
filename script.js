document.addEventListener("DOMContentLoaded", function () {
  const X_CLASS = "x";
  const CIRCLE_CLASS = "circle";
  const LARGE_X_CLASS = "large-x";
  const LARGE_CIRCLE_CLASS = "large-circle";
  const dataBoard = document.querySelectorAll("[data-board]");
  const cellElements = document.querySelectorAll("[data-cell]");
  const boardElements = document.querySelectorAll(".board");
  const winningMessageElement = document.getElementById("winningMessage");
  const restartButton = document.getElementById("restartButton");
  const restartMediaQuery = document.getElementById("restart-media-query");
  const undoTurnButton = document.getElementById("undo-turn");
  const winningMessageTextElement = document.querySelector(
    "[data-winning-message-text]"
  );
  const overlay = document.querySelector(".overlay");
  let circleTurn;
  let prevBoard = null;
  let prevClickedCell = null;
  let numTurns = 0;
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

  //function declarations

  function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
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

  function continueGame() {
    boardElements.forEach((board) => {
      if (
        board == prevBoard &&
        (prevBoard.classList.contains(LARGE_CIRCLE_CLASS) ||
          prevBoard.classList.contains(LARGE_X_CLASS))
      )
        undoTurnEnabled = false;
      updateButtonStyle();
      {
      }
    });
    switchTurns();
    updateViewTurnBox();
    cellElements.forEach((cell) => {
      cell.removeEventListener("click", handleClick);
      cell.addEventListener("click", handleClick, { once: true });
    });
    setBoardHoverClass();
  }

  function continueGameNoSwitch() {
    cellElements.forEach((cell) => {
      cell.removeEventListener("click", handleClick);
      cell.addEventListener("click", handleClick, { once: true });
    });
    setBoardHoverClass();
  }

  function isDraw() {
    return [...boardElements].every((board) => {
      return (
        board.classList.contains(LARGE_X_CLASS) ||
        board.classList.contains(LARGE_CIRCLE_CLASS)
      );
    });
  }

  function checkMinigameWin(currentClass) {
    return WINNING_COMBINATION.some((combination) => {
      return combination.every((index) => {
        return cellElements[index].classList.contains(currentClass);
      });
    });
  }

  function checkWin(currentLargeClass) {
    return LARGE_CELL_WINNING_COMBINATION.some((combination) => {
      return combination.every((index) => {
        return dataBoard[index].classList.contains(currentLargeClass);
      });
    });
  }

  function endGame(draw) {
    if (draw) {
      winningMessageTextElement.innerText = "Draw!";
    } else {
      winningMessageTextElement.innerText = `${
        circleTurn ? "Circle" : "Cross"
      } Wins!`;
      winningMessageElement.setAttribute(
        "data-winning-message-text",
        circleTurn ? "circle" : "cross"
      );
    }
    winningMessageElement.classList.add("show");
  }

  function endMinigame() {
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    const currentLargeClass = circleTurn ? LARGE_CIRCLE_CLASS : LARGE_X_CLASS;
    WINNING_COMBINATION.forEach((combination) => {
      if (
        combination.every((index) =>
          cellElements[index].classList.contains(currentClass)
        )
      ) {
        const boardIndex = Math.floor(combination[0] / 9);
        const winningBoard = boardElements[boardIndex];
        winningBoard.querySelectorAll("[data-cell]").forEach((cell) => {
          cell.classList.remove("cell");
        });
        winningBoard.classList.add(currentLargeClass);
      }
    });
    if (checkWin(currentLargeClass)) {
      endGame(false);
    } else if (isDraw()) {
      endGame(true);
    } else {
      continueGame();
    }
  }

  //delete maybe
  overlay.addEventListener("click", function () {
    overlay.classList.remove("visible");
  });

  const viewTurnBox = document.querySelector(".view-turn-box");

  function updateViewTurnBox() {
    viewTurnBox.innerText = circleTurn ? "Noughts Turn" : "Crosses Turn";

    if (circleTurn) {
      viewTurnBox.classList.remove("crosses-turn");
    } else {
      viewTurnBox.classList.add("crosses-turn");
    }
  }

  //end of function declarations
  undoTurnButton.addEventListener("click", undoTurn);
  restartButton.addEventListener("click", startGame);
  restartMediaQuery.addEventListener("click", startGame);

  let undoTurnEnabled = false;

  function startGame() {
    numTurns = 0;
    circleTurn = false;
    updateViewTurnBox();
    undoTurnEnabled = false;
    updateButtonStyle();

    boardElements.forEach((board) => {
      board.classList.add("allow-click");
      board.classList.remove("disable-click");
      board.classList.remove(LARGE_X_CLASS);
      board.classList.remove(LARGE_CIRCLE_CLASS);
    });
    cellElements.forEach((cell) => {
      cell.classList.remove(X_CLASS);
      cell.classList.remove(CIRCLE_CLASS);
      cell.classList.add("cell");
      cell.removeEventListener("click", handleClick);
      cell.addEventListener("click", handleClick, { once: true });
    });
    setBoardHoverClass();
    winningMessageElement.classList.remove("show");
  }

  function undoTurn() {
    if (undoTurnEnabled) {
      if (numTurns === 1) {
        startGame();
      } else {
        continueGame();

        const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;

        boardElements.forEach((board) => {
          board.classList.remove("allow-click", "disable-click");
        });

        boardElements.forEach((board) => {
          if (board !== prevBoard) {
            board.classList.add("disable-click");
            prevBoard.classList.add("allow-click");
          }
        });

        if (prevClickedCell) {
          prevClickedCell.classList.remove(currentClass);
        }
        undoTurnEnabled = false;
        updateButtonStyle();
      }
    }
  }

  function updateButtonStyle() {
    if (undoTurnButton) {
      if (undoTurnEnabled) {
        undoTurnButton.classList.remove("grayed-out");
        undoTurnButton.disabled = false;
      } else {
        undoTurnButton.classList.add("grayed-out");
        undoTurnButton.disabled = true;
      }
    }
  }

  function handleClick(e) {
    numTurns++;
    undoTurnEnabled = true;
    updateButtonStyle();

    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    const currentLargeClass = circleTurn ? LARGE_CIRCLE_CLASS : LARGE_X_CLASS;
    placeMark(cell, currentClass);

    const cellIndex = cell.getAttribute("data-cell-index");
    const nextBoard = document.querySelector(
      `[data-board-index="${cellIndex}"]`
    );
    const clickedBoard = cell.closest(".board");
    prevBoard = cell.closest(".board");
    prevClickedCell = cell;

    function isMinigameDraw(clickedBoard) {
      const cellsInBoard = clickedBoard.querySelectorAll(".cell");
      for (const cell of cellsInBoard) {
        if (
          !cell.classList.contains(CIRCLE_CLASS) &&
          !cell.classList.contains(X_CLASS)
        ) {
          return false;
        }
      }
      return true;
    }

    function clearBoardClasses(clickedBoard) {
      const cellsInBoard = clickedBoard.querySelectorAll(".cell");
      cellsInBoard.forEach((cell) => {
        cell.classList.remove(CIRCLE_CLASS, X_CLASS);
      });
      circleTurn = !circleTurn;
      continueGame();
    }

    if (isMinigameDraw(clickedBoard)) {
      clearBoardClasses(clickedBoard);
    }

    boardElements.forEach((board) => {
      board.classList.remove("allow-click", "disable-click");
    });

    boardElements.forEach((board) => {
      if (board !== nextBoard) {
        board.classList.add("disable-click");
        nextBoard.classList.add("allow-click");
      }
    });

    if (
      nextBoard.classList.contains(LARGE_CIRCLE_CLASS) ||
      nextBoard.classList.contains(LARGE_X_CLASS)
    ) {
      boardElements.forEach((board) => {
        if (board !== nextBoard) {
          board.classList.remove("disable-click");
          board.classList.add("allow-click");
        }
      });
    }

    if (checkMinigameWin(currentClass)) {
      endMinigame();
      if (
        nextBoard.classList.contains(LARGE_CIRCLE_CLASS) ||
        nextBoard.classList.contains(LARGE_X_CLASS)
      ) {
        boardElements.forEach((board) => {
          if (board !== nextBoard) {
            board.classList.remove("disable-click");
            board.classList.add("allow-click");
          }
        });
      }
    } else {
      switchTurns();
      setBoardHoverClass();
      updateViewTurnBox();
    }
  }

  startGame();
});
