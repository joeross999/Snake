var model = {
    directions: {
        up: {vertical: -1, horizontal: 0},
        down: {vertical: 1, horizontal: 0},
        right: {vertical: 0, horizontal: 1},
        left: {vertical: 0, horizontal: -1}
    },
    coins: [],
    // walls: [ [[-1, -1], [-1, 491]] , [[-1, 491], [491, 491]] , [[491, 491], [491, -1]] , [[-1, -1], [491, -1]] ]
    walls: {
        vertical: [
            {x: -10, y: [0, 500]},
            {x: 500, y:[0, 500]} 
        ],
        horizontal: [
            {y: -10, x: [0, 500]},
            {y: 500, x:[0, 500]} 
        ],
        
    }
};

var controller = {
    gameState: "Run",
    collision: [],
};

var Snake = function() {
    var obj = {};
    obj.move = {
        up: function(){
            if(obj.currentDirection != model.directions.down && moveable){
                obj.currentDirection = model.directions.up;
            }
            moveable = false;
        },
        down: function(){
            if(obj.currentDirection != model.directions.up && moveable){
                obj.currentDirection = model.directions.down;
            }
            moveable = false;
        },
        right: function(){
            if(obj.currentDirection != model.directions.left && moveable){
                obj.currentDirection = model.directions.right;
            }
            moveable = false;
        },
        left: function(){
            if(obj.currentDirection != model.directions.right && moveable){
                obj.currentDirection = model.directions.left;
            }
            moveable = false;
        },
        moveable: true,
        go: function(){
            var newBlock = obj.blocks[obj.blocks.length - 1].slice(0);
            newBlock[0] += obj.currentDirection.horizontal * obj.speed;
            newBlock[1] += obj.currentDirection.vertical * obj.speed;
            for(var i = 0; i < obj.blocks.length-1; i++){
                obj.blocks[i] = obj.blocks[i+1].slice(0);
            }
            obj.blocks.pop();
            obj.blocks.push(newBlock);
            moveable = true;
        },
    }
    obj.currentDirection = model.directions.down;
    obj.speed = 10;
    obj.length = 1;
    obj.blockSize = 9;
    obj.blocks = [
        [10, 10], [20, 10], [30, 10]
    ];
    obj.draw = function(){
        for(var i = 0; i < obj.blocks.length; i++){
            context.fillStyle="#000";
            context.fillRect(obj.blocks[i][0], obj.blocks[i][1], obj.blockSize, obj.blockSize);
        }
    }
    return obj;
};

var Coin = function(pos){
    var obj = {};
    obj.position = pos;
    obj.draw = function(){
        context.fillStyle="#cca002";
        context.fillRect(obj.position[0], obj.position[1], obj.size, obj.size);        
    }
    obj.size = 9;
    return obj;
};

var keypressHandler = function(e){
    switch(e.key){
        case "ArrowUp":
            model.snake.move.up();
            break;
        case "ArrowDown":
            model.snake.move.down();
            break;
        case "ArrowLeft":
            model.snake.move.left();
            break;
        case "ArrowRight":
            model.snake.move.right();
            break;
    }
};

var detectCollisions = function(){
    var head = {};
    head.x = model.snake.blocks[model.snake.blocks.length -1][0];
    head.y = model.snake.blocks[model.snake.blocks.length -1][1];
    model.walls.vertical.forEach(function(wall){
        if(head.x == wall.x){
            if(head.y > wall.y[0] && head.y < wall.y[1]){
                controller.collision.push(new Collision("wall"));
            }
        }
    }, this)
    model.walls.horizontal.forEach(function(wall){
        if(head.y == wall.y){
            if(head.x > wall.x[0] && head.x < wall.x[1]){
                controller.collision.push(new Collision("wall"));
            }
        }
    }, this)
};

var Collision = function(type){
    var obj = {};
    obj.type = type;
    return obj;
}


var randomPosition = function(){
    var x = randomNumber(1, 49) * 10;
    var y = randomNumber(1, 49) * 10;
    return [x, y];
};

var randomNumber = function(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var gameLoop = function(){
    console.log(JSON.parse(JSON.stringify(model.snake.blocks)));    
    setTimeout(function() {
        controller.collision = [];
        model.snake.move.go();
        detectCollisions();
        if(controller.collision.length > 0){
            if(controller.collision[0].type == "wall"){
                console.log("game over");
                gameOver();
            }
        }
        if(controller.gameState === "Run"){
            context.clearRect(0, 0, canvas.width, canvas.height);
            draw();
            gameLoop();
        }
    }, 500);
};

var gameOver = function(){
    controller.gameState = "Over"
}

var draw = function(){
    model.snake.draw();
    model.coins.forEach(function(element) {
        element.draw();
    }, this);
}

var init = function(){
    var canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    model.snake = new Snake();
    model.coins.push(new Coin(randomPosition()));
    model.coins[0].draw();
    model.snake.draw();
    gameLoop();
};

init();
    
window.onload = function(){
    window.addEventListener("keydown", keypressHandler, false);
}