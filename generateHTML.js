document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("container");

  for (let i = 1; i <= 9; i++) {
    container.innerHTML += `
      <div class="board large-cell" data-board data-board-index="${
        i - 1
      }" id="board-${i}">
        ${Array.from(
          { length: 9 },
          (_, j) => `<div class="cell" data-cell data-cell-index="${j}"></div>`
        ).join("\n")}
      </div>
    `;
  }
});
