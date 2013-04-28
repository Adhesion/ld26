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

function Loader() {
	this.assets = {};
};

Loader.prototype.load = function( assets ) {
	var self = this;
	for( var i = 0; i < assets.length; i ++ ) {
		var asset = assets[i];
		if( asset.type == 'img' ) {
			var image = THREE.ImageUtils.loadTexture(
				asset.name,
				undefined,
				function( image ) {
					self.assets[image.name] = image;
				},
				function( error ) {
					console.error( error );
				}
			);
			image.name = asset.name;
		}
		else if( asset.type == 'audio' ) {
			var settings = {};
			var audio;
			settings.name = asset.name;
			if( asset.volume ) settings.volume = asset.volume;
			if( asset.buffer ) settings.buffer = asset.buffer;
			settings.urls = asset.urls;
			settings.onload = function( ) {
				self.assets[this.hack_asset_name] = this;
				if( this.hack_callback )
					this.hack_callback( this );
			}
			audio = new Howl( settings );
			audio.hack_asset_name = asset.name;
			audio.hack_callback = asset.callback;
		}
	}
};

Loader.prototype.done = function( assets ) {
	for( var asset in assets ) {
		if( ! this.assets[assets[asset].name] ) {
			return false;
		}
	}
	return true;
};

Loader.prototype.get = function( name ) {
	var value = this.assets[name];
	if( ! value ) {
		throw "Unknown asset " + name;
	}
	return value;
};


/** The main game object. Houses renderer, gamestate, etc. */
function Main() {
	this.scene = new THREE.Scene();
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


	this.loader = new Loader();
	this.loader.load( this.getAssets() );
	this.tryToStart();
}

Main.prototype.tryToStart = function() {

	if( ! this.loader.done( this.getAssets() ) ) {
		setTimeout( this.tryToStart.bind( this ), 50 );
		return;
	}

	// start the shit
	this.lastFrame = Date.now();
	this.setState( new Intro() );
	this.resize();
	this.update();
};

Main.prototype.getAssets = function() {
	var hitAsset = function( base ) {
		return {
			name: "sound/hit" + base,
			volume: 0.3,
			urls: [
				"sound/hit" + base + ".mp3",
				"sound/hit" + base + ".ogg"
			],
			type: 'audio',
			callback: function( audio ) {
				window.hitSounds = window.hitSounds || [];
				window.hitSounds[base] = audio;
			}
		};
	};

	return [
		{ name: "sound/ld26", urls: ['sound/ld26.mp3', 'sound/ld26.ogg'], type: 'audio', volume: 0.9, buffer: true },
		hitAsset( 0 ),
		hitAsset( 1 ),
		hitAsset( 2 ),
		hitAsset( 3 ),
		hitAsset( 4 ),
		hitAsset( 5 ),
		hitAsset( 6 ),
		hitAsset( 7 ),
		hitAsset( 8 ),
		hitAsset( 9 ),
		hitAsset( 10 ),
		hitAsset( 11 ),
		hitAsset( 12 ),
		hitAsset( 13 ),
		hitAsset( 14 ),
		{ name: 'assets/intro/intro_bg.png', type: 'img', },
		{ name: 'assets/intro/intro_glasses1.png', type: 'img' },
		{ name: 'assets/intro/intro_glasses2.png', type: 'img' },
		{ name: 'assets/intro/intro_glasses3.png', type: 'img' },
		{ name: 'assets/intro/intro_glasses4.png', type: 'img' },
		{ name: 'assets/intro/intro_radmars1.png', type: 'img' },
		{ name: 'assets/intro/intro_radmars2.png', type: 'img' },
		{ name: 'assets/intro/intro_mars.png', type: 'img' }
	];
};

Main.prototype.setState = function( state ) {
	if( this.state ) {
		this.state.onStop( this );
	}
	this.state = state;
	this.state.onStart( this );
};

Main.prototype.resize = function (event) {
	var width = window.innerWidth;
	var height = window.innerHeight;
	if( this.state.resize ) {
		this.state.resize( width, height );
	}
	this.renderer.setSize(width, height);
};

