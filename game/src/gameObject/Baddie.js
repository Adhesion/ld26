function Baddie() {
    this.size = 10 + Math.random() * 10;
    this.score = Math.round(this.size);
    GameObject.call(this, new THREE.CubeGeometry(this.size, this.size, this.size), 0x640090);

    this.pos.x = Math.random() * 600 - 300;
    this.pos.y = 1000;
    this.vel.x = Math.random() - 0.5;
    this.vel.y = -2 - 2 * ((40 - this.size) / 40);
    this.hp = this.size / 2;
    this.fire = false;
    this.update();


}

Baddie.prototype = new GameObject();
Baddie.prototype.constructor = Baddie;

Baddie.prototype.update = function () {
    GameObject.prototype.update.call(this);
    if (this.pos.y < -200) this.alive = false;
    this.rotation.x += 0.025;
    this.rotation.y += 0.025;
};

Baddie.prototype.hit = function (damage) {
    GameObject.prototype.hit.call(this, damage);
    this.vel.y *= 0.9;
};
