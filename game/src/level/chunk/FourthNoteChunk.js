/**
 * Created with JetBrains WebStorm.
 * User: Roushey
 * Date: 4/27/13
 * Time: 7:50 PM
 */

function FourthNoteChunk(level){
    Chunk.call(this, level);
}

FourthNoteChunk.prototype = new Chunk();
FourthNoteChunk.prototype.constructor = IntroChunk;

FourthNoteChunk.prototype.build = function() {
    this.items = [
        // camera Vector3 pos, Vector3 target default is (0,-200, 200) --> (0,0,0)
        {time:2.0, action:function(game){ game.moveCamera(new THREE.Vector3(0,-200, 170), new THREE.Vector3(0,0,0), 1.0) } },

        {time:7.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 8) ) } },

        {time:9.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 5) ) } },
        {time:10.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 8) ) } },
        {time:11.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 5) ) } },
        
        {time:13.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 5) ) } },
        {time:14.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 6) ) } },
        {time:15.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 7) ) } },
        {time:16.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 8) ) } },

		{time:18.0, action:function(game){ game.makeLinkedBaddies( [
            new Baddie(new THREE.Vector3(0,800,0), 10, 5),
            new Baddie(new THREE.Vector3(50,800,0), 10, 8),
            new Baddie(new THREE.Vector3(0,850,0), 10, 7),
            new Baddie(new THREE.Vector3(50,850,0), 10, 10) ])}},
        
        {time:20.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 2) ) } },
		{time:21.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 5) ) } },
		{time:22.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 8) ) } },

        {time:24.0, action:function(game){ game.makeLinkedBaddies( [
            new Baddie(new THREE.Vector3(0,800,0), 5, 5),
            new Baddie(new THREE.Vector3(50,800,0), 5, 7),
            new Baddie(new THREE.Vector3(0,850,0), 5, 6),
            new Baddie(new THREE.Vector3(50,850,0), 5, 8) ])}},
            
    	{time:26.0, action:function(game){ game.makeLinkedBaddies( [
            new Baddie(new THREE.Vector3(-10,800,0), 5, 11),
            new Baddie(new THREE.Vector3(10,850,0), 5, 10),
            new Baddie(new THREE.Vector3(-10,900,0), 5, 7) ])}},
            
        {time:28.0, action:function(game){ game.makeLinkedBaddies( [
            new Baddie(new THREE.Vector3(0,800,0), 5, 0),
            new Baddie(new THREE.Vector3(10,850,0), 5, 3),
            new Baddie(new THREE.Vector3(0,900,0), 5, 2),
            new Baddie(new THREE.Vector3(-10,950,0), 5, 0),
            new Baddie(new THREE.Vector3(0,1000,0), 5, 3),
            new Baddie(new THREE.Vector3(10,1050,0), 5, 2),
            new Baddie(new THREE.Vector3(0,1100,0), 5, 5) ])}},
        
        // pass game object controller, game.
        // basic baddies: pos, size, note(0-14)	
		
        // reset camera to default position. (time)
        {time:40.0, action:function(game){ game.defaultCamera(1.5)} },

        // this is an easy way to add 'padding' to the end of a chunk
        {time:42.0, action:function(game){ }}
    ];
};

//7 10 5
//11 12 10
//2 6 5

