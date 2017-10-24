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
        
    },
    score: 0,
    gameStates: {
        over: {
            headerText: "Game Over :("
        },
        play: {
            headerText: "Score: "
        },
        start: {
            headerText: "Press the Play button :)"
        }
    }
};

var object = {
    Snake: function() {
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
                view.context.fillStyle="#000";
                view.context.fillRect(obj.blocks[i][0], obj.blocks[i][1], obj.blockSize, obj.blockSize);
            }
        }
        return obj;
    },
    
    Coin: function(pos){
        var obj = {};
        obj.position = pos;
        obj.draw = function(){
            view.context.fillStyle="#cca002";
            view.context.fillRect(obj.position[0], obj.position[1], obj.size, obj.size);        
        }
        obj.size = 9;
        return obj;
    },
    Collision: function(type, obj){
        var obj = {};
        obj.type = type;
        collisionObj = obj
        return obj;
    }
};



var view = {
    score: "",
    canvas: "",
    context: "",
    headerText: ""
}

var controller = {
    gameState: {},
    collision: []
};


controller.keypressHandler = function(e){
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

controller.detectCollisions = function(){
    var head = {};
    head.x = model.snake.blocks[model.snake.blocks.length -1][0];
    head.y = model.snake.blocks[model.snake.blocks.length -1][1];
    model.walls.vertical.forEach(function(wall){
        if(head.x == wall.x){
            if(head.y > wall.y[0] && head.y < wall.y[1]){
                controller.collision.push(new object.Collision("wall", wall));
            }
        }
    }, this);
    model.walls.horizontal.forEach(function(wall){
        if(head.y == wall.y){
            if(head.x > wall.x[0] && head.x < wall.x[1]){
                controller.collision.push(new object.Collision("wall", wall));
            }
        }
    }, this);
    model.coins.forEach(function(coin){
        console.log("coin + head");
        console.log(coin);
        console.log(head)
        if(head.x == coin.position[0] && head.y == coin.position[1]){
            console.log("Coin Collision!!!!!!!!!!")
            return controller.collision.push(new object.Collision("coin", coin));
        }
    });
};

controller.randomPosition = function(){
    var x = controller.randomNumber(1, 49) * 10;
    var y = controller.randomNumber(1, 49) * 10;
    return [x, y];
};

controller.randomNumber = function(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

controller.gameLoop = function(){
    console.log(JSON.parse(JSON.stringify(model.snake.blocks)));    
    setTimeout(function() {
        controller.collision = [];
        model.snake.move.go();
        controller.detectCollisions();
        if(controller.collision.length > 0){
            if(controller.collision[0].type == "wall"){
                console.log("game over");
                controller.gameOver();
            }
            if(controller.collision[0].type =="coin"){
                console.log("model.score++;");
                model.score++;
                model.coins.pop();
                console.log(model.score);
            }
        }
        controller.draw();
        if(controller.gameState === model.gameStates.play){
            controller.gameLoop();
        }
    }, 500);
};

controller.gameOver = function(){
    controller.gameState = model.gameStates.over;
    model.score = "";
    // Need some sort of game over animation    
}

controller.draw = function(){
    view.score.innerHTML = model.score;
    view.headerText.innerHTML = controller.gameState.headerText;
    if(controller.gameState === model.gameStates.play){
    controller.fillCanvas();
    }
}

controller.fillCanvas = function(){
    view.context.clearRect(0, 0, canvas.width, canvas.height);
    model.snake.draw();
    model.coins.forEach(function(element) {
        element.draw();
    }, this);
    
}

controller.init = function(){
    // Get view elements
    view.canvas = document.getElementById("canvas");
    view.context = view.canvas.getContext("2d");
    view.score = document.getElementsByClassName("score")[0];
    view.headerText = document.getElementsByClassName("header-text")[0];
    // Set initial Model elements
    model.headerText = "Score: "
    model.score = 0;
    model.snake = new object.Snake();
    model.coins.push(new object.Coin(controller.randomPosition()));
    model.score = 0;
    controller.gameState = model.gameStates.play;
    // Draw scene
    controller.draw();
    controller.gameLoop();
};

controller.init();
    
window.onload = function(){
    window.addEventListener("keydown", controller.keypressHandler, false);
}