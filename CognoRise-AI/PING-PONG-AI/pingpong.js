const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

// Create the paddles
const user = {
    x: 0,
    y: canvas.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
};

const ai = {
    x: canvas.width - 10,
    y: canvas.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
};

// Create the ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "BLUE"
};

// Draw a rectangle (paddle)
function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

// Draw a circle (ball)
function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

// Draw text (score)
function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = "45px fantasy";
    context.fillText(text, x, y);
}

// Render the game
function render() {
    // Clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    
    // Draw the net
    drawNet();
    
    // Draw the score
    drawText(user.score, canvas.width / 4, canvas.height / 5, "WHITE");
    drawText(ai.score, 3 * canvas.width / 4, canvas.height / 5, "WHITE");
    
    // Draw the paddles
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
    
    // Draw the ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// Control the user paddle
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evt) {
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height / 2;
}

// Collision detection
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

// Reset the ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

// Update the game
function update() {
    // Move the ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    // AI paddle movement
    let aiLevel = 0.1;
    ai.y += (ball.y - (ai.y + ai.height / 2)) * aiLevel;
    
    // Collision detection with top and bottom walls
    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }
    
    // Determine which paddle (user or ai) the ball is colliding with
    let player = (ball.x < canvas.width / 2) ? user : ai;
    
    if(collision(ball, player)) {
        // Where the ball hit the paddle
        let collidePoint = ball.y - (player.y + player.height / 2);
        // Normalize the value
        collidePoint = collidePoint / (player.height / 2);
        
        // Calculate the angle in Radian
        let angleRad = (Math.PI / 4) * collidePoint;
        
        // X direction of the ball when it's hit
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        // Change velocityX and speed
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        // Speed up the ball every time a paddle hits it
        ball.speed += 0.5;
    }
    
    // Update the score
    if(ball.x - ball.radius < 0) {
        ai.score++;
        resetBall();
    } else if(ball.x + ball.radius > canvas.width) {
        user.score++;
        resetBall();
    }
}

// Game loop
function game() {
    update();
    render();
}

// Number of frames per second
const framePerSecond = 50;

// Call the game function 50 times every 1 second
setInterval(game, 1000 / framePerSecond);

function drawNet() {
    for(let i = 0; i <= canvas.height; i += 15) {
        drawRect(canvas.width / 2 - 1, i, 2, 10, "WHITE");
    }
}
