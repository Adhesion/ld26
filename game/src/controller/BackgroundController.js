function BackgroundController(main) {
    this.main = main;
    this.ground = new GroundPlane();

    this.main.scene.add(this.ground.wire);
}

BackgroundController.prototype.update = function () {
    this.ground.update();
};
