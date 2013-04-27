function Baddie(pos, target) {

    this.target = target;
    this.type = Math.round(Math.random() * 1);

    this.size = 10 + Math.random() * 5;
    this.score = Math.round(this.size);

    this.child = null;
    this.active = true;
    this.slowed = false;

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

    this.linkMat = new THREE.LineBasicMaterial({ color: 0xffffff });
    var linkGeom = new THREE.Geometry();
    linkGeom.vertices.push(new THREE.Vector3(0, 0, 0));
    linkGeom.vertices.push(new THREE.Vector3(0, 0, 0));
    this.link = new THREE.Line(linkGeom, this.linkMat, THREE.LineStrip);

    this.pos = pos;
    this.hp = 1;
    this.fire = false;
    this.speed = 150;
    this.update();
}

Baddie.prototype = new GameObject();
Baddie.prototype.constructor = Baddie;

Baddie.prototype.linkChild = function (baddie) {
    this.child = baddie;
    this.child.disable();
    this.holder.add(this.link);
};

Baddie.prototype.disable = function () {
    this.active = false;
    this.solid.scale = new THREE.Vector3(0.25, 0.25, 0.25);
};

Baddie.prototype.enable = function () {
    this.active = true;
    this.solid.scale = new THREE.Vector3(1.0, 1.0, 1.0);
};

Baddie.prototype.update = function (dt) {
    this.seekTarget();

    if(this.slowed){
        this.timeMult = 0.5;
    }else{
        this.timeMult = 1.0;
    }

    GameObject.prototype.update.call(this, dt);

    if (this.pos.y < -200) this.alive = false;
    this.rotation.x += 0.025;
    this.rotation.y += 0.025;

    if(this.child != null){

        this.holder.remove(this.link);

        if(this.child.alive){
            var dv = new THREE.Vector3();
            dv.sub(this.child.pos, this.pos);


            var linkGeom = new THREE.Geometry();
            linkGeom.vertices.push(new THREE.Vector3(0, 0, 0));
            linkGeom.vertices.push(dv);
            this.link = new THREE.Line(linkGeom, this.linkMat, THREE.LineStrip);
            this.holder.add(this.link);
        }else{
            this.child = null;
        }
    }
};

Baddie.prototype.hit = function (damage) {
    if (this.hp -damage <= 0){
        if(this.child != null && !this.child.active){
            this.disable();
            this.child.enable();
            this.solidMat.opacity = 0;
            return;
        }
    }

    GameObject.prototype.hit.call(this, damage);
};

Baddie.prototype.seekTarget = function () {
   var dv = new THREE.Vector3();
   dv.sub(this.target.pos, this.pos);
   dv.setLength(this.speed);

   this.vel = dv;
};

