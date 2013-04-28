function SauceBoss() {
    //
    this.target = new THREE.Vector3();
    this.size = 100;
    //GameObject.call(this, new THREE.OctahedronGeometry(this.size, 2), 0xff0000);
    GameObject.call(this, geom = window.main.loader.get("assets/models/pyramid.js"), 0xff0000);
    this.holder.scale = new THREE.Vector3( 15.0, 15.0, 15.0 );

    this.linkMat = new THREE.LineBasicMaterial({ color: 0xffffff });
    var linkGeom = new THREE.Geometry();
    linkGeom.vertices.push(new THREE.Vector3(0, 0, 0));
    linkGeom.vertices.push(new THREE.Vector3(0, 0, 0));
    this.link = new THREE.Line(linkGeom, this.linkMat, THREE.LineStrip);

    this.pos = new THREE.Vector3();
    this.hp = 10;
    this.speed = 150;

    this.update(0);
}

SauceBoss.prototype = new GameObject();
SauceBoss.prototype.constructor = Baddie;

SauceBoss.prototype.appear = function (pos) {
    this.pos = pos;
    this.target = pos.clone();
    this.update(0);
};

SauceBoss.prototype.move = function (pos) {
    this.target = pos;
};

SauceBoss.prototype.disable = function () {
    // kinda shit
    // going to be called by
    // linked bullet when it 'links' to the boss.
};

SauceBoss.prototype.enable = function () {

};

SauceBoss.prototype.update = function (dt) {
    this.seekTarget(dt);

    this.solid.rotation.x += 0.025;
    this.solid.rotation.y += 0.025;
    this.wire.rotation.x -= 0.025;
    this.wire.rotation.y -= 0.025;

    GameObject.prototype.update.call(this, dt);
};

SauceBoss.prototype.hit = function (damage) {
    window.hitSounds[this.note].play();

    //something?

    // buh? this might never get called
    GameObject.prototype.hit.call(this, damage);
};

SauceBoss.prototype.seekTarget = function (dt) {
    if(this.target == null )return;

    var dv = new THREE.Vector3();
    dv.subVectors(this.target, this.pos);

    var l = this.speed;

    if( dv.length() < this.speed * dt){
        this.pos = this.target.clone();
        this.vel.setLength(0);
    }else{
        dv.setLength(this.speed);
        this.vel = dv;
    }

};

