function BackgroundController(scene) {
    this.ground = new GroundPlane();

    this.stars = [];

    for( var i=0; i<100; i++){
        var star = new Star();

        this.stars.push(star);
        scene.add(star.holder);
    }
}

BackgroundController.prototype.update = function () {
    var dt = 1/60;

    for( var i=0; i<this.stars.length; i++){
        this.stars[i].update(dt);
    }
};
