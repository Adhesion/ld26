function BackgroundController(main) {
    this.main = main;
    this.ground = new GroundPlane();

    this.stars = [];

    for( var i=0; i<100; i++){
        var star = new Star();

        this.stars.push(star);
        this.main.add(star);
    }

    //this.main.scene.add(this.ground.wire);
}

BackgroundController.prototype.update = function () {
    //this.ground.update();


    for( var i=0; i<this.stars.length; i++){
        this.stars[i].update();
    }
};
