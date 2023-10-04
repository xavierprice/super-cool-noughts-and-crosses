document.addEventListener("DOMContentLoaded", function () {
  const X_CLASS = "x";
  const CIRCLE_CLASS = "circle";
  const LARGE_X_CLASS = "large-x";
  const LARGE_CIRCLE_CLASS = "large-circle";
  const dataBoard = document.querySelectorAll("[data-board]");
  const cellElements = document.querySelectorAll("[data-cell]");
  const boardElements = document.querySelectorAll(".board");
  const winningMessageElement = document.getElementById("winningMessage");
  const welcomeMessageElement = document.getElementById("message-container");
  const restartButton = document.getElementById("restartButton");
  const restartGame = document.getElementById("restartGame");
  const restartMediaQuery = document.getElementById("restart-media-query");
  const playButton = document.getElementById("playButton");
  const winningMessageTextElement = document.querySelector(
    "[data-winning-message-text]"
  );
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");
  const closeButton = document.querySelectorAll(".close-button");
  const menuToggleElement = document.querySelector(".menu-toggle");
  const overlay = document.querySelector(".overlay");
  let circleTurn;
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

  const howToPlayButton = document.querySelectorAll(".how-to-play-button");
  const howToplaySection = document.getElementById("howToPlaySection");

  howToPlayButton.forEach(function (button) {
    button.addEventListener("click", toggleHowToPlay);
  });

  closeButton.forEach(function (button) {
    button.addEventListener("click", closeFunction);
  });

  function toggleHowToPlay() {
    howToplaySection.classList.add("show");
    welcomeMessageElement.classList.add("hide");
    menu.classList.remove("open");
    overlay.classList.add("visible");
    continueGameNoSwitch();
  }

  menuToggle.addEventListener("click", function () {
    menu.classList.toggle("open");
    menuToggleElement.classList.toggle("active");
    howToplaySection.classList.remove("show");
    overlay.classList.add("visible");
  });

  function closeFunction() {
    menu.classList.remove("open");
    menuToggleElement.classList.remove("active");
    howToplaySection.classList.remove("show");
    overlay.classList.remove("visible");
  }

  overlay.addEventListener("click", function () {
    menu.classList.remove("open");
    menuToggleElement.classList.remove("active");
    howToplaySection.classList.remove("show");
    overlay.classList.remove("visible");
  });

  const viewTurnBox = document.querySelector(".view-turn-box");

  function updateViewTurnBox() {
    viewTurnBox.innerText = circleTurn ? "Noughts Turn" : "Crosses Turn";
  }

  //end of function declarations

  restartButton.addEventListener("click", startGame);
  restartGame.addEventListener("click", startGame);
  restartMediaQuery.addEventListener("click", startGame);

  playButton.addEventListener("click", startGame);

  menuToggle.classList.add("active");
  howToplaySection.classList.remove("show");

  function startGame() {
    circleTurn = false;
    updateViewTurnBox();
    menu.classList.remove("open");
    menuToggleElement.classList.remove("active");
    howToplaySection.classList.remove("show");
    overlay.classList.remove("visible");
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
    welcomeMessageElement.classList.add("hide");
  }

  function handleClick(e) {
    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    const currentLargeClass = circleTurn ? LARGE_CIRCLE_CLASS : LARGE_X_CLASS;
    placeMark(cell, currentClass);

    const cellIndex = cell.getAttribute("data-cell-index");
    const nextBoard = document.querySelector(
      `[data-board-index="${cellIndex}"]`
    );
    const clickedBoard = cell.closest(".board");

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
});