const height = 30;
const width = 30;
const speed = 150;
const length = 8;
let bait;
let interval;
let isGameOver = false;
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
    if (isGameOver) return;

    head = snake[0];

    if (dir === "left") {
        if (direction === "right") {
            return;
        }

        head++;

        if (head % width === 0) {
            return gameOver();
        }
    } else if (dir === "right") {
        if (direction === "left") {
            return;
        }

        head--;

        if ((head + 1) % width === 0) {
            return gameOver();
        }
    } else if (dir === "up") {
        if (direction === "down") {
            return;
        }

        head -= width;

        if (head < 0) {
            return gameOver();
        }
    } else if (dir === "down") {
        if (direction === "up") {
            return;
        }

        head += width;

        if (head >= width * height) {
            return gameOver();
        }
    }

    if (snake.includes(head)) {
        return gameOver();
    }

    direction = dir;

    snake.unshift(head);

    if (head === bait) {
        setBait();
    } else {
        snake.pop();
    }

    showSnake();
    autoMove();
}

function autoMove() {
    clearInterval(interval);
    interval = setInterval(() => move(direction), speed);
}

function gameOver() {
    isGameOver = true;
    clearInterval(interval);
    alert("נפסלת");
}

function setBait() {
    board.children[bait]?.classList.remove("bait");
    bait = Math.floor(Math.random() * width * height);

    if (snake.includes(bait)) {
        setBait();
    } else {
        board.children[bait].classList.add("bait");
    }
}

createBoard();
showSnake();
setBait();

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