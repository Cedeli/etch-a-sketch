const canvas = document.querySelector(".canvas");

let mouseDown = false
document.body.onmousedown = () => (mouseDown = true)
document.body.onmouseup = () => (mouseDown = false)

function createGrid(canvas, cellAmount) {
    const cellSize = canvas.clientHeight / cellAmount;

    for (i = 0; i < cellAmount * cellAmount; i++) {
        const cell = document.createElement("div");
        cell.style.height = `${cellSize}px`;
        cell.style.width = `${cellSize}px`;
        cell.style.border = "solid";
        cell.style.borderWidth = "1px";
        cell.style.borderColor = "#8D918B";

        createHoverEvent(cell);
        canvas.appendChild(cell);
    }
}

function createHoverEvent(element) {
    element.addEventListener("mouseover", () => {
        if (!mouseDown || element.classList.contains("drawn")) return;
        element.classList.toggle("drawn");
        console.log("Drawing");
    });
}

createGrid(canvas, 32);