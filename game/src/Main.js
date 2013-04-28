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
    var modelLoader = new THREE.JSONLoader();
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
		else if( asset.type == 'model' ) {
			var hackName = asset.name;
			console.log( "model namey hackey bullshit 1: " + hackName );
			modelLoader.load( hackName,
				function(geo) {
					console.log( "model namey hackey bullshit 2: " + hackName );
					self.assets[hackName] = geo;
				}
			);
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
	this.renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	this.controllers = [];
	this.callback = this.update.bind( this );

	this.container = document.createElement('div');
	this.container.setAttribute('class', 'game');
	this.container.appendChild(this.renderer.domElement);
	this.operations = [];
	document.body.appendChild(this.container);
	window.onresize = this.resize.bind( this );

	window.main = this;
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
		{ name: "sound/radmarslogo", urls: ['sound/radmarslogo.mp3', 'sound/radmarslogo.ogg'], type: 'audio', volume: 0.9, buffer: true },
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
		{ name: 'assets/gameover/gameover.png', type: 'img', },
		{ name: 'assets/intro/intro_bg.png', type: 'img', },
		{ name: 'assets/intro/intro_glasses1.png', type: 'img' },
		{ name: 'assets/intro/intro_glasses2.png', type: 'img' },
		{ name: 'assets/intro/intro_glasses3.png', type: 'img' },
		{ name: 'assets/intro/intro_glasses4.png', type: 'img' },
		{ name: 'assets/intro/intro_radmars1.png', type: 'img' },
		{ name: 'assets/intro/intro_radmars2.png', type: 'img' },
		{ name: 'assets/intro/intro_mars.png', type: 'img' },
		{ name: 'assets/models/pyramid.js', type: 'model' }
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
	var op;
	while( op = this.operations.pop() ) {
		console.log( "Running operation" );
		op(this);
	}

	var delta = Date.now() - this.lastFrame;

	//update everything then render.
	for( var controller in this.controllers ) {
		this.controllers[controller].update( delta );
	}

	this.state.render( this );

	this.lastFrame = Date.now();

	// and then request another frame draw
	requestAnimFrame( this.callback );
};

function GameState() {

};

GameState.prototype.resize = function( width, height ) {
	this.camera.aspect = width / height;
	this.camera.updateProjectionMatrix();
	this.uiController.resize( width, height );
}

GameState.prototype.onStart = function( game ) {
	this.game = game;

	this.scene = new THREE.Scene();
	game.loader.get("sound/ld26").play();
	game.renderer.autoClear = false;

	this.camera = new THREE.PerspectiveCamera(
		60,
		window.innerWidth / window.innerHeight,
		1,
		10000
	);
	this.camera.position.y = -200;
	this.camera.position.z = 200;
	this.camera.lookAt(new THREE.Vector3());

	this.bgController = new BackgroundController(this.scene);
	this.goController = new GameObjectController(game);
	this.uiController = new UIController(game);

	game.controllers.push(
		this.bgController,
		this.goController,
		this.uiController
	);
}

GameState.prototype.onStop = function( game ) {
	game.loader.get("sound/ld26").stop();
	game.controllers = [];
	game.renderer.autoClear = true;
}

GameState.prototype.render = function( game ) {
	game.renderer.clear();
	game.renderer.render( this.scene, this.camera );
	if( this.uiController ) {
		game.renderer.render( this.uiController.scene, this.uiController.camera );
	}
}

function Intro() {
}

Intro.prototype.render = function( game ) {
	game.renderer.render(this.scene, this.camera);
}

Intro.prototype.onStart = function( game ) {
	this.game = game;
	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera(
		0,
		window.innerWidth,
		0,
		window.innerHeight
	);
	this.controller = new IntroController( game, this.camera, this.scene );
	game.controllers.push( this.controller );
	game.loader.get("sound/radmarslogo").play();
};

Intro.prototype.resize = function( width, height ) {
	this.camera.right = width;
	this.camera.bottom = height;
	this.camera.updateProjectionMatrix();

	this.controller.resize( width, height );
}

Intro.prototype.onStop = function( game) {
	game.loader.get("sound/radmarslogo").stop();
	this.controller.onStop();
	game.controllers = [];
};

