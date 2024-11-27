const canvas = document.querySelector(".canvas");
const slider = document.querySelector(".grid-slider");
const sizeLabel = document.querySelector(".grid-size-label");
const buttons = document.querySelectorAll(".sketch-button");

let mouseDown = false;
let drawingMode = "draw";

window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));

createGrid(canvas, parseInt(slider.value));

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        drawingMode = button.textContent.toLowerCase();

        if (drawingMode === "clear") {
            clearGrid();
            drawingMode = "draw";
        }
    });
});

slider.addEventListener("input", () => {
    const gridSize = parseInt(slider.value);
    sizeLabel.textContent = `${gridSize} x ${gridSize}`;
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

    element.addEventListener("mouseover", colorCell);
    element.addEventListener("mousedown", colorCell);
}

function colorCell(e) {
    if (e.type === "mouseover" && !mouseDown) return;

    switch (drawingMode) {
        case "rainbow":
            e.target.style.backgroundColor = rainbow();
            break;
        case "darken":
            darkenCell(e.target);
            break;
        default:
            e.target.style.backgroundColor = "#8D918B";
            break;
    }
}

function rainbow() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 100%, 50%)`;
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
