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
        // basic baddies: pos, type, size
        {time:0.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 0, 10) ) } },
        {time:1.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 0, 10) ) } },
        {time:2.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 0, 10) ) } },
        {time:3.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 0, 10) ) } },
        {time:4.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 0, 10) ) } },
        {time:5.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 0, 10) ) } },

        //linked baddies
        {time:6.0, action:function(game){ game.makeLinkedBaddies( [
            new Baddie(new THREE.Vector3(0,800,0), 0, 10),
            new Baddie(new THREE.Vector3(100,800,0), 0, 10),
            new Baddie(new THREE.Vector3(200,800,0), 0, 10),
            new Baddie(new THREE.Vector3(300,800,0), 0, 10) ])}},

        // this is an easy way to add 'padding' to the end of a chunk
        {time:7.0, action:function(game){ }}
    ];
};
