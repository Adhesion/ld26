function GameObjectController(main) {
    this.main = main;
    this.input = new Input();

    this.avatar = new Avatar();
    this.baddieSpawnRate = this.baddieSpawnCount = 50;

    this.particles = [];
    this.baddies = [];

    this.main.add(this.avatar);

    // have any of these keys been pressed this update cycle?
    this.a = this.s = this.d = this.f = this.g = false;
}

GameObjectController.prototype.update = function () {
    this.checkInput();
    this.updateObjects(this.baddies);
    this.updateObjects(this.particles);
    this.avatar.update();

    this.spawnBaddie();
    this.checkHits();
};


GameObjectController.prototype.checkHits = function () {
    var d = new THREE.Vector3();

    for (var i = 0; i < this.baddies.length; i++) {
        d.sub(this.baddies[i].pos, this.avatar.pos);
        if(d.length() <= this.baddies[i].size ){
            this.spawnDieParticles(this.baddies[i]);
            this.baddies[i].alive = false;

            //avatar take a hit.
        }
    }
};


GameObjectController.prototype.attack = function (type) {
    var minY = 10000;
    var attackIndex = -1;

    for (var i = 0; i < this.baddies.length; i++) {
        if(this.baddies[i].type == type && this.baddies[i].pos.y < minY && this.baddies[i].alive){
            minY = this.baddies[i].pos.y;
            this.spawnDieParticles(this.baddies[i]);
            this.baddies[i].alive = false;
            return;
        }
    }
};

GameObjectController.prototype.addScore = function (val) {
    this.main.uiController.addScore(val);
};

GameObjectController.prototype.spawnHitParticle = function (bullet) {
    var particle = new Particle(bullet.pos.clone(), bullet.color, bullet.wireColor, bullet.size, 30, 4);
    this.particles.push(particle);
    this.main.add(particle);
};

GameObjectController.prototype.spawnDieParticles = function (baddie) {
    var i;
    var particle;

    for (i = 0; i < 10; i++) {
        particle = new Particle(baddie.pos.clone(), baddie.color, baddie.wireColor, baddie.size, 60, 4);
        this.particles.push(particle);
        this.main.add(particle);
    }
};

GameObjectController.prototype.spawnBaddie = function () {
    this.baddieSpawnCount++;
    if (this.baddieSpawnCount >= this.baddieSpawnRate) {
        this.baddieSpawnCount = 0;

        var baddie = new Baddie(this.avatar);

        this.baddies.push(baddie);
        this.main.add(baddie);
    }
};

GameObjectController.prototype.updateObjects = function (objects) {
    for (var i = 0; i < objects.length; i++) {
        objects[i].update();
        if (!objects[i].alive) {
            this.main.remove(objects[i]);
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

