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

var Shaders = {
	DotShader : {
		uniforms: {
			"tDiffuse": { type: "t", value: null },
			"tSize":    { type: "v2", value: new THREE.Vector2( 256, 256 ) },
			"center":   { type: "v2", value: new THREE.Vector2( 0.5, 0.5 ) },
			"angle":    { type: "f", value: 1.57 },
			"scale":    { type: "f", value: 1.0 }
		},
		vertexShader: [
			"varying vec2 vUv;",
			"void main() {",
				"vUv = uv;",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		].join("\n"),
		fragmentShader: [
			"uniform vec2 center;",
			"uniform float angle;",
			"uniform float scale;",
			"uniform vec2 tSize;",
			"uniform sampler2D tDiffuse;",
			"varying vec2 vUv;",

			"float pattern() {",
				"float s = sin( angle ), c = cos( angle );",
				"vec2 tex = vUv * tSize - center;",
				"vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;",
				"return ( sin( point.x ) * sin( point.y ) ) * 4.0;",
			"}",

			"void main() {",
				"vec4 color = texture2D( tDiffuse, vUv );",
				"float average = ( color.r + color.g + color.b ) / 3.0;",
				"gl_FragColor = vec4( vec3( average * 10.0 - 5.0 + pattern() ), color.a );",
			"}"
		].join("\n")
	}
}

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
			modelLoader.load( hackName,
				function(geo) {
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
	var self = this;
	this.renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	this.controllers = [];
	this.callback = this.update.bind( this );

	this.settings = {};
	window.location.href.replace(
		/[?&]+([^=&]+)=([^&]*)/gi,
		function(m,key,value) {
			self.settings[key] = value;
		}
	);

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
	var hitAsset = function( base, pre ) {
        var prefix = pre || "";
		return {
			name: "sound/hit" + base,
			volume: 0.3,
			urls: [
				prefix + "sound/hit" + base + ".mp3",
                prefix + "sound/hit" + base + ".ogg"
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
		{ name: "sound/bosshit", urls: ['sound/bosshit.mp3', 'sound/bosshit.ogg'], type: 'audio', volume: 0.4, buffer: true },
		{ name: "sound/bossdeath", urls: ['sound/bossdeath.mp3', 'sound/bossdeath.ogg'], type: 'audio', volume: 0.9, buffer: true },
		{ name: "sound/miss", urls: ['sound/miss.mp3', 'sound/miss.ogg'], type: 'audio', volume: 0.5, buffer: true },
		{ name: "sound/misfire", urls: ['sound/misfire.mp3', 'sound/misfire.ogg'], type: 'audio', volume: 0.5, buffer: true },
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
        hitAsset( 0, "player" ),
        hitAsset( 1, "player" ),
        hitAsset( 2, "player" ),
        hitAsset( 3, "player" ),
        hitAsset( 4, "player" ),
        { name: 'assets/gameover/gameover.png', type: 'img', },
        { name: 'assets/intro/intro_bg.png', type: 'img', },
		{ name: 'assets/intro/intro_glasses1.png', type: 'img' },
		{ name: 'assets/intro/intro_glasses2.png', type: 'img' },
		{ name: 'assets/intro/intro_glasses3.png', type: 'img' },
		{ name: 'assets/intro/intro_glasses4.png', type: 'img' },
		{ name: 'assets/intro/intro_radmars1.png', type: 'img' },
		{ name: 'assets/intro/intro_radmars2.png', type: 'img' },
		{ name: 'assets/intro/intro_mars.png', type: 'img' },
		{ name: 'assets/hud/notes.png', type: 'img' },
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

	if( game.settings.composer ) {
		this.composer = new THREE.EffectComposer( game.renderer );
		this.composer.addPass( new THREE.RenderPass( this.scene, this.camera ) );

		var effect = new THREE.ShaderPass( Shaders.DotShader );
		effect.uniforms[ 'scale' ].value = 4;
		effect.renderToScreen = true;
		this.composer.addPass( effect );
		// more passes?
	}
}

GameState.prototype.onStop = function( game ) {
	game.loader.get("sound/ld26").stop();
	game.controllers = [];
	game.renderer.autoClear = true;
}

GameState.prototype.render = function( game ) {
	game.renderer.clear();
	if( game.settings.composer ) {
		this.composer.render();
	}
	else {
		game.renderer.render( this.scene, this.camera );
	}
	game.renderer.render( this.uiController.scene, this.uiController.camera );
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

