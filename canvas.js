const canvas = document.querySelector(".canvas");

let mouseDown = false;
window.addEventListener('mousedown', () => mouseDown = true);
window.addEventListener('mouseup', () => mouseDown = false);

let drawingMode = "rainbow";

function createGrid(canvas, cellAmount) {
    const cellSize = canvas.clientHeight / cellAmount;

    for (i = 0; i < cellAmount * cellAmount; i++) {
        const cell = document.createElement("div");
        cell.style.height = `${cellSize}px`;
        cell.style.width = `${cellSize}px`;
        cell.style.cursor = "crosshair";

        if (i === 0){
            cell.style.borderTopLeftRadius = "16px";
        } else if(i === cellAmount - 1){
            cell.style.borderTopRightRadius = "16px";
        } else if(i === cellAmount * cellAmount - cellAmount){
            cell.style.borderBottomLeftRadius = "16px";
        } else if(i === cellAmount * cellAmount - 1){
            cell.style.borderBottomRightRadius = "16px";
        }

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
    switch (drawingMode) {
        case "rainbow":
            e.target.style.backgroundColor = rainbow();
            break;
        case "darken":

            break;
        default:
            e.target.classList.toggle("drawn");
            break;
    }
}

function rainbow() {
    let hue = Math.floor(Math.random() * 30) * 12;
    let color = "rgb(" + hsl2rgb(hue, 0.1, 0.1).join(",") + ")";
    return color;
}

function hsl2rgb(h, s, l)
{
    h = h / 360;
    s = s / 100;
    l = l / 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * 1 - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);

    return [r, g, b];
}

createGrid(canvas, 16);