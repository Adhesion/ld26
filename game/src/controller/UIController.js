function UIController(main) {
    this.main = main;

    this.displayScore = 0;
    this.score = 0;

    this.scoreTxt = document.createTextNode("0");

    this.scoreDiv = document.createElement('div');
    this.scoreDiv.setAttribute('class', 'score');
    this.scoreDiv.appendChild(this.scoreTxt);

    this.infoDiv = document.createElement('div');
    this.infoDiv.setAttribute('class', 'info');

    this.infoDiv.appendChild(document.createTextNode( "them notes: a, s, d, f, g" ));

    document.body.appendChild(this.scoreDiv);
    document.body.appendChild(this.infoDiv);
}

UIController.prototype.addScore = function (val) {
    this.score += val;
};

UIController.prototype.update = function () {
    if (this.displayScore < this.score) {
        this.displayScore += (this.score - this.displayScore) * 0.05;
        if (this.score - this.displayScore <= 1) {
            this.displayScore = this.score;
        }
    }

    this.scoreTxt.nodeValue = "" + Math.round(this.displayScore);
};
 