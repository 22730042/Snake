class Game {
    pauseGame = false;
    startGame = false;
    mode = 1;
    constructor(canvas, dx, dy, board_border, board_background, snake_border) {
        this.snakeboard = canvas;
        this.snakeboard_ctx = this.snakeboard.getContext("2d");
        this.dx = dx;
        this.dy = dy;
        this.isChange = false;
        this.snake = [];
        this.bounds = [];
        this.board_border = board_border;
        this.board_background = board_background;
        this.snake_border = snake_border;
        this.lengthSnake = 0;
        this.randomColor = "#3498db"
        this.point = 0;
        this.count = 60;
        document.addEventListener("keydown", this.changeDirection.bind(this));
    }

    setUpSnake(length, x, y) {
        let data_x = x;
        this.lengthSnake = length;
        for (let i = 0; i < length; i++) {
            this.snake.push({
                x: data_x,
                y: y
            });
            data_x -= 20;
        }
        return this;
    }

    init(delay) {
        setTimeout(() => {
            this.drawCanvas();
            if (this.startGame) {
                if (!this.checkGame()) {
                    this.isChange = false;
                    this.calculatorPoint();
                    if (!this.pauseGame) {
                        this.moveSnake();
                        if (Date.now() >= this.time_next || !this.time_next) {
                            this.randomBound();
                            this.time_next = Date.now() + 3000;
                        }
                    }
                }
                else {
                    const btn = document.getElementById('btnGame');
                    btn.textContent = 'Play Again';
                    btn.classList.remove('pause');
                    btn.setAttribute('data-id', 'play_again');
                }
                this.drawSnake();
                this.drawBound();
            }
            requestAnimationFrame(this.init.bind(this));
        }, 60);

        // window.requestAnimationFrame(this.init.bind(this))
    }

    reset(length, x, y, dx, dy) {
        this.snake = [];
        this.bounds = [];
        this.dx = dx;
        this.dy = dy;
        this.point = 0
        this.pauseGame = false;
        this.startGame = false;
        this.setUpSnake(length, x, y);
    }

    drawCanvas() {
        //  Select the colour to fill the drawing
        this.snakeboard_ctx.scale(1, 1);
        this.snakeboard_ctx.fillStyle = this.board_background;
        //  Select the colour for the border of the canvas
        this.snakeboard_ctx.strokeStyle = this.board_border;
        // Draw a "filled" rectangle to cover the entire canvas
        this.snakeboard_ctx.fillRect(0, 0, this.snakeboard.width, this.snakeboard.height);
        for (var x = 0.5; x < this.snakeboard.width; x += 20) {
            this.snakeboard_ctx.moveTo(x, 0);
            this.snakeboard_ctx.lineTo(x, this.snakeboard.height);
        }
        for (var y = 0.5; y < this.snakeboard.height; y += 20) {
            this.snakeboard_ctx.moveTo(0, y);
            this.snakeboard_ctx.lineTo(this.snakeboard.width, y);
        }
        // Draw a "border" around the entire canvas
        this.snakeboard_ctx.stroke();
        this.snakeboard_ctx.strokeRect(0, 0, this.snakeboard.width, this.snakeboard.height);
    }

    drawBound() {
        if (this.bounds.length)
            this.bounds.forEach((v) => {
                this.drawBoundPart(v, v?.color);
            })
    }

    drawBoundPart(bound, color) {
        // Set the colour of the snake part
        this.snakeboard_ctx.fillStyle = color;
        // Set the border colour of the snake part
        this.snakeboard_ctx.strokeStyle = '#fff';
        // Draw a "filled" rectangle to represent the snake part at the coordinates
        // the part is located
        this.snakeboard_ctx.beginPath();
        this.snakeboard_ctx.arc(bound.x, bound.y, 7, 0, 2 * Math.PI, false);
        // fill color
        this.snakeboard_ctx.fill();
        // Draw a border around the snake part
        this.snakeboard_ctx.stroke();
        this.snakeboard_ctx.closePath();
    }

    randomBound() {
        if (this.bounds.length == 5)
            return;
        const data = this.generateBound();
        let xRand = data?.x;
        let yRand = data?.y;

        this.bounds.push({
            x: xRand,
            y: yRand,
            point: 10,
            color: 'green'
        });
    }

    generateBound() {
        let flag = false;
        let xRand = 0;
        let yRand = 0;
        while (!flag) {
            xRand = Math.floor(Math.random() * (this.snakeboard.width + 1));
            yRand = Math.floor(Math.random() * (this.snakeboard.height + 1));
            const x = parseInt(xRand / 20) * 20 - 10;
            const y = parseInt(yRand / 20) * 20 - 10;
            xRand = (xRand + 10) >= this.snakeboard.width ? this.snakeboard.width - 10 : (x <= 0 ? 10 : x);
            yRand = (yRand + 10) >= this.snakeboard.height ? this.snakeboard.height - 10 : (y <= 0 ? 10 : y);
            let existData = false;
            for (let i = 0; i < this.snake.length; i++) {
                if (xRand == (this.snake[i].x + 10) &&
                    yRand - 10 == (this.snake[i].y)) {
                    existData = true;
                    break;
                }
            }

            for (let i = 0; i < this.bounds.length; i++) {
                if (xRand == this.bounds[i].x &&
                    yRand == this.bounds[i].y) {
                    existData = true;
                    break;
                }
            }
            flag = !existData;
        }
        return {
            x: xRand,
            y: yRand
        }
    }

    drawSnake() {
        if (this.snake.length != this.lengthSnake) {
            this.randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            this.lengthSnake = this.snake.length;
        }

        // Draw each part
        this.snake.forEach((v, i) => {
            // random color
            this.drawSnakePart(v, i == 0 ? 'red' : this.randomColor);
        })
    }

    drawSnakePart(snakePart, color) {
        // Set the colour of the snake part
        this.snakeboard_ctx.fillStyle = color;
        // Set the border colour of the snake part
        this.snakeboard_ctx.strokestyle = this.snake_border;
        // the part is located
        this.snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 20, 20);
        // Draw a border around the snake part
        this.snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 20, 20);
    }

    moveSnake() {
        // Create the new Snake's head
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
        // Add the new head to the beginning of snake body
        this.snake.unshift(head);
        this.snake.pop();
    }

    checkGame() {
        const snakeX = this.snake[0].x;
        const snakeY = this.snake[0].y;
        for (let i = 0; i < this.snake.length; i++) {
            if (i != 0 && snakeX == this.snake[i]?.x && snakeY == this.snake[i]?.y)
                return true;
            if (this.mode == 1) {
                const hitLeftWall = this.snake[i].x < 0;
                const hitRightWall = this.snake[i].x > this.snakeboard.width - 20;
                const hitToptWall = this.snake[i].y < 0;
                const hitBottomWall = this.snake[i].y > this.snakeboard.height - 20;
                this.backMove(this.snake[i], hitLeftWall, hitRightWall, hitToptWall, hitBottomWall);
            }
        }
        if (this.mode == 2) {
            const hitLeftWall = this.snake[0].x < 0;
            const hitRightWall = this.snake[0].x >= this.snakeboard.width;
            const hitToptWall = this.snake[0].y < 0;
            const hitBottomWall = this.snake[0].y >= this.snakeboard.height;
            return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
        }
        else
            return false;
    }

    changeDirection(event) {
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;
        // Prevent the snake from reversing
        if (this.isChange) return;
        this.isChange = true;

        const keyPressed = event.keyCode;
        const goingUp = this.dy === -20;
        const goingDown = this.dy === 20;
        const goingRight = this.dx === 20;
        const goingLeft = this.dx === -20;
        if (keyPressed === LEFT_KEY && !goingRight) {
            this.dx = -20;
            this.dy = 0;
        }

        if (keyPressed === UP_KEY && !goingDown) {
            this.dx = 0;
            this.dy = -20;
        }

        if (keyPressed === RIGHT_KEY && !goingLeft) {
            this.dx = 20;
            this.dy = 0;
        }

        if (keyPressed === DOWN_KEY && !goingUp) {
            this.dx = 0;
            this.dy = 20;
        }
    }

    backMove(snake, left, right, top, bottom) {
        if (left)
            snake.x = this.snakeboard.width;
        if (right)
            snake.x = 0;
        if (top)
            snake.y = this.snakeboard.height;
        if (bottom)
            snake.y = 0;
    }

    calculatorPoint() {
        const xSnake = this.snake[0].x;
        const ySnake = this.snake[0].y;
        let index = null;
        for (let i = 0; i < this.bounds.length; i++) {
            if (this.bounds[i]?.x == xSnake + 10 && this.bounds[i]?.y - 10 == ySnake) {
                index = i;
                this.point += this.bounds[i]?.point;
                break;
            }
        }
        if (index != null) {
            this.bounds = this.bounds.filter((v, i) => i != index);
            if (!this.bounds.length)
                this.randomBound();
            const key = this.snake.length - 1;
            this.snake.push({
                x: this.snake[key]?.x - 10,
                y: this.snake[key]?.y - 10,
            })
        }

        document.getElementById('point').textContent = this.point;
    }
}
