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

    this.notes = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: main.loader.get( "assets/hud/notes.png" ),
            useScreenCoordinates: true,
            alignment: THREE.SpriteAlignment.topLeft
        })
    );

    this.notes.position.set( window.innerWidth - 320, 20, 0 );
    this.notes.scale.set( 298, 13, 1 );

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
        })
    );
    this.barFg.translateOnAxis( new THREE.Vector3( 1, 0, 0 ), 200 );
    this.barFg.translateOnAxis( new THREE.Vector3( 0, 1, 0 ), 30 );
    this.barFg.translateOnAxis( new THREE.Vector3( 0, 0, 1 ), 30 );
    this.barFg.rotateOnAxis( new THREE.Vector3( 1, 0, 0 ), 90 );

    this.scene.add( this.barBg );
    this.scene.add( this.barFg );
    this.scene.add( this.notes );
}

UIController.prototype.resize = function( width, height ) {
    this.camera.right = width;
    this.camera.bottom = height;
    this.camera.updateProjectionMatrix();
    this.notes.position.set( width - 320, 20 );
}

UIController.prototype.addScore = function (val) {
    this.score += val;
};

UIController.prototype.update = function () {
    var avatar = this.main.state.goController.avatar;
    this.barFg.scale.x = avatar.hp / avatar.startHP;

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
 
