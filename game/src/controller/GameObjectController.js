function GameObjectController(main) {
    this.main = main;
    this.input = new Input();

    this.camera = this.main.camera;
    this.camera.up = new THREE.Vector3( 0, 0, 1 );
    this.cameraTarget = new THREE.Vector3();
    this.level = new Level(this);

    this.avatar = new Avatar();
    this.baddieSpawnRate = this.baddieSpawnCount = 1.0;

    this.particles = [];
    this.baddies = [];

    this.nextChain = null;
    this.chain = [];

    this.main.add(this.avatar);

    this.boss = new SauceBoss();

    // have any of these keys been pressed this update cycle?
    this.z = this.x = this.c = this.v = this.b = false;

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

            //this is kinda hacks, need to disconnect it from th e boss when it dies...
            if(this.baddies[i].child == this.boss) this.baddies[i].child = null;
            this.baddies[i].hit(1);

            //TODO: avatar take a hit.
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
        this.main.add(particle);
    }
};

GameObjectController.prototype.spawnBossHitParticles = function () {
    var i;
    var particle;

    for (i = 0; i < 50; i++) {
        particle = new Particle(this.boss.pos.clone(), this.boss.color, this.boss.wireColor, this.boss.size, 3.0, 1000);
        this.particles.push(particle);
        this.main.add(particle);
    }
};


GameObjectController.prototype.spawnChainParticles = function (baddie) {
    var i;
    var particle;

    for (i = 0; i < 5; i++) {
        particle = new Particle(baddie.pos.clone(), 0x000000, 0x000000, baddie.size, 1.0, 200);
        this.particles.push(particle);
        this.main.add(particle);
    }
};

GameObjectController.prototype.makeBaddie = function (baddie) {
    baddie.target = this.avatar;
    this.baddies.push(baddie);
    this.main.add(baddie);
}

GameObjectController.prototype.makeLinkedBaddies = function (baddies) {
    for(var i=0; i<baddies.length; i++){
        if(i > 0){
            baddies[i-1].linkChild(baddies[i]);
        }

        baddies[i].target = this.avatar;
        this.baddies.push(baddies[i]);
        this.main.add(baddies[i]);
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
            this.main.remove(objects[i]);
            objects[i].dispose();
            objects.splice(i, 1);
        }
    }
};

GameObjectController.prototype.checkInput = function () {
    // check if keys are released.
    if (this.input.z == false) this.z = false;
    if (this.input.x == false) this.x = false;
    if (this.input.c == false) this.c = false;
    if (this.input.v == false) this.v = false;
    if (this.input.b == false) this.b = false;

    // only attack if key has been pressed this update.
    if(this.input.z == true && this.z == false ){
        this.z = true;
        this.attack(0);
    }
    if(this.input.x == true && this.x == false ){
        this.x = true;
        this.attack(1);
    }
    if(this.input.c == true && this.c == false ){
        this.c = true;
        this.attack(2);
    }
    if(this.input.v == true && this.v == false ){
        this.v = true;
        this.attack(3);
    }
    if(this.input.b == true && this.b == false ){
        this.b = true;
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
            window.hitSounds[baddie.note].play();
            // TODO boss hit sound?

            console.log("boss has been hit");
        }
        else {
            this.nextChain = baddie.child;
            this.chain.push(baddie);
            window.hitSounds[baddie.note].play();
        }
    // last enemy in the chain
    } else if (chain) {
        this.nextChain = null;
        this.chain.push(baddie);
        this.breakChain();
        window.hitSounds[baddie.note].play();
    }
    // single enemy, no chain
    else {
        window.hitSounds[baddie.note].play();
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
    this.main.add(this.boss);
};

GameObjectController.prototype.bossMove = function (pos) {
    this.boss.move(pos);
};

GameObjectController.prototype.bossHide = function () {
    //TODO: spawn some particles n shit because that mofo' 'spacejumped'
    this.main.remove(this.boss);
};
