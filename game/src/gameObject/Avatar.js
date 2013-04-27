function Avatar() {
    GameObject.call(this, this.buildMesh(), 0xffffff, 0xffff00);

    this.maxSpeed = 2;
    this.inputScale = 1;
}

Avatar.prototype = new GameObject();
Avatar.prototype.constructor = Avatar;

Avatar.prototype.update = function () {
    GameObject.prototype.update.call(this);
    this.vel.x *= 0.75;
    this.vel.y *= 0.75;
    if (this.vel.length < 0.01) {
        this.vel = new THREE.Vector3();
    }

    this.rotation.y = this.vel.x / 10;
    this.rotation.z = -this.vel.x / 20;
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
    var d = 2;

    // right side
    geometry.vertices.push(new THREE.Vector3(w, -h * 0.25, -d));
    geometry.vertices.push(new THREE.Vector3(0, h, 0));
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    // left side
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, h, 0));
    geometry.vertices.push(new THREE.Vector3(-w, -h * 0.25, -d));

    geometry.faces.push(new THREE.Face3(0, 1, 2), new THREE.Face3(3, 4, 5));

    geometry.computeBoundingSphere();

    return geometry;
};