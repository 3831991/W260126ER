const height = 30;
const width = 30;
const board = document.querySelector(".board");
board.style.gridTemplateColumns = `repeat(${width}, 1fr)`;

function createBoard() {
    for (let i = 0; i < height * width; i++) {
        const div = document.createElement("div");
        board.appendChild(div);
    }
}

createBoard();