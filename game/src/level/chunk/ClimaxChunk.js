/**
 * Created with JetBrains WebStorm.
 * User: Roushey
 * Date: 4/27/13
 * Time: 7:50 PM
 */

function ClimaxChunk(level){
    Chunk.call(this, level);
}

ClimaxChunk.prototype = new Chunk();
ClimaxChunk.prototype.constructor = IntroChunk;

ClimaxChunk.prototype.build = function() {
    this.items = [
        // camera Vector3 pos, Vector3 target default is (0,-200, 200) --> (0,0,0)
        {time:2.0, action:function(game){ game.moveCamera(new THREE.Vector3(0,-200, 170), new THREE.Vector3(0,0,0), 1.0) } },

        // pass game object controller, game.
        // basic baddies: pos, size, note(0-14)	
		
        // reset camera to default position. (time)
        {time:48.0, action:function(game){ game.defaultCamera(1.5)} },

        // this is an easy way to add 'padding' to the end of a chunk
        {time:50.0, action:function(game){ }}
    ];
};

//7 10 5
//11 12 10
//2 6 5

