const height = 30;
const width = 30;
const length = 8;
const snake = new Array(length).fill().map((x, i) => i);
snake.reverse();
const head = snake[0];
const board = document.querySelector(".board");
board.style.gridTemplateColumns = `repeat(${width}, 1fr)`;

function createBoard() {
    for (let i = 0; i < height * width; i++) {
        const div = document.createElement("div");
        board.appendChild(div);
    }
}

function showSnake() {
    snake.forEach(n => {
        board.children[n].classList.add("active");
        
    });
}

createBoard();
showSnake();