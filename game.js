// Game constants
const GRID_SIZE = 20;
const GAME_SPEED = 100;

// Get canvas context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const CELL_SIZE = canvas.width / GRID_SIZE;

// Game state
let snake = [
    { x: Math.floor(GRID_SIZE/2), y: Math.floor(GRID_SIZE/2) }
];
let food = generateFood();
let direction = 'right';
let score = 0;
let gameLoop = null;
let gameStarted = false;

// Controls
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const scoreElement = document.getElementById('score');

// Event listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
document.addEventListener('keydown', handleKeyPress);

// Generate random food position
function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}

// Handle keyboard controls
function handleKeyPress(event) {
    if (!gameStarted) return;

    const keyMap = {
        'ArrowUp': 'up',
        'ArrowDown': 'down',
        'ArrowLeft': 'left',
        'ArrowRight': 'right',
        'KeyW': 'up',
        'KeyS': 'down',
        'KeyA': 'left',
        'KeyD': 'right'
    };

    const newDirection = keyMap[event.code];
    if (!newDirection) return;

    const opposites = {
        'up': 'down',
        'down': 'up',
        'left': 'right',
        'right': 'left'
    };

    if (opposites[direction] !== newDirection) {
        direction = newDirection;
    }
}

// Game loop
function gameStep() {
    const head = { ...snake[0] };

    switch (direction) {
        case 'up':
            head.y = (head.y - 1 + GRID_SIZE) % GRID_SIZE;
            break;
        case 'down':
            head.y = (head.y + 1) % GRID_SIZE;
            break;
        case 'left':
            head.x = (head.x - 1 + GRID_SIZE) % GRID_SIZE;
            break;
        case 'right':
            head.x = (head.x + 1) % GRID_SIZE;
            break;
    }

    // Check collision with self only
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        food = generateFood();
    } else {
        snake.pop();
    }

    draw();
}

// Draw game state
function draw() {
    // Clear canvas
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = '#4CAF50';
    snake.forEach(segment => {
        ctx.fillRect(
            segment.x * CELL_SIZE,
            segment.y * CELL_SIZE,
            CELL_SIZE - 1,
            CELL_SIZE - 1
        );
    });

    // Draw food
    ctx.fillStyle = '#f44336';
    ctx.fillRect(
        food.x * CELL_SIZE,
        food.y * CELL_SIZE,
        CELL_SIZE - 1,
        CELL_SIZE - 1
    );
}

// Game control functions
function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    startBtn.style.display = 'none';
    restartBtn.style.display = 'inline-block';
    gameLoop = setInterval(gameStep, GAME_SPEED);
}

function gameOver() {
    clearInterval(gameLoop);
    gameStarted = false;
    alert(`Game Over! Score: ${score}`);
}

function restartGame() {
    clearInterval(gameLoop);
    snake = [{ x: Math.floor(GRID_SIZE/2), y: Math.floor(GRID_SIZE/2) }];
    direction = 'right';
    score = 0;
    scoreElement.textContent = score;
    food = generateFood();
    startGame();
}

// Initial draw
draw();