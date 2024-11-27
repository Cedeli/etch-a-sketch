const canvas = document.querySelector(".canvas");
const slider = document.querySelector(".grid-slider");
const sizeLabel = document.querySelector(".grid-size-label");
const buttons = document.querySelectorAll(".sketch-button");

let mouseDown = false;
let drawingMode = "draw";
let lastCell = null;

window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => {
    mouseDown = false;
    lastCell = null;
});

createGrid(canvas, parseInt(slider.value));

buttons.forEach((button) => {
    if (button.textContent.toLowerCase() === drawingMode) {
        button.classList.add("active");
    }
    button.addEventListener("click", () => {
        const buttonMode = button.textContent.toLowerCase();
        if (buttonMode === "clear") {
            clearGrid();
            return;
        }

        buttons.forEach((btn) => {
            if (btn.textContent.toLowerCase() !== "clear") {
                btn.classList.remove("active");
            }
        });

        button.classList.add("active");
        drawingMode = buttonMode;
    });
});

slider.addEventListener("input", () => {
    const gridSize = parseInt(slider.value);
    sizeLabel.textContent = `${gridSize} x ${gridSize}`;
});

slider.addEventListener("change", () => {
    const gridSize = parseInt(slider.value);
    recreateGrid(gridSize);
});

function createGrid(canvas, cellAmount) {
    canvas.innerHTML = "";
    const cellSize = canvas.clientHeight / cellAmount;

    for (let i = 0; i < cellAmount * cellAmount; i++) {
        const cell = document.createElement("div");
        cell.style.height = `${cellSize}px`;
        cell.style.width = `${cellSize}px`;
        cell.style.cursor = "crosshair";

        if (i === 0) cell.style.borderTopLeftRadius = "16px";
        else if (i === cellAmount - 1) cell.style.borderTopRightRadius = "16px";
        else if (i === cellAmount * cellAmount - cellAmount)
            cell.style.borderBottomLeftRadius = "16px";
        else if (i === cellAmount * cellAmount - 1)
            cell.style.borderBottomRightRadius = "16px";

        createCellEvents(cell);
        canvas.appendChild(cell);
    }
}

function createCellEvents(element) {
    element.classList.add("cell");

    element.addEventListener("mouseover", (e) => colorCell(e, element));
    element.addEventListener("mousedown", (e) => colorCell(e, element));
}

function colorCell(e, element) {
    if (e.type === "mouseover" && !mouseDown) return;
    fillCell(element);

    if (lastCell && lastCell !== element) {
        const canvasRect = canvas.getBoundingClientRect();
        const cells = Array.from(canvas.children);
        const gridSize = Math.sqrt(cells.length);

        const startCoords = getCellCoordinates(lastCell, canvasRect, gridSize);
        const endCoords = getCellCoordinates(element, canvasRect, gridSize);

        if (startCoords && endCoords) {
            fillCellsBetween(startCoords, endCoords, gridSize);
        }
    }

    lastCell = element;
}

function fillCell(element) {
    switch (drawingMode) {
        case "rainbow":
            element.style.backgroundColor = rainbow();
            break;
        case "darken":
            darkenCell(element);
            break;
        default:
            element.style.backgroundColor = "#8D918B";
            break;
    }
}

function getCellCoordinates(cell, canvasRect, gridSize) {
    const index = Array.from(canvas.children).indexOf(cell);
    if (index === -1) return null;

    const x = index % gridSize;
    const y = Math.floor(index / gridSize);

    return { x, y, index };
}

function fillCellsBetween(start, end, gridSize) {
    const dx = Math.abs(end.x - start.x);
    const dy = Math.abs(end.y - start.y);
    const sx = start.x < end.x ? 1 : -1;
    const sy = start.y < end.y ? 1 : -1;

    let err = dx - dy;

    let x = start.x;
    let y = start.y;

    while (true) {
        const index = y * gridSize + x;
        const cell = canvas.children[index];
        if (cell) fillCell(cell);

        if (x === end.x && y === end.y) break;

        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x += sx;
        }
        if (e2 < dx) {
            err += dx;
            y += sy;
        }
    }
}

function rainbow() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue},70%, 50%)`;
}

function darkenCell(element) {
    let currentLevel = parseFloat(element.dataset.darkenLevel) || 0;
    currentLevel = Math.min(currentLevel + 0.1, 1);
    element.dataset.darkenLevel = currentLevel;

    const baseColor = getComputedStyle(element).backgroundColor || "rgb(255, 255, 255)";
    const [r, g, b] = extractRGB(baseColor);

    const isTransparent = baseColor === "rgba(0, 0, 0, 0)" || baseColor === "transparent";
    const [defaultR, defaultG, defaultB] = isTransparent ? [255, 255, 255] : [r, g, b];

    const newR = Math.round(defaultR * (1 - currentLevel));
    const newG = Math.round(defaultG * (1 - currentLevel));
    const newB = Math.round(defaultB * (1 - currentLevel));

    element.style.backgroundColor = `rgb(${newR}, ${newG}, ${newB})`;
}

function extractRGB(color) {
    const match = color.match(/(\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
        return match.slice(1, 4).map(Number);
    }
    return [255, 255, 255];
}

function clearGrid() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => (cell.style.backgroundColor = "transparent"));
}

function recreateGrid(cellAmount) {
    createGrid(canvas, cellAmount);
}