function IntroController( game, camera, scene ) {

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

	this.cx = camera.right / 2;
	this.cy = camera.bottom / 2;

	this.textSprite = new THREE.Sprite( this.textMaterials[ 0 ] );
	this.textSprite.scale.set( 108, 28, 1 );

	this.glassesSprite = new THREE.Sprite( this.glassesMaterials[ 0 ] );
	this.glassesSprite.scale.set( 144, 24, 1 );

	var bgMaterial = new THREE.SpriteMaterial({
		map: this.game.loader.get( "assets/intro/intro_bg.png" ),
		useScreenCoordinates: true,
		alignment: THREE.SpriteAlignment.topLeft
	});

	this.bgSprite = new THREE.Sprite( bgMaterial );
	this.bgSprite.scale.set( 800, 600, 1 );

	this.counter = 0;

	document.onkeypress = function( e ) {
		if( e.keyCode == 13 ) {
			game.operations.push(function() {
				game.setState( new GameState() );
			});
		}
	};

	scene.add( this.bgSprite );
	scene.add( this.textSprite );
	scene.add( this.glassesSprite );
}

IntroController.prototype.resize = function( width, height ) {
	this.cx = width / 2;
	this.cy = height / 2;
}

IntroController.prototype.onStop = function() {
	document.onkeypress = function( e ) {
	};
}

IntroController.prototype.update = function( dt ) {
	this.counter += dt;

//	if( this.counter > 4000)
//		game.operations.push(function() {
//				game.setState( new GameState() );
//			});

	if( this.counter < 2000)
		this.textSprite.material = this.textMaterials[ 0 ];
	else if( this.counter < 2050) {
		this.textSprite.scale.set( 192, 28, 1 );
		this.textSprite.material = this.textMaterials[ 1 ];
	}
	else if( this.counter < 2600)
		this.textSprite.material = this.textMaterials[ 2 ];
	else if( this.counter < 2650)
		this.textSprite.material = this.textMaterials[ 1 ];
	else if( this.counter < 2700)
		this.textSprite.material = this.textMaterials[ 2 ];
	else if( this.counter < 2750)
		this.textSprite.material = this.textMaterials[ 1 ];
	else if( this.counter < 2800)
		this.textSprite.material = this.textMaterials[ 2 ];
	else if( this.counter < 2850)
		this.textSprite.material = this.textMaterials[ 1 ];
	else
		this.textSprite.material = this.textMaterials[ 2 ];

	if( this.counter < 2000)
		this.glassesSprite.position.y = ( this.cy - this.glassesSprite.scale.y / 2 ) * (this.counter/2000.0);
	else if( this.counter < 2150 )
		this.glassesSprite.material = this.glassesMaterials[ 1 ];
	else if( this.counter < 2300 )
		this.glassesSprite.material = this.glassesMaterials[ 2 ];
	else if( this.counter < 2550 )
		this.glassesSprite.material = this.glassesMaterials[ 3 ];
	else
		this.glassesSprite.material = this.glassesMaterials[ 0 ];

	this.bgSprite.position.set( this.cx - 800/2, this.cy - 600/2, 0 );
	this.textSprite.position.set( this.cx - 108/2 , 377, 0 );
	this.glassesSprite.position.x = this.cx - 144/2;

	this.textSprite.position.set(
		this.cx - this.textSprite.scale.x/2 ,
		this.cy - 28 / 2 + 80, 0
	);

}

function GameOver() {
}

GameOver.prototype.render = function( game ) {
	game.renderer.render(this.scene, this.camera);
}

GameOver.prototype.onStart = function( game ) {
	this.game = game;
	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera(
		0,
		window.innerWidth,
		0,
		window.innerHeight
	);
	this.controller = new GameOverController( game, this.camera, this.scene );
	game.controllers.push( this.controller );
	game.loader.get("sound/radmarslogo").play();
};

GameOver.prototype.resize = function( width, height ) {
	this.camera.right = width;
	this.camera.bottom = height;
	this.camera.updateProjectionMatrix();

	this.controller.resize( width, height );
}

GameOver.prototype.onStop = function( game) {
	game.loader.get("sound/radmarslogo").stop();
	this.controller.onStop();
	game.controllers = [];
};

function GameOverController( game, camera, scene ) {
	this.game = game;

	this.cx = camera.right / 2;
	this.cy = camera.bottom / 2;

	var bgMaterial = new THREE.SpriteMaterial({
		map: this.game.loader.get( "assets/gameover/gameover.png" ),
		useScreenCoordinates: true,
		alignment: THREE.SpriteAlignment.topLeft
	});

	this.bgSprite = new THREE.Sprite( bgMaterial );
	this.bgSprite.scale.set( 800, 600, 1 );

	this.counter = 0;

	scene.add( this.bgSprite );
}

GameOverController.prototype.resize = function( width, height ) {
	this.cx = width / 2;
	this.cy = height / 2;
}

GameOverController.prototype.onStop = function() {
}

GameOverController.prototype.update = function( dt ) {
	this.counter += dt;

	this.bgSprite.position.set( this.cx - 800/2, this.cy - 600/2, 0 );
}

