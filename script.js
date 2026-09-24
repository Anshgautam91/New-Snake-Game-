const { createApp } = Vue;
createApp({
    data(){
        return {
            Score: 0,
            message: "",
            secretMessage:"hello",
            messageIndex: 0,
            tiles:400,
            snake: [
            { row: 10, col: 10 }, //head 
            { row: 10, col: 9 },
            { row: 10, col: 8 }
            ],
            direction: 'RIGHT',
            gameOver: false ,
            started: false,
            paused: false,
            goalPanel: false,
            food: {
                row: 5,
                col: 5
            },  
        }
    },

    methods: {

        isSnakeTile(n) {
            let row = Math.floor((n - 1) / 20);
            let col = (n - 1) % 20;

            return this.snake.some(part => {
                return part.row === row && part.col === col;
            });
        },

        isFoodTile(n) {
            let row = Math.floor((n - 1) / 20);
            let col = (n - 1) % 20;
            return this.food.row === row && this.food.col === col;
        },

        generateFood() {
            let row;
            let col;
            do {
                row = Math.floor(Math.random() * 20);
                col = Math.floor(Math.random() * 20);
            } while (
                this.snake.some(part => part.row === row && part.col === col)
            );
            this.food = {
                row: row,
                col: col
            };
        },

        // handleKey(event) {
        //     console.log(event.key);
        // }

        handleKeyPress(event) {
            const key = event.key.toLowerCase(); // Normalizes 'W' and 'w'

            // UP (W or ArrowUp)
            if ((key === 'w' || key === 'arrowup') && this.direction !== 'DOWN') {
                this.direction = 'UP';
            } 
            // DOWN (S or ArrowDown)
            else if ((key === 's' || key === 'arrowdown') && this.direction !== 'UP') {
                this.direction = 'DOWN';
            } 
            // LEFT (A or ArrowLeft)
            else if ((key === 'a' || key === 'arrowleft') && this.direction !== 'RIGHT') {
                this.direction = 'LEFT';
            } 
            // RIGHT (D or ArrowRight)
            else if ((key === 'd' || key === 'arrowright') && this.direction !== 'LEFT') {
                this.direction = 'RIGHT';
            }
        },

        moveSnake() {
            let head = this.snake[0];

            let newRow = head.row;
            let newCol = head.col;

            if (this.direction === 'UP') {
                newRow--;
            }
            else if (this.direction === 'DOWN') {
                newRow++;
            }
            else if (this.direction === 'LEFT') {
                newCol--;
            }
            else if (this.direction === 'RIGHT') {
                newCol++;
            }

            if (newRow < 0 || newRow >= 20 || newCol < 0 || newCol >= 20) {
                this.gameOver = true;
                return;
            }

            if (this.snake.some(part => part.row === newRow && part.col === newCol)) {
                this.gameOver = true;
                return;
            }    

            this.snake.unshift({
                row: newRow,
                col: newCol
            });
            if (newRow === this.food.row && newCol === this.food.col) {
                this.Score++;
                this.messageIndex++;
                this.message = this.secretMessage.substring(0, this.messageIndex);
                if (this.messageIndex === this.secretMessage.length) {
                    console.log("MESSAGE COMPLETED!");
                    this.goalPanel = true;
                    this.paused = true;
                }

                // console.log("FOOD EATEN");
                // console.log(this.Score);
                // console.log(this.message);

                this.generateFood();
                
            }
            else {
            // Remove tail only when food was NOT eaten
                this.snake.pop();
            }
        },
        restartGame() {
            this.Score = 0;
            this.messageIndex = 0;
            this.message = "None";
            this.snake = [
            { row: 10, col: 10 },
            { row: 10, col: 9 },
            { row: 10, col: 8 }
        ];
            this.direction = 'RIGHT';
            this.gameOver = false;

            this.started = false;
            this.paused = false;
            this.goalPanel = false;

            this.generateFood();
        },
        toggleGame() {
            if (!this.started) {
                this.started = true;
                return;
            }
            this.paused = !this.paused;
        },
        continuePlaying() {
            this.goalPanel = false;
            this.paused = false;
        }
    },    
    mounted() {
        window.addEventListener("keydown", this.handleKeyPress);
            this.game = setInterval(() => {
                if (this.started && !this.gameOver && !this.paused) {
                    this.moveSnake();
                }
            }, 300);
    },

    unmounted() {
        window.removeEventListener('keydown', this.handleKeyPress);
            clearInterval(this.game);
    },    
        

}).mount(".main");
