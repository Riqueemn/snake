
var canvas, ctx, width, height, fps, tileSize, playing, cty, a, b, c, d, min1, max1, min2, max2;
var snake, playLabel;
var globalTouch = [], offset = [];
var comprimento = 12;

globalTouch = [];

var keys = {
	left: 37,
	up: 38,
	right: 39,
	down: 40
}

window.addEventListener("touchstart", touchStart);
window.addEventListener("touchmove", touchMove);
window.addEventListener("touchend", touchEnd);

window.addEventListener("keydown", keyDown);

window.addEventListener("resize", resizeWindow);

function touchEnd(e){
	if(Math.abs(offset[0]) > Math.abs(offset[1])){
		snake.direction = [offset[0] / Math.abs(offset[0]), 0];
	}else{
		snake.direction = [0, offset[1] / Math.abs(offset[1])];
	}
}

function touchMove(e){
	var touch = e.touches[0];

	offset = [touch.pageX - globalTouch[0], touch.pageY - globalTouch[1]];
}

function touchStart(e){
	e.preventDefault();
	var touch = e.touches[0];

	globalTouch = [touch.pageX, touch.pageY];
}

function keyDown(e){

	if(!playing && (e.keyCode == keys.left || e.keyCode == keys.up || e.keyCode == keys.right || e.keyCode == keys.down)){
		playing = true;
	}

	switch(e.keyCode){
		case keys.left:
			snake.direction = [-1, 0];
			break;
		case keys.right:
			snake.direction = [1, 0];
			break;
		case keys.up:
			snake.direction = [0, -1];
			break;
		case keys.down:
			snake.direction = [0, 1];
			break;
	}
}

function resizeWindow(){
	width = window.innerWidth;
	height = window.innerHeight;

	canvas.width = width;
	canvas.height = height;

	tileSize = Math.max(Math.floor(width/60), Math.floor(height/60));
}

function isMobileDevice(){
	return /Android | iPod | iPad | iPhone | Windows Phone/i.test(navigator.userAgent);
}

function init(){
	canvas = document.createElement("canvas");
	resizeWindow();
	document.body.appendChild(canvas);
	ctx = canvas.getContext("2d");
	cty = canvas.getContext("2d");

	fps = 15;

	newGame();
	run();
}

function newGame(){
	snake = new Snake();
	caixa = new Caixa();
	playLabel = new PlayLabel();
	playing = false;
}

function PlayLabel(){
	this.text;
	this.color = "#5d8357";

	this.messages = {
		portrait: "Rotacione para jogar",
		landscape: "Arraste para jogar",
		pc: "Pressione as setas para jogar"
	};

	if(isMobileDevice()){

	}else{
		this.text = this.messages["pc"];
	}

	this.draw = function(){
		ctx.fillStyle = this.color;
		ctx.font = tileSize + "px Arial";
		ctx.fillText(this.text, width / 2 - ctx.measureText(this.text).width / 2, height / 2);
	}
}

function Snake(){
	this.body = [[10,10],[11,11],[12,12]];
	this.color = "#000";
	

	this.direction = [0, -1];

	this.update = function(){
		var nextPos = [this.body[0][0] + this.direction[0], this.body[0][1] + this.direction[1]];

		if(!playing){
			if(this.direction[1] == -1 && nextPos[1] <= (height * 0.1 / tileSize)){
				this.direction = [1, 0];
			}

			else if(this.direction[0] == 1 && nextPos[0] >= (width * 0.9 / tileSize)){
				this.direction = [0, 1];
			}

			else if(this.direction[1] == 1 && nextPos[1] >= (height * 0.9 / tileSize)){
				this.direction = [-1, 0];
			}

			else if(this.direction[0] == -1 && nextPos[0] <= (width * 0.1 / tileSize)){
				this.direction = [0, -1];
			}

		}
		if(playing){
			if(nextPos[1] <= 0){
				playing = false;	
			}

			else if(nextPos[0] >= (width / tileSize)){
				playing = false;	
			}

			else if(nextPos[1] >= (height / tileSize)){
				playing = false;	
			}

			else if(nextPos[0] <= 0){
				playing = false;	
			}

			if(nextPos[0] == a && nextPos[1] == b){
				this.body.push([10, comprimento++]);
				console.log("++");

			}
		}

		 	

		if(nextPos[0] == this.body[1][0] && nextPos[1] == this.body[1][1]){
			snake.body.reverse();
			var nextPos = [this.body[0][0] + this.direction[0], this.body[0][1] + this.direction[1]];
		}

		this.body.pop();
		this.body.splice(0, 0, nextPos);
	}

	this.draw = function(){
		ctx.fillStyle = this.color;

		for(var i = 0;i < this.body.length; i++){
			ctx.fillRect(this.body[i][0] * tileSize, this.body[i][1] * tileSize, tileSize, tileSize);
		}


	}
}

function Caixa(){
	this.color = "#000";


	min1 = Math.ceil(0);
  	max1 = Math.floor(60);
  	min2 = Math.ceil(0);
  	max2 = Math.floor(20);

	this.caixa = [a, b];
	
	this.updateOutGame = function(){
		if(playing == false){
			c = Math.floor(Math.random() * (max1 - min1)) + min1;
			d = Math.floor(Math.random() * (max2 - min2)) + min2;
		}else{
			a = c;
			b = d;
		}
	}

	this.updateInGame = function(){
		
			a = Math.floor(Math.random() * (max1 - min1)) + min1;
			b = Math.floor(Math.random() * (max2 - min2)) + min2;
		
	}


	this.draw = function(){
		cty.fillStyle = this.color;

		
		ctx.fillRect(a * tileSize, b * tileSize, tileSize, tileSize);
		


	}

	
	


}

function update(){
	snake.update();
	caixa.updateOutGame();
	
}

function run(){
	update();
	draw();

	setTimeout(run, 1000/fps);

	
}

function draw(){
	ctx.clearRect(0, 0, width, height);
	cty.clearRect(0, 0, width, height);

	snake.draw();
	caixa.draw();

	if(!playing){
		playLabel.draw();
	}
}

init();