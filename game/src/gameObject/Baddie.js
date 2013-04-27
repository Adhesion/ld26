function Baddie(target) {

    this.target = target;
    this.type = Math.round(Math.random() * 2);

    this.size = 10 + Math.random() * 20;
    this.score = Math.round(this.size);

    var color;
    switch(this.type){
        case 0:
            color = 0xff0000;
            break;
        case 1:
            color = 0x00ff00;
            break;
        case 2:
            color = 0x0000ff;
            break;
        case 3:
            color = 0xffff00;
            break;
        case 4:
            color = 0xff00ff;
            break;
    }

    GameObject.call(this, new THREE.CubeGeometry(this.size, this.size, this.size), color);



    this.pos.x = Math.random() * 400 - 200;
    this.pos.y = 800;
    this.hp = 1;
    this.fire = false;
    this.speed = 4;
    this.update();
}

Baddie.prototype = new GameObject();
Baddie.prototype.constructor = Baddie;

Baddie.prototype.update = function () {
    this.seekTarget();
    GameObject.prototype.update.call(this);
    if (this.pos.y < -200) this.alive = false;
    this.rotation.x += 0.025;
    this.rotation.y += 0.025;
};

Baddie.prototype.seekTarget = function () {
   var dv = new THREE.Vector3();
   dv.sub(this.target.pos, this.pos);
   dv.setLength(this.speed);

   this.vel = dv;
};

Baddie.prototype.hit = function (damage) {
    GameObject.prototype.hit.call(this, damage);
};
