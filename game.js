// Инициализация игры
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const jumpBtn = document.getElementById('jumpBtn');
const scoreElement = document.getElementById('score');

// Размеры холста
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Игровые переменные
let score = 0;
let gameSpeed = 5;
let isGameOver = false;
let animationId;
let lastObstacleTime = 0;

// Игровые объекты
const dog = {
    x: 100,
    y: canvas.height / 2,
    width: 60,
    height: 40,
    dy: 0,
    gravity: 0.5,
    jump: function() {
        this.dy = -12;
    },
    update: function() {
        this.dy += this.gravity;
        this.y += this.dy;
        
        // Границы экрана
        if (this.y < 0) this.y = 0;
        if (this.y > canvas.height - this.height) {
            this.y = canvas.height - this.height;
            this.dy = 0;
        }
    },
    draw: function() {
        ctx.fillStyle = '#FF5733';
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 10);
        ctx.fill();
    }
};

const obstacles = [];

// Создание препятствий
function createObstacle() {
    const gap = 150;
    const height = Math.random() * (canvas.height - gap - 100) + 50;
    
    obstacles.push({
        x: canvas.width,
        y: 0,
        width: 40,
        height: height
    });
    
    obstacles.push({
        x: canvas.width,
        y: height + gap,
        width: 40,
        height: canvas.height - height - gap
    });
}

// Основной игровой цикл
function gameLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!isGameOver) {
        // Генерация препятствий
        if (timestamp - lastObstacleTime > 2000) {
            createObstacle();
            lastObstacleTime = timestamp;
        }
        
        // Обновление и отрисовка собаки
        dog.update();
        dog.draw();
        
        // Обработка препятствий
        obstacles.forEach((obstacle, index) => {
            obstacle.x -= gameSpeed;
            
            // Отрисовка препятствий
            ctx.fillStyle = '#2ECC71';
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            
            // Проверка столкновений
            if (
                dog.x < obstacle.x + obstacle.width &&
                dog.x + dog.width > obstacle.x &&
                dog.y < obstacle.y + obstacle.height &&
                dog.y + dog.height > obstacle.y
            ) {
                endGame();
            }
            
            // Удаление вышедших за экран
            if (obstacle.x + obstacle.width < 0) {
                obstacles.splice(index, 1);
                score++;
                scoreElement.textContent = `Score: ${score}`;
                
                // Увеличение сложности
                if (score % 5 === 0) gameSpeed += 0.5;
            }
        });
        
        animationId = requestAnimationFrame(gameLoop);
    }
}

// Конец игры
function endGame() {
    isGameOver = true;
    cancelAnimationFrame(animationId);
    alert(`Game Over! Your score: ${score}\n\nTap OK to restart`);
    resetGame();
}

// Сброс игры
function resetGame() {
    score = 0;
    gameSpeed = 5;
    isGameOver = false;
    obstacles.length = 0;
    dog.y = canvas.height / 2;
    dog.dy = 0;
    scoreElement.textContent = `Score: ${score}`;
    animationId = requestAnimationFrame(gameLoop);
}

// Управление
jumpBtn.addEventListener('click', () => dog.jump());
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') dog.jump();
});

// Адаптация к размеру экрана
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Старт игры
resetGame();