Main.prototype.update = function () {
	var delta = Date.now() - this.lastFrame;

	//update everything then render.
	for( var controller in this.controllers ) {
		this.controllers[controller].update( delta );
	}

	this.render();

	this.lastFrame = Date.now();

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

GameState.prototype.resize = function( width, height ) {
	this.game.camera.aspect = width / height;
	this.game.camera.updateProjectionMatrix();
}

GameState.prototype.onStart = function( game ) {
	console.log( "Starting game state!" );
	this.game = game;

	game.loader.get("sound/ld26").play();

	game.camera = new THREE.PerspectiveCamera(
		60,
		window.innerWidth / window.innerHeight,
		1,
		10000
	);
	game.camera.position.y = -200;
	game.camera.position.z = 200;
	game.camera.lookAt(new THREE.Vector3());
	game.scene.add(this.camera);

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
	this.game = game;
	this.game.camera = new THREE.OrthographicCamera(
		0,
		window.innerWidth,
		0,
		window.innerHeight
	);
	this.controller = new IntroController( game );
	game.controllers.push( this.controller );
	console.log( "Starting intro... ?" );
};

Intro.prototype.reisze = function( width, height ) {
	this.game.camera.right = width;
	this.game.camera.height = height;
	this.game.camera.updateProjectionMatrix();
}

Intro.prototype.onStop = function( game) {
	this.controller.onStop();
	console.log( "Stopping intro... ?" );
	game.controllers = [];
};

function IntroController( game ) {

	this.game = game;
	var glassesFiles = [
		'assets/intro/intro_glasses1.png',
		'assets/intro/intro_glasses2.png',
		'assets/intro/intro_glasses3.png',
		'assets/intro/intro_glasses4.png'
	];

	var textFiles = [
		'assets/intro/intro_mars.png',
		'assets/intro/intro_radmars1.png',
		'assets/intro/intro_radmars2.png',
	];

	this.textMaterials = textFiles.map(function( file ) {
		return new THREE.SpriteMaterial({
			map: game.loader.get( file ),
			useScreenCoordinates: true,
			alignment: THREE.SpriteAlignment.topLeft
		});
	});

	this.glassesMaterials = glassesFiles.map(function( file ) {
		return new THREE.SpriteMaterial({
			map: game.loader.get( file ),
			useScreenCoordinates: true,
			alignment: THREE.SpriteAlignment.topLeft
		});
	});

	this.textSpriteIndex = 0;

	this.textSprite = new THREE.Sprite(
		this.textMaterials[ this.textSpriteIndex ]
	);
	this.textSprite.position.set( 346, 377, 0 );
	this.textSprite.scale.set( 108, 28, 1 );

	this.glassesSpriteIndex = 0;
	this.glassesSprite = new THREE.Sprite(
		this.glassesMaterials[ this.glassesSpriteIndex ]
	);
	this.glassesSprite.position.set( 0, 0, 0 );
	this.glassesSprite.scale.set( 144, 24, 1 );

	var bgMaterial = new THREE.SpriteMaterial({
		map: this.game.loader.get( "assets/intro/intro_bg.png" ),
		useScreenCoordinates: true,
		alignment: THREE.SpriteAlignment.topLeft
	});

	this.bgSprite = new THREE.Sprite( bgMaterial );
	this.bgSprite.position.set( 0, 0, 0 );
	this.bgSprite.scale.set( 800, 600, 1 );
	this.counter = 0;

	document.onkeypress = function( e ) {
		if( e.keyCode == 13 ) {
			game.setState( new GameState() );
		}
	};

	this.game.scene.add( this.bgSprite );
	this.game.scene.add( this.textSprite );
	this.game.scene.add( this.glassesSprite );
}

IntroController.prototype.onStop = function() {
	this.game.scene.remove( this.glassesSprite );
	this.game.scene.remove( this.bgSprite );
	this.game.scene.remove( this.textSprite );
}

IntroController.prototype.update = function( dt ) {
	this.counter += dt;
	if( this.counter < 2000)
		this.textSprite.material = this.textMaterials[ this.textSpriteIndex = 0 ];
	else if( this.counter < 2050) {
		this.textSprite.position.set( 306, 377, 0 );
		this.textSprite.scale.set( 192, 28, 1 );
		this.textSprite.material = this.textMaterials[ this.textSpriteIndex = 1 ];
	}
	else if( this.counter < 2600)
		this.textSprite.material = this.textMaterials[ this.textSpriteIndex = 2 ];
	else if( this.counter < 2650)
		this.textSprite.material = this.textMaterials[ this.textSpriteIndex = 1 ];
	else if( this.counter < 2700)
		this.textSprite.material = this.textMaterials[ this.textSpriteIndex = 2 ];
	else if( this.counter < 2750)
		this.textSprite.material = this.textMaterials[ this.textSpriteIndex = 1 ];
	else if( this.counter < 2800)
		this.textSprite.material = this.textMaterials[ this.textSpriteIndex = 2 ];
	else if( this.counter < 2850)
		this.textSprite.material = this.textMaterials[ this.textSpriteIndex = 1 ];
	else
		this.textSprite.material = this.textMaterials[ this.textSpriteIndex = 2 ];

	if( this.counter < 2000)
		this.glassesSprite.position.set( 249+80,  289 * (this.counter/2000.0), 0 );
	else if( this.counter < 2150 )
		this.glassesSprite.material = this.glassesMaterials[ this.glassesSpriteIndex = 1 ];
	else if( this.counter < 2300 )
		this.glassesSprite.material = this.glassesMaterials[ this.glassesSpriteIndex = 2 ];
	else if( this.counter < 2550 )
		this.glassesSprite.material = this.glassesMaterials[ this.glassesSpriteIndex = 3 ];
	else
		this.glassesSprite.material = this.glassesMaterials[ this.glassesSpriteIndex = 0 ];
}

