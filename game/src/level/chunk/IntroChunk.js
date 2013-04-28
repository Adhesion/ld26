/**
 * Created with JetBrains WebStorm.
 * User: Roushey
 * Date: 4/27/13
 * Time: 7:50 PM
 */

function IntroChunk(level){
    Chunk.call(this, level);
}

IntroChunk.prototype = new Chunk();
IntroChunk.prototype.constructor = IntroChunk;

IntroChunk.prototype.build = function() {
    this.items = [
        // pass game object controller, game.
        // basic baddies: pos, size, type(0-4), shape(0-2) (octave)
        {time:0.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 10, 0, 0) ) } },
        {time:1.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 10, 0, 0) ) } },
        {time:2.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 10, 0, 0) ) } },
        {time:3.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 10, 0, 0) ) } },
        {time:4.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 10, 0, 0) ) } },
        {time:5.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 10, 0, 0) ) } },

        //linked baddies
        {time:6.0, action:function(game){ game.makeLinkedBaddies( [
            new Baddie(new THREE.Vector3(0,800,0), 10, 0, 0),
            new Baddie(new THREE.Vector3(100,800,0), 10, 0, 0),
            new Baddie(new THREE.Vector3(200,800,0), 10, 0, 0),
            new Baddie(new THREE.Vector3(300,800,0), 10, 0, 0) ])}},

        // camera Vector3 pos, Vector3 target default is (0,-200, 200) --> (0,0,0)
        {time:2.0, action:function(game){ game.moveCamera(new THREE.Vector3(200,-200, 200), new THREE.Vector3(0,0,0)) } },

        {time:8.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 10, 0, 0) ) } },
        {time:9.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 10, 0, 0) ) } },
        {time:10.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 10, 0, 0) ) } },
        {time:11.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 10, 0, 0) ) } },
        {time:12.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 10, 0, 0) ) } },
        {time:15.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 10, 0, 0) ) } },

        // reset camera to default position.
        {time:17.0, action:function(game){ game.defaultCamera() } },

        // this is an easy way to add 'padding' to the end of a chunk
        {time:18.0, action:function(game){ }}
    ];
};
