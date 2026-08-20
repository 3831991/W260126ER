const GRID_SIZE = 30;
const INITIAL_LENGTH = 6;
const START_SPEED = 135;
const MIN_SPEED = 62;

const board = document.querySelector(".board");
const scoreElement = document.querySelector("#score");
const highScoreElement = document.querySelector("#high-score");
const overlay = document.querySelector("#game-overlay");
const overlayKicker = document.querySelector("#overlay-kicker");
const overlayTitle = document.querySelector("#overlay-title");
const overlayCopy = document.querySelector("#overlay-copy");
const startButton = document.querySelector("#start-button");
const buttonLabel = document.querySelector("#button-label");
const statusText = document.querySelector("#status-text");

let snake = [];
let food = 0;
let direction = "right";
let queuedDirection = "right";
let timer = null;
let score = 0;
let speed = START_SPEED;
let gameState = "ready";

let highScore = Number(localStorage.getItem("neonSnakeHighScore")) || 0;
highScoreElement.textContent = formatScore(highScore);

function createBoard() {
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < GRID_SIZE * GRID_SIZE; index++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        fragment.appendChild(cell);
    }
    board.appendChild(fragment);
}

function resetGame() {
    const center = Math.floor(GRID_SIZE / 2) * GRID_SIZE + Math.floor(GRID_SIZE / 2);
    snake = Array.from({ length: INITIAL_LENGTH }, (_, index) => center - index);
    direction = "right";
    queuedDirection = "right";
    score = 0;
    speed = START_SPEED;
    scoreElement.textContent = formatScore(score);
    placeFood();
    render();
}

function render() {
    for (const cell of board.children) {
        cell.className = "cell";
        cell.style.removeProperty("--segment-scale");
    }

    snake.forEach((position, index) => {
        const segment = board.children[position];
        segment.classList.add("snake", index === 0 ? "snake-head" : "snake-body");
        segment.style.setProperty("--segment-scale", Math.max(.86, 1 - index * .007));
        if (index === 0) segment.classList.add(`moving-${direction}`);
        if (index === snake.length - 1) segment.classList.add("snake-tail");
    });

    board.children[food]?.classList.add("bait");
}

function placeFood() {
    do {
        food = Math.floor(Math.random() * GRID_SIZE * GRID_SIZE);
    } while (snake.includes(food));
}

function startGame() {
    if (gameState === "gameover") resetGame();
    gameState = "playing";
    overlay.classList.remove("is-visible");
    statusText.textContent = "המשחק פעיל";
    scheduleMove();
}

function togglePause() {
    if (gameState === "ready" || gameState === "gameover") return;
    if (gameState === "paused") {
        startGame();
        return;
    }

    gameState = "paused";
    clearTimeout(timer);
    overlayKicker.textContent = "המשחק בהשהיה";
    overlayTitle.textContent = "לוקחים נשימה";
    overlayCopy.textContent = "הניקוד נשמר. לחצו כדי לחזור בדיוק לאותה נקודה.";
    buttonLabel.textContent = "המשך משחק";
    statusText.textContent = "המשחק מושהה";
    overlay.classList.add("is-visible");
}

function scheduleMove() {
    clearTimeout(timer);
    timer = setTimeout(tick, speed);
}

function tick() {
    if (gameState !== "playing") return;
    direction = queuedDirection;

    const head = snake[0];
    const row = Math.floor(head / GRID_SIZE);
    const column = head % GRID_SIZE;
    let nextHead = head;

    if (direction === "left") nextHead -= 1;
    if (direction === "right") nextHead += 1;
    if (direction === "up") nextHead -= GRID_SIZE;
    if (direction === "down") nextHead += GRID_SIZE;

    const hitWall =
        (direction === "left" && column === 0) ||
        (direction === "right" && column === GRID_SIZE - 1) ||
        (direction === "up" && row === 0) ||
        (direction === "down" && row === GRID_SIZE - 1);

    const grows = nextHead === food;
    const bodyToCheck = grows ? snake : snake.slice(0, -1);

    if (hitWall || bodyToCheck.includes(nextHead)) {
        endGame();
        return;
    }

    snake.unshift(nextHead);
    if (grows) {
        score += 10;
        speed = Math.max(MIN_SPEED, START_SPEED - Math.floor(score / 40) * 7);
        scoreElement.textContent = formatScore(score);
        placeFood();
        board.classList.remove("flash");
        void board.offsetWidth;
        board.classList.add("flash");
    } else {
        snake.pop();
    }

    render();
    scheduleMove();
}

function endGame() {
    gameState = "gameover";
    clearTimeout(timer);

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("neonSnakeHighScore", highScore);
        highScoreElement.textContent = formatScore(highScore);
        overlayKicker.textContent = "שיא חדש!";
    } else {
        overlayKicker.textContent = "הסיבוב הסתיים";
    }

    overlayTitle.textContent = `${score} נקודות`;
    overlayCopy.textContent = "כמעט! עוד סיבוב אחד ואתם שוב על המסלול.";
    buttonLabel.textContent = "משחק חדש";
    statusText.textContent = "המשחק הסתיים";
    overlay.classList.add("is-visible");
}

function setDirection(nextDirection) {
    const opposites = { left: "right", right: "left", up: "down", down: "up" };
    if (opposites[nextDirection] === direction) return;
    queuedDirection = nextDirection;
    if (gameState === "ready") startGame();
}

function formatScore(value) {
    return String(value).padStart(3, "0");
}

createBoard();
resetGame();
startButton.addEventListener("click", startGame);

window.addEventListener("keydown", event => {
    const keyMap = {
        ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down",
        a: "left", d: "right", w: "up", s: "down"
    };

    if (keyMap[event.key]) {
        event.preventDefault();
        setDirection(keyMap[event.key]);
    }

    if (event.key === "Escape" || event.key.toLowerCase() === "p") {
        event.preventDefault();
        togglePause();
    }
});

document.querySelectorAll("[data-direction]").forEach(button => {
    button.addEventListener("pointerdown", event => {
        event.preventDefault();
        setDirection(button.dataset.direction);
    });
});
