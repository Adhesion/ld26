function Main() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.y = -200;
    this.camera.position.z = 200;
    this.camera.lookAt(new THREE.Vector3());
    this.scene.add(this.camera);
    this.renderer = new THREE.WebGLRenderer({antialias:true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.container = document.createElement('div');
    this.container.setAttribute('class', 'game');
    this.container.appendChild(this.renderer.domElement);
    document.body.appendChild(this.container);

    this.bgController = new BackgroundController(this);
    this.goController = new GameObjectController(this);
    this.uiController = new UIController(this);

    this.resize();
    this.render();

        var self = this;
        setInterval(function () {
            self.update();
    }, 1000 / 60);
    window.onresize = function () {
        self.resize();
    };

}

Main.prototype.resize = function (event) {
    var width = window.innerWidth;
    var height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.render();
};

Main.prototype.update = function () {
    //update everything then render.
    this.bgController.update();
    this.goController.update();
    this.uiController.update();
    this.render();
};

Main.prototype.render = function () {
    this.renderer.render(this.scene, this.camera);
};

Main.prototype.add = function (obj) {
    this.scene.add(obj.holder);
};

Main.prototype.remove = function (obj) {
    this.scene.remove(obj.holder);
};