function UIController(main) {
    this.main = main;

    this.displayScore = 0;
    this.score = 0;

    /*
    this.scoreTxt = document.createTextNode("0");

    this.scoreDiv = document.createElement('div');
    this.scoreDiv.setAttribute('class', 'score');
    this.scoreDiv.appendChild(this.scoreTxt);
    document.body.appendChild(this.scoreDiv);
    */

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(
        0,
        window.innerWidth,
        0,
        window.innerHeight
    );
    this.camera.position.z = 100;

    this.note0 = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: main.loader.get( "assets/hud/note0.png" ),
            useScreenCoordinates: true,
            alignment: THREE.SpriteAlignment.topLeft
        })
    );
    this.note1 = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: main.loader.get( "assets/hud/note1.png" ),
            useScreenCoordinates: true,
            alignment: THREE.SpriteAlignment.topLeft
        })
    );
    this.note2 = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: main.loader.get( "assets/hud/note2.png" ),
            useScreenCoordinates: true,
            alignment: THREE.SpriteAlignment.topLeft
        })
    );
    this.note3 = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: main.loader.get( "assets/hud/note3.png" ),
            useScreenCoordinates: true,
            alignment: THREE.SpriteAlignment.topLeft
        })
    );
    this.note4 = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: main.loader.get( "assets/hud/note4.png" ),
            useScreenCoordinates: true,
            alignment: THREE.SpriteAlignment.topLeft
        })
    );

    console.log( "x pos: " + (window.innerWidth / 2 - 149) );
    console.log( "y pos: " + window.innerHeight * 0.85 );

    this.note0.position.set( window.innerWidth / 2 - 35 - 80 * 2, window.innerHeight - 80, 0 );
    this.note0.scale.set( 70, 70, 1 );

    this.note1.position.set( window.innerWidth / 2 - 35 - 80, window.innerHeight - 80, 0 );
    this.note1.scale.set( 70, 70, 1 );

    this.note2.position.set( window.innerWidth / 2 - 35, window.innerHeight - 80, 0 );
    this.note2.scale.set( 70, 70, 1 );

    this.note3.position.set( window.innerWidth / 2 - 35 + 80, window.innerHeight - 80, 0 );
    this.note3.scale.set( 70, 70, 1 );

    this.note4.position.set( window.innerWidth / 2 - 35 + 80 * 2, window.innerHeight - 80, 0 );
    this.note4.scale.set( 70, 70, 1 );

    this.barBg = new THREE.Mesh(
        new THREE.PlaneGeometry( 100, 30 ),
        new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: false
        })
    );
    this.barBg.translateOnAxis( new THREE.Vector3( 1, 0, 0 ), 200 );
    this.barBg.translateOnAxis( new THREE.Vector3( 0, 1, 0 ), 30 );
    this.barBg.rotateOnAxis( new THREE.Vector3( 1, 0, 0 ), 90 );

    this.barFg = new THREE.Mesh(
        new THREE.PlaneGeometry( 100, 30 ),
        new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: false
        })
    );
    this.barFg.translateOnAxis( new THREE.Vector3( 1, 0, 0 ), 200 );
    this.barFg.translateOnAxis( new THREE.Vector3( 0, 1, 0 ), 30 );
    this.barFg.translateOnAxis( new THREE.Vector3( 0, 0, 1 ), 30 );
    this.barFg.rotateOnAxis( new THREE.Vector3( 1, 0, 0 ), 90 );

    this.scene.add( this.barBg );
    this.scene.add( this.barFg );

    this.scene.add( this.note0 );
    this.scene.add( this.note1 );
    this.scene.add( this.note2 );
}

UIController.prototype.resize = function( width, height ) {
    this.camera.right = width;
    this.camera.bottom = height;
    this.camera.updateProjectionMatrix();

    //this.notes.position.set( width - 320, 20 );

    this.note0.position.set( width / 2 - 35 - 80 * 2, height - 80, 0 );
    this.note1.position.set( width / 2 - 35 - 80, height - 80, 0 );
    this.note2.position.set( width / 2 - 35, height - 80, 0 );
    this.note3.position.set( width / 2 - 35 + 80, height - 80, 0 );
    this.note4.position.set( width / 2 - 35 + 80 * 2, height - 80, 0 );
}

UIController.prototype.addScore = function (val) {
    this.score += val;
};

UIController.prototype.update = function () {
    var avatar = this.main.state.goController.avatar;
    this.barFg.scale.x = avatar.hp / avatar.startHP;

    var input = this.main.state.goController.input;

    if(input.x) this.note0.material.opacity = 1;
    else this.note0.material.opacity = 0.5;
    if(input.c) this.note1.material.opacity = 1;
    else this.note1.material.opacity = 0.5;
    if(input.v) this.note2.material.opacity = 1;
    else this.note2.material.opacity = 0.5;
    if(input.b) this.note3.material.opacity = 1;
    else this.note3.material.opacity = 0.5;
    if(input.n) this.note4.material.opacity = 1;
    else this.note4.material.opacity = 0.5;

    if (this.displayScore < this.score) {
        this.displayScore += (this.score - this.displayScore) * 0.05;
        if (this.score - this.displayScore <= 1) {
            this.displayScore = this.score;
        }
    }

    /*
    this.scoreTxt.nodeValue = "" + Math.round(this.displayScore);
    */
};

UIController.prototype.showKeyUI = function (val) {
    if( val == 3 ) this.scene.add( this.note3 );
    else if( val == 4 ) this.scene.add( this.note4 );
};
