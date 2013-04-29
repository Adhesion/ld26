/**
 * Created with JetBrains WebStorm.
 * User: Roushey
 * Date: 4/27/13
 * Time: 7:50 PM
 */

function DenseChunk(level){
    Chunk.call(this, level);
}

DenseChunk.prototype = new Chunk();
DenseChunk.prototype.constructor = IntroChunk;

DenseChunk.prototype.build = function() {
    this.items = [
        // camera Vector3 pos, Vector3 target default is (0,-200, 200) --> (0,0,0)
        {time:2.0, action:function(game){ game.moveCamera(new THREE.Vector3(0,-200, 170), new THREE.Vector3(0,0,0), 1.0) } },

		{time:2.75, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 0) ) } },
        {time:3.5, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 5) ) } },
        {time:4.25, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 1) ) } },
        {time:5.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 6) ) } },
        {time:5.75, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 2) ) } },
        {time:6.5, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 7) ) } },
        {time:7.25, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 3) ) } },
        {time:8, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 8) ) } },


		{time:10, action:function(game){ game.makeLinkedBaddies( [
            new Baddie(new THREE.Vector3(-10,800,0), 5, 2),
            new Baddie(new THREE.Vector3(10,850,0), 5, 5),
            new Baddie(new THREE.Vector3(-10,900,0), 5, 8) ])}},
            
        {time:12, action:function(game){ game.makeLinkedBaddies( [
            new Baddie(new THREE.Vector3(-10,800,0), 5, 11),
            new Baddie(new THREE.Vector3(10,850,0), 5, 10),
            new Baddie(new THREE.Vector3(-10,900,0), 5, 7) ])}},
            
        {time:14, action:function(game){ game.makeLinkedBaddies( [
            new Baddie(new THREE.Vector3(-10,800,0), 5, 0),
            new Baddie(new THREE.Vector3(10,850,0), 5, 3),
            new Baddie(new THREE.Vector3(-10,900,0), 5, 2) ])}},

        // pass game object controller, game.
        // basic baddies: pos, size, note(0-14)	
		
        // reset camera to default position. (time)
        {time:16.0, action:function(game){ game.defaultCamera(1.5)} },

        // this is an easy way to add 'padding' to the end of a chunk
        {time:18.0, action:function(game){ }}
    ];
};

//7 10 5
//11 12 10
//2 6 5

