function GameObjectController(main) {
    this.main = main;
    this.input = new Input();

    this.avatar = new Avatar();
    this.avatar.pos.y = -100;

    this.weapon = "gatling"; // "gatling", or "laser"
    this.bulletDamage = 1; //damage per bullet
    this.lazerDamage = 0.05; //damage per frame
    this.collisionDamage = 1;
    this.gatlingFireDelay = this.gatlingFireCount = 3;
    this.baddieSpawnRate = this.baddieSpawnCount = 5;

    this.boundsX = 225;
    this.boundsY = 125;

    this.particles = [];
    this.bullets = [];
    this.baddieBullets = [];
    this.baddies = [];
    this.laser = new Laser();

    this.main.add(this.avatar);
    this.main.add(this.laser);
}


GameObjectController.prototype.update = function () {
    this.avatar.update();
    this.avatar.move(this.input.move);

    this.updateObjects(this.bullets);
    this.updateObjects(this.baddieBullets);
    this.updateObjects(this.baddies);
    this.updateObjects(this.particles);
    this.checkHits();
    this.checkBaddieFire();
    this.checkBounds();

    this.laser.setPos(this.avatar.pos);
    this.laser.update();

    if (this.input.a) this.weapon = "laser";
    if (this.input.s) this.weapon = "gatling";
    if (this.input.space) this.fire();
    this.spawnBaddie();
};

GameObjectController.prototype.checkBounds = function () {
    for (var i = 0; i < this.baddies.length; i++) {
        this.checkObjectBounds(this.baddies[i], false);
    }
    this.checkObjectBounds(this.avatar, true);
};

GameObjectController.prototype.checkObjectBounds = function (object, checkY) {
    if (object.pos.x > this.boundsX) object.pos.x = this.boundsX;
    else if (object.pos.x < -this.boundsX) object.pos.x = -this.boundsX;

    if (checkY) {
        if (object.pos.y > this.boundsY) object.pos.y = this.boundsY;
        else if (object.pos.y < -this.boundsY) object.pos.y = -this.boundsY;
    }
};

GameObjectController.prototype.checkHits = function () {
    var i, j;
    var lasered = [];
    for (i = 0; i < this.baddies.length; i++) {
        //avatar vs baddies RAMMING SPEED!
        if (this.avatar.pos.distanceTo(this.baddies[i].pos) <= this.baddies[i].size * 2) {
            this.avatar.hit(this.collisionDamage);
            this.baddies[i].hit(this.collisionDamage);
            this.spawnHitParticle(this.avatar);
            if (this.avatar.pos.x > this.baddies[i].pos.x) {
                this.avatar.vel.x = 8;
                this.baddies[i].vel.x = -2;
            } else {
                this.avatar.vel.x = -8;
                this.baddies[i].vel.x = 2;
            }
        }

        //avatar bullets vs baddies
        for (j = 0; j < this.bullets.length; j++) {
            if (this.bullets[j].alive && this.baddies[i].alive && this.baddies[i].pos.distanceTo(this.bullets[j].pos) <= this.baddies[i].size * 2) {
                this.baddies[i].hit(this.bulletDamage);
                this.bullets[j].alive = false;

                this.spawnHitParticle(this.bullets[j]);
                if (!this.baddies[i].alive) {
                    this.addScore(this.baddies[i].score);
                    this.spawnGatlingDieParticles(this.baddies[i], this.bullets[j]);
                }
            }
        }

        //laser vs baddies
        if (this.laser.fire) {
            for (j = 0; j < this.laser.points.length; j++) {
                if (this.baddies[i].alive && lasered.indexOf(this.baddies[i]) == -1 && this.baddies[i].pos.distanceTo(this.laser.points[j]) <= this.baddies[i].size * 2) {
                    this.baddies[i].hit(this.bulletDamage);
                    lasered.push(this.baddies[i]);
                    if (!this.baddies[i].alive) {
                        this.addScore(this.baddies[i].score);
                        this.spawnLaserDieParticles(this.baddies[i], this.laser.points[j]);
                    }
                }
            }
        }
    }

    //baddie bullets vs avatar
    for (i = 0; i < this.baddieBullets.length; i++) {
        if (this.avatar.pos.distanceTo(this.baddieBullets[i].pos) <= this.baddieBullets[i].size) {
            this.avatar.hit(1);
            this.baddieBullets[i].alive = false;

            this.spawnHitParticle(this.baddieBullets[i]);
        }
    }
};

GameObjectController.prototype.addScore = function (val) {
    this.main.state.uiController.addScore(val);
};

GameObjectController.prototype.checkBaddieFire = function () {
    for (var i = 0; i < this.baddies.length; i++) {
        if (this.baddies[i].fire) {
            var bullet = new BaddieBullet(this.baddies[i].pos.clone());
            this.baddieBullets.push(bullet);
            this.main.add(bullet);
        }
    }
};

GameObjectController.prototype.spawnHitParticle = function (bullet) {
    var particle = new Particle(bullet.pos.clone(), bullet.color, bullet.wireColor, bullet.size, 30, 4);
    this.particles.push(particle);
    this.main.add(particle);
};

GameObjectController.prototype.spawnGatlingDieParticles = function (baddie, bullet) {
    var i;
    var particle;

    for (i = 0; i < 5; i++) {
        particle = new Particle(baddie.pos.clone(), baddie.color, baddie.wireColor, baddie.size, 60, 4);
        this.particles.push(particle);
        this.main.add(particle);
    }

    for (i = 0; i < 10; i++) {
        particle = new Particle(baddie.pos.clone(), bullet.color, bullet.wireColor, baddie.size * 0.5, 30, 10);
        this.particles.push(particle);
        this.main.add(particle);
    }
};

GameObjectController.prototype.spawnLaserDieParticles = function (baddie, pos) {
    var i;
    var particle;

    for (i = 0; i < 5; i++) {
        particle = new Particle(baddie.pos.clone(), baddie.color, baddie.wireColor, baddie.size, 60, 4);
        this.particles.push(particle);
        this.main.add(particle);
    }
};

GameObjectController.prototype.spawnBaddie = function () {
    this.baddieSpawnCount++;
    if (this.baddieSpawnCount >= this.baddieSpawnRate) {
        this.baddieSpawnCount = 0;
        var baddie;
        if (Math.random() > 0.1) {
            baddie = new Baddie();
        } else {
            baddie = new AttackBaddie();
        }

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

GameObjectController.prototype.fire = function () {
    if (this.weapon == "gatling") this.fireGatling();
    else if (this.weapon == "laser") this.fireLaser();
};

GameObjectController.prototype.fireGatling = function () {
    this.gatlingFireCount++;
    if (this.gatlingFireCount >= this.gatlingFireDelay) {
        this.gatlingFireCount = 0;

        var bullet = new Bullet(this.avatar.pos.clone());
        this.bullets.push(bullet);
        this.main.add(bullet);

        var particle = new Particle(this.avatar.pos.clone(), bullet.color, bullet.wireColor, 3, 20, 1);
        this.particles.push(particle);
        this.main.add(particle);

        this.avatar.fire();
    }
};

GameObjectController.prototype.fireLaser = function () {
    this.laser.fire = true;
};
