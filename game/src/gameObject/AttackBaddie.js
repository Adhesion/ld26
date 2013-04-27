function AttackBaddie() {
    this.size = 20;
    GameObject.call(this, new THREE.OctahedronGeometry(this.size, 1), 0xff05ae);

    this.type = 1;
    this.pos.x = Math.random() * 600 - 300;
    this.pos.y = 1000;
    this.vel.x = Math.random() - 0.5;
    this.vel.y = -2 - 2 * ((40 - this.size) / 40);
    this.hp = 10;
    this.fireRate = 20;
    this.fireDuration = this.fireDurationMax = this.fireRate * 3;
    this.gatlingFireCount = this.fireCountMax = 60;
    this.update();


    this.score = 100;
}

AttackBaddie.prototype = new GameObject();
AttackBaddie.prototype.constructor = AttackBaddie;

AttackBaddie.prototype.update = function (dt) {
    GameObject.prototype.update.call(this, dt);
    if (this.pos.y < -200) this.alive = false;
    this.rotation.x -= 0.025;
    this.rotation.y -= 0.025;
    this.manageFire();
};

AttackBaddie.prototype.manageFire = function () {
    this.gatlingFireCount--;
    if (this.gatlingFireCount <= 0) {
        this.fire = this.fireDuration % this.fireRate == 0;

        this.fireDuration--;

        if (this.fireDuration <= 0) {
            this.fire = false;
            this.fireDuration = this.fireDurationMax;
            this.gatlingFireCount = this.fireCountMax;
        }

    }
};

AttackBaddie.prototype.hit = function (damage) {
    GameObject.prototype.hit.call(this, damage);
    this.vel.y *= 0.9;
};
