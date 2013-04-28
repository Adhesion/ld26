function GameObjectController(main) {
    this.main = main;
    this.input = new Input();

    this.camera = this.main.state.camera;
    this.camera.up = new THREE.Vector3( 0, 0, 1 );
    this.cameraTarget = new THREE.Vector3();
    this.level = new Level(this);

    this.avatar = new Avatar();
    this.baddieSpawnRate = this.baddieSpawnCount = 1.0;

    this.particles = [];
    this.baddies = [];

    this.nextChain = null;
    this.chain = [];

    this.main.state.scene.add(this.avatar.holder);

    // have any of these keys been pressed this update cycle?
    this.a = this.s = this.d = this.f = this.g = false;
}

GameObjectController.prototype.update = function () {
    TWEEN.update();

    this.checkInput();
    var dt = 1/60;

    this.level.update(dt);

    this.updateObjects(this.baddies, dt);
    this.updateObjects(this.particles, dt);
    this.avatar.update(dt);

    this.camera.lookAt(this.cameraTarget);

    //this.spawnBaddie(dt);
    this.checkHits();
};


GameObjectController.prototype.checkHits = function () {
    var d = new THREE.Vector3();

    for (var i = 0; i < this.baddies.length; i++) {
        d.subVectors(this.baddies[i].pos, this.avatar.pos);

        if(d.length() <= this.avatar.range + this.baddies[i].size ){
            this.baddies[i].slowed = true;
        }

        if(d.length() <= this.baddies[i].size ){
            this.spawnDieParticles(this.baddies[i]);
            this.baddies[i].hit(1);

            //TODO: avatar take a hit.
            this.avatar.hp--;
            if( this.avatar.hp == 0 ) {
                this.main.operations.push(function(game) {
                    game.setState( new GameOver() );
                });
            }
        }
    }
};


GameObjectController.prototype.addScore = function (val) {
    this.main.state.uiController.addScore(val);
};


GameObjectController.prototype.spawnDieParticles = function (baddie) {
    var i;
    var particle;

    for (i = 0; i < 10; i++) {
        particle = new Particle(baddie.pos.clone(), baddie.color, baddie.wireColor, baddie.size, 1.0, 200);
        this.particles.push(particle);
        this.main.state.scene.add(particle.holder);
    }
};


GameObjectController.prototype.spawnChainParticles = function (baddie) {
    var i;
    var particle;

    for (i = 0; i < 5; i++) {
        particle = new Particle(baddie.pos.clone(), 0x000000, 0x000000, baddie.size, 1.0, 200);
        this.particles.push(particle);
        this.main.state.scene.add(particle.holder);
    }
};

GameObjectController.prototype.makeBaddie = function (baddie) {
    baddie.target = this.avatar;
    this.baddies.push(baddie);
    this.main.state.scene.add(baddie.holder);
}

GameObjectController.prototype.makeLinkedBaddies = function (baddies) {
    for(var i=0; i<baddies.length; i++){
        if(i > 0){
            baddies[i-1].linkChild(baddies[i]);
        }

        baddies[i].target = this.avatar;
        this.baddies.push(baddies[i]);
        this.main.state.scene.add(baddies[i].holder);
    }
};

GameObjectController.prototype.updateObjects = function (objects, dt) {
    for (var i = 0; i < objects.length; i++) {
        objects[i].update(dt);

        if (!objects[i].alive) {
            this.main.state.scene.remove(objects[i].holder);
            objects[i].dispose();
            objects.splice(i, 1);
        }
    }
};

GameObjectController.prototype.checkInput = function () {
    // check if keys are released.
    if (this.input.a == false) this.a = false;
    if (this.input.s == false) this.s = false;
    if (this.input.d == false) this.d = false;
    if (this.input.f == false) this.f = false;
    if (this.input.g == false) this.g = false;

    // only attack if key has been pressed this update.
    if(this.input.a == true && this.a == false ){
        this.a = true;
        this.attack(0);
    }
    if(this.input.s == true && this.s == false ){
        this.s = true;
        this.attack(1);
    }
    if(this.input.d == true && this.d == false ){
        this.d = true;
        this.attack(2);
    }
    if(this.input.f == true && this.f == false ){
        this.f = true;
        this.attack(3);
    }
    if(this.input.g == true && this.g == false ){
        this.g = true;
        this.attack(4);
    }
};

GameObjectController.prototype.attack = function (type) {

    if(this.nextChain != null){
        //already in a chain, attack next one.
        if( type == this.nextChain.type ){
            this.hitBaddie(this.nextChain);
            return;
        }else{
            // TODO: didn't hit anything.. penalize player.
        }
    }else{
        // not in a chain, check if any bullets are in range.
        for (var i = 0; i < this.baddies.length; i++) {
            if(this.baddies[i].type == type && this.baddies[i].alive && this.baddies[i].active){
                var d = new THREE.Vector3();
                d.subVectors(this.baddies[i].pos, this.avatar.pos);

                if(d.length() < this.avatar.range + this.baddies[i].size){
                   this.hitBaddie(this.baddies[i]);
                   return;
                }
            }
        }

        // TODO: didn't hit anything.. penalize player.
    }
};

GameObjectController.prototype.hitBaddie = function (baddie) {
    baddie.hit(1);
    this.spawnDieParticles(baddie);

    if(baddie.child != null){
        this.nextChain = baddie.child;
        this.chain.push(baddie);
    }else{
        this.nextChain = null;
        this.breakChain();
    }
    //TODO: add some score
};

GameObjectController.prototype.breakChain = function () {
    for( var i=0; i<this.chain.length; i++){
        this.spawnChainParticles(this.chain[i]);
        this.chain[i].alive = false;
    }
    this.chain = [];
};

GameObjectController.prototype.moveCamera = function (pos, target, time) {
    //this.camera.position = pos;
    //this.cameraTarget = target;
    //this.camera.lookAt(this.cameraTarget);

    new TWEEN.Tween(this.camera.position).to({x: pos.x, y: pos.y, z:pos.z}, time*1000).start();

    new TWEEN.Tween(this.cameraTarget).to({x: target.x, y: target.y, z:target.z}, time*1000).start();
};

GameObjectController.prototype.defaultCamera = function (time) {
    //this.camera.position.x = 0;
    //this.camera.position.y = -200;
    //this.camera.position.z = 200;
    //this.cameraTarget = new THREE.Vector3();
    //this.camera.lookAt(this.cameraTarget);

    new TWEEN.Tween(this.camera.position).to({x: 0, y: -200, z:200}, time*1000).start();

    new TWEEN.Tween(this.cameraTarget).to({x: 0, y:0, z:0}, time*1000).start();
};
