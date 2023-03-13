const snakeboard = document.getElementById("gameCanvas");
const game = new Game(snakeboard,10,0,'black','white','darkblue');
game.setUpSnake(6,100,100).init(50);