function Input() {
    this.up = this.left = this.down = this.right = this.space = this.a = this.s = false;
    this.move = new THREE.Vector3(0, 0, 0);

    // :( javascript is so gross.
    var self = this;
    document.onkeydown = function (event) {
        self.keyDown(event);
    };
    document.onkeyup = function (event) {
        self.keyUp(event);
    };
}

Input.prototype.keyDown = function (event) {
    this.checkKeys(event.keyCode, true);
    this.calculateMove();
};

Input.prototype.keyUp = function (event) {
    this.checkKeys(event.keyCode, false);
    this.calculateMove();
};

Input.prototype.calculateMove = function () {
    if (this.left && !this.right) this.move.x = -1;
    else if (this.right && !this.left) this.move.x = 1;
    else this.move.x = 0;

    if (this.down && !this.up) this.move.y = -1;
    else if (this.up && !this.down) this.move.y = 1;
    else this.move.y = 0;

    this.move.normalize();
};

Input.prototype.checkKeys = function (keycode, val) {
    console.log(keycode);

    if (keycode == 32) this.space = val;
    if (keycode == 37) this.left = val;
    if (keycode == 39) this.right = val;
    if (keycode == 38) this.up = val;
    if (keycode == 40) this.down = val;
    if (keycode == 65) this.a = val;
    if (keycode == 83) this.s = val;
};