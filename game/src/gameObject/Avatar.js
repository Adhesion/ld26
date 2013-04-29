function Avatar() {
    GameObject.call(this, this.buildMesh(), 0xffffff, 0xffffff);

    this.maxSpeed = 2;
    this.inputScale = 1;
    this.pos.y = -70;
    this.startHP = 5;
    this.hp = this.startHP;

    this.range = 100;

    this.rangeMat = new THREE.LineBasicMaterial({ color: 0xffffff });
    var rangeGeom = new THREE.Geometry();
    var a = 0;
    var links = 10;

    for( var i=0; i<links+1; i++){
        a = Math.PI * 2 * (i/links);
        rangeGeom.vertices.push(new THREE.Vector3(Math.cos(a) * this.range, Math.sin(a) * this.range, 0));
    }

    this.rangeMesh = new THREE.Line(rangeGeom, this.rangeMat, THREE.LineStrip);
    this.holder.add(this.rangeMesh);
}

Avatar.prototype = new GameObject();
Avatar.prototype.constructor = Avatar;

Avatar.prototype.update = function (dt) {
    GameObject.prototype.update.call(this, dt);
};

Avatar.prototype.fire = function () {
    var jitter = 2;
    this.pos.x += Math.random() * jitter - jitter * 0.5;
    this.pos.y += Math.random() * jitter - jitter * 0.5;
};

Avatar.prototype.move = function (v) {
    //this.vel.addSelf(v);
    this.vel.x += v.x * this.inputScale;
    this.vel.y += v.y * this.inputScale;
    if (this.vel.length > this.maxSpeed) {
        this.vel.normalize();
        this.vel.multiplyScalar(this.maxSpeed);
    }
};

Avatar.prototype.buildMesh = function () {
    var geometry = new THREE.Geometry();

    var w = 5;
    var h = 10;
    var d = 3;

    // right side
    geometry.vertices.push(new THREE.Vector3(w, -h * 0.25, -d));
    geometry.vertices.push(new THREE.Vector3(0, h, 0));
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    // left side
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, h, 0));
    geometry.vertices.push(new THREE.Vector3(-w, -h * 0.25, -d));


    geometry.faces.push(new THREE.Face3(0, 1, 2, new THREE.Vector3( 0, 0, 1 )), new THREE.Face3(3, 4, 5, new THREE.Vector3( 0, 0, 1 )));

    geometry.computeBoundingSphere();


    return geometry;
};
