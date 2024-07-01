const canvas = document.querySelector(".canvas");

let mouseDown = false
window.addEventListener('mousedown', () => mouseDown = true);
window.addEventListener('mouseup', () => mouseDown = false);

function createGrid(canvas, cellAmount) {
    const cellSize = canvas.clientHeight / cellAmount;

    for (i = 0; i < cellAmount * cellAmount; i++) {
        const cell = document.createElement("div");
        cell.style.height = `${cellSize}px`;
        cell.style.width = `${cellSize}px`;

        createCellEvents(cell);
        canvas.appendChild(cell);
    }
}

function createCellEvents(element) {
    element.classList.toggle("cell");

    element.addEventListener("mouseover", colorCell);
    element.addEventListener("mousedown", colorCell);
}

function colorCell(e) {
    if (e.type === "mouseover" && !mouseDown) return;
    e.target.classList.toggle("drawn");
}

createGrid(canvas, 32);