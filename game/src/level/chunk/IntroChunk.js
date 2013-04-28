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
        // camera Vector3 pos, Vector3 target default is (0,-200, 200) --> (0,0,0)
        {time:2.0, action:function(game){ game.moveCamera(new THREE.Vector3(200,-200, 200), new THREE.Vector3(0,0,0), 1.0) } },

        // pass game object controller, game.
        // basic baddies: pos, size, note(0-14)
        {time:0.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 10, 0) ) } },
        {time:1.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(10,800,0), 10, 5) ) } },
        {time:2.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(-10,800,0), 10, 10) ) } },
        {time:3.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 10, 1) ) } },
        {time:4.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(10,800,0), 10, 6) ) } },
        {time:5.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(-10,800,0), 10, 11) ) } },
        {time:6.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 10, 2) ) } },
        {time:7.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(10,800,0), 10, 7) ) } },
        {time:8.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(-10,800,0), 10, 12) ) } },
        {time:9.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 10, 3) ) } },
        {time:10.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(10,800,0), 10, 8) ) } },
        {time:11.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(-10,800,0), 10, 13) ) } },
        {time:12.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 10, 4) ) } },
        {time:13.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(10,800,0), 10, 9) ) } },
        {time:14.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(-10,800,0), 10, 14) ) } },

        //linked baddies
        {time:15.0, action:function(game){ game.makeLinkedBaddies( [
            new Baddie(new THREE.Vector3(0,800,0), 10, 0),
            new Baddie(new THREE.Vector3(100,820,0), 10, 1),
            new Baddie(new THREE.Vector3(200,830,0), 10, 2),
            new Baddie(new THREE.Vector3(300,850,0), 10, 3),
            new Baddie(new THREE.Vector3(400,820,0), 10, 4) ])}},

        // camera Vector3 pos, Vector3 target default is (0,-200, 200) --> (0,0,0), time (seconds)
        {time:2.0, action:function(game){ game.moveCamera(new THREE.Vector3(200,-200, 200), new THREE.Vector3(0,0,0), 1.0) } },

        {time:17.0, action:function(game){ game.makeLinkedBaddies( [
            new Baddie(new THREE.Vector3(0,800,0), 10, 5),
            new Baddie(new THREE.Vector3(100,820,0), 10, 6),
            new Baddie(new THREE.Vector3(200,810,0), 10, 7),
            new Baddie(new THREE.Vector3(300,850,0), 10, 8),
            new Baddie(new THREE.Vector3(400,830,0), 10, 9) ])}},

        {time:18.0, action:function(game){ game.makeLinkedBaddies( [
            new Baddie(new THREE.Vector3(0,810,0), 10, 10),
            new Baddie(new THREE.Vector3(100,820,0), 10, 11),
            new Baddie(new THREE.Vector3(200,800,0), 10, 12),
            new Baddie(new THREE.Vector3(300,805,0), 10, 13),
            new Baddie(new THREE.Vector3(400,815,0), 10, 14) ])}},

        // reset camera to default position. (time)
        {time:17.0, action:function(game){ game.defaultCamera(1.5)} },

        // this is an easy way to add 'padding' to the end of a chunk
        {time:20.0, action:function(game){ }}
    ];
};
