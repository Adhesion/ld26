/**
 * Created with JetBrains WebStorm.
 * User: Roushey
 * Date: 4/27/13
 * Time: 7:50 PM
 */

function ChorusChunk(level){
    Chunk.call(this, level);
}

ChorusChunk.prototype = new Chunk();
ChorusChunk.prototype.constructor = IntroChunk;

ChorusChunk.prototype.build = function() {
    this.items = [
        // camera Vector3 pos, Vector3 target default is (0,-200, 200) --> (0,0,0)
        
        {time:2.0, action:function(game){ game.bossMove(new THREE.Vector3(700, 0, 0)) } },
        {time:2.0, action:function(game){ game.moveCamera(new THREE.Vector3( -300, 0, 200), new THREE.Vector3(500,0,0), 2.0) } },
        
        {time:4.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 14) ) } },
		{time:5.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 8) ) } },
		{time:6.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 4) ) } },
        
        {time:8.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 0) ) } },
		{time:9.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 5) ) } },
		{time:10.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 14) ) } },
        
		{time:13.0, action:function(game){ game.makeBossLinkedBaddies( [
            new Baddie(new THREE.Vector3(-10,800,0), 5, 7),
            new Baddie(new THREE.Vector3(-10,850,0), 5, 10),
            new Baddie(new THREE.Vector3(10,900,0), 5, 11),
            new Baddie(new THREE.Vector3(-10,950,0), 5, 14) ])}},    
    
    	{time:15.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 10) ) } },
		{time:16.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 11) ) } },
		{time:17.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 12) ) } },
        {time:18.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 13) ) } },
		{time:19.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 14) ) } },
    
    	{time:22.0, action:function(game){ game.makeLinkedBaddies( [
            new Baddie(new THREE.Vector3(-10,800,0), 5, 3),
            new Baddie(new THREE.Vector3(-10,850,0), 5, 8),
            new Baddie(new THREE.Vector3(10,900,0), 5, 13) ])}},
    
		{time:25.0, action:function(game){ game.makeLinkedBaddies( [
            new Baddie(new THREE.Vector3(-10,800,0), 5, 7),
            new Baddie(new THREE.Vector3(-10,850,0), 5, 10),
            new Baddie(new THREE.Vector3(10,900,0), 5, 13),
            new Baddie(new THREE.Vector3(10,950,0), 5, 14),
            new Baddie(new THREE.Vector3(-10,1000,0), 5, 12) ])}},
		
		{time:27.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 5) ) } },
		{time:28.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 4) ) } },
		{time:29.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 3) ) } },
        {time:30.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 2) ) } },
		{time:31.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 1) ) } },
		
		{time:34.0, action:function(game){ game.makeLinkedBaddies( [
            new Baddie(new THREE.Vector3(-10,800,0), 5, 2),
            new Baddie(new THREE.Vector3(-10,850,0), 5, 7),
            new Baddie(new THREE.Vector3(10,900,0), 5, 12) ])}},
		
		{time:37.0, action:function(game){ game.makeBossLinkedBaddies( [
            new Baddie(new THREE.Vector3(-10,800,0), 5, 9),
            new Baddie(new THREE.Vector3(-10,850,0), 5, 6),
            new Baddie(new THREE.Vector3(10,900,0), 5, 2),
            new Baddie(new THREE.Vector3(10,950,0), 5, 3),
            new Baddie(new THREE.Vector3(-10,1000,0), 5, 0) ])}},
		
		{time:40.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 7) ) } },
		{time:41.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 10) ) } },
        {time:42.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 11) ) } },
		{time:43.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 14) ) } },
		
		{time:45.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 5) ) } },

		{time:47.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,800,0), 5, 0) ) } },

		
        // reset camera to default position. (time)
        {time:48.0, action:function(game){ game.defaultCamera(1.5)} },

        // this is an easy way to add 'padding' to the end of a chunk
        {time:50.0, action:function(game){ }}
    ];
};

/*
7 10 13 14 12
9 6 2 3 0
7 10 11 14
*/