class Game {

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
    }

    setUpSnake(length, x, y) {
        let data_x = x;
        for (let i = 0; i < length; i++) {
            this.snake.push({
                x: data_x,
                y: y
            });
            data_x -= 10;
        }
        document.addEventListener("keydown", this.changeDirection.bind(this));
        return this;
    }

    init(delay) {
        setTimeout(() => {
            if (this.checkGame())
                return false;
            this.isChange = false;
            this.drawCanvas();
            this.moveSnake();
            this.drawSnake();
            this.calculatorPoint();
            if (Date.now() >= this.time_next || !this.time_next) {
                this.randomBound();
                this.time_next = Date.now() + 3000;
            }
            this.drawBound();
            this.init(delay);
        }, delay);
        // window.requestAnimationFrame(this.init.bind(this))
    }

    drawCanvas() {
        //  Select the colour to fill the drawing
        this.snakeboard_ctx.fillStyle = this.board_background;
        //  Select the colour for the border of the canvas
        this.snakeboard_ctx.strokestyle = this.board_border;
        // Draw a "filled" rectangle to cover the entire canvas
        this.snakeboard_ctx.fillRect(0, 0, this.snakeboard.width, this.snakeboard.height);
        // Draw a "border" around the entire canvas
        this.snakeboard_ctx.strokeRect(0, 0, this.snakeboard.width, this.snakeboard.height);
    }

    drawBound() {
        this.bounds.forEach((v) => {
            this.drawBoundPart(v, 'black');
        })
    }

    drawBoundPart(bound, color) {
        // Set the colour of the snake part
        this.snakeboard_ctx.fillStyle = color;
        // Set the border colour of the snake part
        this.snakeboard_ctx.strokestyle = this.snake_border;
        // Draw a "filled" rectangle to represent the snake part at the coordinates
        // the part is located
        this.snakeboard_ctx.beginPath();
        this.snakeboard_ctx.arc(bound.x, bound.y, 5, 0, 2 * Math.PI, false);
        // fill color
        this.snakeboard_ctx.fill();
        // Draw a border around the snake part
        this.snakeboard_ctx.stroke();
        this.snakeboard_ctx.closePath();
    }

    randomBound() {
        if (this.bounds.length == 5)
            return;
        let flag = false;
        let xRand = 0;
        let yRand = 0;
        while (!flag) {
            xRand = Math.floor(Math.random() * (this.snakeboard.width + 1));
            yRand = Math.floor(Math.random() * (this.snakeboard.height + 1));
            xRand = xRand == this.snakeboard.width ? xRand - 5 : (xRand == 0 ? xRand + 5 : xRand);
            yRand = yRand == this.snakeboard.height ? yRand - 5 : (yRand == 0 ? yRand + 3 : yRand);
            let existData = false;
            for (let i = 0; i < this.snake.length; i++) {
                if (xRand == (this.snake[i].x + 10) ||
                    xRand == (this.snake[i].x - 10) ||
                    yRand == (this.snake[i].y + 10) ||
                    yRand == (this.snake[i].y - 10)) {
                    existData = true;
                    break;
                }
            }

            for (let i = 0; i < this.bounds.length; i++) {
                if (xRand == (this.bounds[i].x + 10) ||
                    xRand == (this.bounds[i].x - 10) ||
                    yRand == (this.bounds[i].y + 10) ||
                    yRand == (this.bounds[i].y - 10)) {
                    existData = true;
                    break;
                }
            }
            flag = !existData;
        }

        this.bounds.push({
            x: xRand,
            y: yRand,
            point: 10,
        });
    }

    drawSnake() {
        // Draw each part
        this.snake.forEach((v) => {
            // random color
            const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            this.drawSnakePart(v, randomColor);
        })
    }

    drawSnakePart(snakePart, color) {
        // Set the colour of the snake part
        this.snakeboard_ctx.fillStyle = color;
        // Set the border colour of the snake part
        this.snakeboard_ctx.strokestyle = this.snake_border;
        // Draw a "filled" rectangle to represent the snake part at the coordinates
        // the part is located
        this.snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
        // Draw a border around the snake part
        this.snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
    }

    moveSnake() {
        // Create the new Snake's head
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
        // Add the new head to the beginning of snake body
        this.snake.unshift(head);
        this.snake.pop();
    }

    checkGame() {
        // for (let i = 4; i < this.snake.length; i++) {
        //     if (this.snake[i].x === this.snake[0].x && this.snake[i].y === this.snake[0].y) return true
        // }
        for (let i = 0; i < this.snake.length; i++) {
            const hitLeftWall = this.snake[i].x < 0;
            const hitRightWall = this.snake[i].x > this.snakeboard.width - 10;
            const hitToptWall = this.snake[i].y < 0;
            const hitBottomWall = this.snake[i].y > this.snakeboard.height - 10;
            this.backMove(this.snake[i], hitLeftWall, hitRightWall, hitToptWall, hitBottomWall);
        }
        // const hitLeftWall = this.snake[0].x <= 0;
        // const hitRightWall = this.snake[0].x >= this.snakeboard.width - 10;
        // const hitToptWall = this.snake[0].y <= 0;
        // const hitBottomWall = this.snake[0].y >= this.snakeboard.height - 10;
        // return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
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
        const goingUp = this.dy === -10;
        const goingDown = this.dy === 10;
        const goingRight = this.dx === 10;
        const goingLeft = this.dx === -10;
        if (keyPressed === LEFT_KEY && !goingRight) {
            this.dx = -10;
            this.dy = 0;
        }

        if (keyPressed === UP_KEY && !goingDown) {
            this.dx = 0;
            this.dy = -10;
        }

        if (keyPressed === RIGHT_KEY && !goingLeft) {
            this.dx = 10;
            this.dy = 0;
        }

        if (keyPressed === DOWN_KEY && !goingUp) {
            this.dx = 0;
            this.dy = 10;
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

    }
}