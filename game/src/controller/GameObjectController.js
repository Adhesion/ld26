function GameObjectController(main) {
    this.main = main;
    this.input = new Input();

    this.camera = this.main.state.camera;
    this.camera.up = new THREE.Vector3( 0, 0, 1 );
    this.cameraTarget = new THREE.Vector3();
    this.level = new Level(this);

    this.camHolder = new THREE.Object3D();
    this.camHolder.add(this.camera);
    this.main.state.scene.add(this.camHolder);

    this.avatar = new Avatar();
    this.baddieSpawnRate = this.baddieSpawnCount = 1.0;

    this.particles = [];
    this.baddies = [];

    this.nextChain = null;
    this.chain = [];

    this.main.state.scene.add(this.avatar.holder);

    this.boss = new SauceBoss();

    // have any of these keys been pressed this update cycle?
    this.x = this.c = this.v = this.b = this.n = false;

    this.sway = 0;
    this.shake = 0;
    //Howler.mute();
}

GameObjectController.prototype.update = function () {
    TWEEN.update();

    this.checkInput();
    var dt = 1/60;

    this.level.update(dt);

    this.updateObjects(this.baddies, dt);
    this.updateObjects(this.particles, dt);
    this.avatar.update(dt);
    this.boss.update(dt);

    this.ambientCameraMovement(dt);
    //this.spawnBaddie(dt);
    this.checkHits();
};


GameObjectController.prototype.ambientCameraMovement = function (dt) {
    this.sway += dt * 0.5;
    if( this.sway > Math.PI * 2) this.sway -= Math.PI*2;
    var x = Math.cos(this.sway) * 10;
    var z = Math.sin(this.sway) * 10;

    if(this.shake > 0){
        x += Math.random() * this.shake * 4 - this.shake * 2;
        z += Math.random() * this.shake * 4 - this.shake * 2;
    }
    this.camHolder.position.x = x;
    this.camHolder.position.z = z;
    this.camera.lookAt(this.cameraTarget);
    this.shake -=dt;
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

            //this is kinda hacks, need to disconnect it from its child when it dies.
            if(this.nextChain == this.baddies[i]){
                this.breakChain();
                this.nextChain = null;
            }
            if(this.baddies[i].child != null ) this.baddies[i].child = null;

            this.baddies[i].hit(1);

            //TODO: avatar take a hit.

            this.shake = 0.5;
            this.main.loader.get( "sound/playerhit" + this.baddies[i].type).play();

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

    this.shake += 0.1;

    for (i = 0; i < 10; i++) {
        particle = new Particle(baddie.pos.clone(), baddie.color, baddie.wireColor, baddie.size, 1.0, 200);
        this.particles.push(particle);
        this.main.state.scene.add(particle.holder);
    }
};

GameObjectController.prototype.spawnBossHitParticles = function () {
    var i;
    var particle;

    this.shake = 2.0;

    for (i = 0; i < 50; i++) {
        particle = new Particle(this.boss.pos.clone(), this.boss.color, this.boss.wireColor, this.boss.size, 3.0, 1000);
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


GameObjectController.prototype.makeBossLinkedBaddies = function (baddies) {
    this.makeLinkedBaddies(baddies);
    baddies[baddies.length-1].linkChild(this.boss);
}


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
    if (this.input.x == false) this.x = false;
    if (this.input.c == false) this.c = false;
    if (this.input.v == false) this.v = false;
    if (this.input.b == false) this.b = false;
    if (this.input.n == false) this.n = false;

    // only attack if key has been pressed this update.
    if(this.input.x == true && this.x == false ){
        this.x = true;
        this.attack(0);
    }
    if(this.input.c == true && this.c == false ){
        this.c = true;
        this.attack(1);
    }
    if(this.input.v == true && this.v == false ){
        this.v = true;
        this.attack(2);
    }
    if(this.input.b == true && this.b == false ){
        this.b = true;
        this.attack(3);
    }
    if(this.input.n == true && this.n == false ){
        this.n = true;
        this.attack(4);
    }
};

GameObjectController.prototype.attack = function (type) {
    if(this.nextChain != null){
        //already in a chain, attack next one.
        if( type == this.nextChain.type ){
            this.hitBaddie(this.nextChain, true);
            return;
        }else{
            this.breakChain();
            // TODO: didn't hit anything.. penalize player.
            this.main.loader.get( "sound/miss").play();
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
        this.main.loader.get( "sound/miss").play();
    }
};

GameObjectController.prototype.hitBaddie = function (baddie, chain) {
    baddie.hit(1, chain);
    this.spawnDieParticles(baddie);

    // enemy in chain, has child
    if(baddie.child != null) {
        // ... but we have to preemptively break chain if it's the boss
        if(baddie.child == this.boss){
            baddie.child = null;
            this.nextChain = null;
            this.chain.push(baddie);
            this.breakChain();
            //TODO: attack boss, spawn particles n shit.

            this.spawnBossHitParticles();
            this.main.loader.get( "sound/hit" + baddie.note ).play();
            // TODO boss hit sound?
            // probably should just call boss.hit()?
            console.log("boss has been hit");
            this.main.loader.get( "sound/bosshit" ).play(); // temp
        }
        // regular enemy in chain
        else {
            this.nextChain = baddie.child;
            this.chain.push(baddie);
            this.main.loader.get( "sound/hit" + baddie.note ).play();
        }
    // last enemy in the chain
    } else if (chain) {
        this.nextChain = null;
        this.chain.push(baddie);
        this.breakChain();
        this.main.loader.get( "sound/hit" + baddie.note ).play();
    }
    // single enemy, no chain
    else {
        this.main.loader.get( "sound/hit" + baddie.note ).play();
    }

    //TODO: add some score
};

GameObjectController.prototype.breakChain = function () {
    for( var i=0; i<this.chain.length; i++){
        this.chain[i].deathTimer = 18 + i*8;
    }
    this.chain = [];
};

GameObjectController.prototype.moveCamera = function (pos, target, time) {
    new TWEEN.Tween(this.camera.position).to({x: pos.x, y: pos.y, z:pos.z}, time*1000).start();
    new TWEEN.Tween(this.cameraTarget).to({x: target.x, y: target.y, z:target.z}, time*1000).start();
};

GameObjectController.prototype.defaultCamera = function (time) {
    new TWEEN.Tween(this.camera.position).to({x: 0, y: -200, z:200}, time*1000).start();
    new TWEEN.Tween(this.cameraTarget).to({x: 0, y:0, z:0}, time*1000).start();
};

GameObjectController.prototype.bossAppear = function (pos) {
    this.boss.appear(pos);
    this.main.state.scene.add(this.boss.holder);
};

GameObjectController.prototype.bossMove = function (pos) {
    this.boss.move(pos);
};

GameObjectController.prototype.bossHide = function () {
    //TODO: spawn some particles n shit because that mofo' 'spacejumped'
    this.main.state.scene.remove(this.boss.holder);
};
