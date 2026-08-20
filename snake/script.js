const height = 30;
const width = 30;
const speed = 150;
const length = 8;
let interval;
let direction = "left";
const snake = new Array(length).fill().map((x, i) => i);
snake.reverse();
let head = snake[0];

const board = document.querySelector(".board");
board.style.gridTemplateColumns = `repeat(${width}, 1fr)`;

function createBoard() {
    for (let i = 0; i < height * width; i++) {
        const div = document.createElement("div");
        board.appendChild(div);
    }
}

function showSnake() {
    [...board.children].forEach(div => div.classList.remove("active"));

    snake.forEach(n => {
        board.children[n].classList.add("active");
    });
}

function move(dir) {
    head = snake[0];

    if (dir === "left") {
        head++;
    } else if (dir === "right") {
        head--;
    } else if (dir === "up") {
        head -= width;
    } else if (dir === "down") {
        head += width;
    }

    direction = dir;

    snake.unshift(head);
    snake.pop();
    showSnake();

    autoMove();
}

function autoMove() {
    clearInterval(interval);
    interval = setInterval(() => move(direction), speed);
}

createBoard();
showSnake();



window.addEventListener("keydown", ev => {
    ev.preventDefault();

    switch(ev.key) {
        case 'ArrowLeft'    : move('left');             break;
        case 'ArrowRight'   : move('right');            break;
        case 'ArrowUp'      : move('up');               break;
        case 'ArrowDown'    : move('down');             break;
        case 'p' :
        case 'Escape'       : clearInterval(interval);  break;
    }
});