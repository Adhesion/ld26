/* Some dumb shim shamelessly stolen from
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame    ||
	function( callback ){
		window.setTimeout(callback, 1000 / 60);
	};
})();

/** The main game object. Houses renderer, gamestate, etc. */
function Main() {
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera(
		60,
		window.innerWidth / window.innerHeight,
		1,
		10000
	);
	this.camera.position.y = -200;
	this.camera.position.z = 200;
	this.camera.lookAt(new THREE.Vector3());
	this.scene.add(this.camera);
	this.renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	this.controllers = [];
	this.callback = this.update.bind( this );

	this.container = document.createElement('div');
	this.container.setAttribute('class', 'game');
	this.container.appendChild(this.renderer.domElement);
	document.body.appendChild(this.container);
	window.onresize = this.resize.bind( this );

	// start the shit
	this.setState( new Intro() );
	this.resize();
	this.update();
};

Main.prototype.setState = function( state ) {
	if( this.state ) {
		this.state.onStop();
	}
	this.state = state;
	this.state.onStart( this );
};

Main.prototype.resize = function (event) {
	var width = window.innerWidth;
	var height = window.innerHeight;
	this.camera.aspect = width / height;
	this.camera.updateProjectionMatrix();
	this.renderer.setSize(width, height);
};

Main.prototype.update = function () {
	//update everything then render.
	for( var controller in this.controllers ) {
		this.controllers[controller].update();
	}

	this.render();

	// and then request another frame draw
	requestAnimFrame( this.callback );
};

Main.prototype.render = function () {
	this.renderer.render(this.scene, this.camera);
};

Main.prototype.add = function (obj) {
	this.scene.add(obj.holder);
};

Main.prototype.remove = function (obj) {
	this.scene.remove(obj.holder);
};

function GameState() {
};

GameState.prototype.onStart = function( game ) {
	console.log( "Starting game state!" );
	this.bgController = new BackgroundController(game);
	this.goController = new GameObjectController(game);
	this.uiController = new UIController(game);

	game.controllers.push(
		this.bgController,
		this.goController,
		this.uiController
	);
}

GameState.prototype.onStop = function( game ) {
	console.log( "Stopping game state!" );
}

function Intro() {
}

Intro.prototype.onStart = function( game ) {
	console.log( "Starting intro... ?" );
	game.setState( new GameState() );
};

Intro.prototype.onStop = function( game) {
	console.log( "Stopping intro... ?" );
};

