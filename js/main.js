document.getElementById('mute').addEventListener('click', function (e)
{
    e = e || window.event;
    audio.muted = !audio.muted;
    e.preventDefault();
}, false);

function toggleSound() {
	var audio = document.getElementById('background_audio');
    audio.muted = !audio.muted;
    e.preventDefault();
}

// Creates instance of Game class
function Game() {
	// config stuff
	this.config = {
		gameWidth: 400,
		gameHeight: 300,
		fps: 50
	};

	// state variables
	this.lives = 3;

	// state stack
	this.stateStack = [];

	// I/O
	this.gameCanvas = null;
}

// initialize the game
Game.prototype.init = function(gameCanvas) {
	this.gameCanvas = gameCanvas;

	this.width = gameCanvas.width;
	this.height = gameCanvas.height;
}

// return current state (top of stack)
Game.prototype.currentState = function() {
    return this.stateStack.length > 0 ? this.stateStack[this.stateStack.length - 1] : null; 

Game.prototype.moveToState = function(state) {
	if(this.currentState()) {
 
        //  Before we pop the current state, see if the 
        //  state has a leave function. If it does we can call it.
        if(this.currentState().leave) {
           this.currentState().leave(game);
        }
        
        this.stateStack.pop();
    }

    //  If there's an enter function for the new state, call it.
    if(state.enter) {
        state.enter(game);
    }
 
    //  Set the current state.
    this.stateStack.push(state);
};

Game.prototype.pushState = function(state) {
 
    //  If there's an enter function for the new state, call it.
    if(state.enter) {
        state.enter(game);
    }
    //  Set the current state.
    this.stateStack.push(state);
};
 
Game.prototype.popState = function() {
 
    //  Leave and pop the state.
    if(this.currentState()) {
        if(this.currentState().leave) {
            this.currentState().leave(game);
        }
 
        //  Set the current state.
        this.stateStack.pop();
    }
};

 //  Inform the game a key is down.
Game.prototype.keyDown = function(keyCode) {
    this.pressedKeys[keyCode] = true;
    //  Delegate to the current state too.
    if(this.currentState() && this.currentState().keyDown) {
        this.currentState().keyDown(this, keyCode);
    }
};
 
//  Inform the game a key is up.
Game.prototype.keyUp = function(keyCode) {
    delete this.pressedKeys[keyCode];
    //  Delegate to the current state too.
    if(this.currentState() && this.currentState().keyUp) {
        this.currentState().keyUp(this, keyCode);
    }
};

// Game loop
function gameLoop(game) {
	var currentState = game.currentState();

	if(currentState) {
 
        //  Delta t is the time to update/draw.
        var dt = 1 / game.config.fps;
 
        //  Get the drawing context.
        var ctx = game.gameCanvas.getContext("2d");
		
        //  Update if we have an update function. Also draw
        //  if we have a draw function.
        if(currentState.update) {
            currentState.update(game, dt);
        }
        if(currentState.draw) {
            currentState.draw(game, dt, ctx);
        }
    }
}

// Starting the game
Game.prototype.start = function() {
 
    //  Move into the 'welcome' state.
    this.moveToState(new HomeState());
 
    //  Set the game variables.
    this.lives = 3;
    this.config.debugMode = /debug=true/.test(window.location.href);
 
    //  Start the game loop.
    var game = this;
    this.intervalId = setInterval(function () { gameLoop(game);}, 1000 / this.config.fps);
 
}; 

// Drawing

function drawCone() {
	var gameCanvas = document.getElementById("canvas");
	var cone = new Image();

	cone.src = "img/cone.png";
	gameCanvas.addEventListener("mousemove", redrawAvatar);
}

function redrawConeAvatar(e) {

}

// HomeState

function WelcomeState() {

}

WelcomeState.prototype.draw = function(game, dt, ctx) {
 
    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);
 
    ctx.font="30px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="center";
    ctx.textAlign="center";
    ctx.fillText("Space Invaders", game.width / 2, game.height/2 - 40);
    ctx.font="16px Arial";
 
    ctx.fillText("Press 'Space' to start.", game.width / 2, game.height/2);
}; 

WelcomeState.prototype.keyDown = function(game, keyCode) {
    if(keyCode == 32) /*space*/ {
        //  Space starts the game.
        game.moveToState(new GameState(game.level));
    }
};