document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("container");
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");
  const closeButton = document.querySelector(".close-button");
  const menuToggleElement = document.querySelector(".menu-toggle");
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
  menuToggle.addEventListener("click", function () {
    menu.classList.toggle("open");
    menuToggleElement.classList.toggle("active");
  });

  closeButton.addEventListener("click", function () {
    menu.classList.remove("open");
    menuToggleElement.classList.remove("active");
  });
});
