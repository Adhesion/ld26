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
        {time:0.0, action:function(game){ game.enableKey(3) } },
        {time:0.0, action:function(game){ game.enableKey(4) } },

        // start time 3:04
        {time:2.0, action:function(game){ game.moveCamera(new THREE.Vector3(0,-200, 170), new THREE.Vector3(0,0,0), 1.0) } },

		{time:6.0, action:function(game){ game.makeLinkedBaddies( [
            new Baddie(new THREE.Vector3(-10,800,0), 5, 1),
            new Baddie(new THREE.Vector3(-10,850,0), 5, 1),
            new Baddie(new THREE.Vector3(10,900,0), 5, 1),
            new Baddie(new THREE.Vector3(-10,950,0), 5, 4) ])}},  
		
		{time:8.0, action:function(game){ game.makeLinkedBaddies( [
            new Baddie(new THREE.Vector3(-10,800,0), 5, 6),
            new Baddie(new THREE.Vector3(-10,850,0), 5, 6),
            new Baddie(new THREE.Vector3(10,900,0), 5, 6),
            new Baddie(new THREE.Vector3(-10,950,0), 5, 9) ])}},  

		{time:10.0, action:function(game){ game.makeBossLinkedBaddies( [
            new Baddie(new THREE.Vector3(-10,800,0), 5, 11),
            new Baddie(new THREE.Vector3(-10,850,0), 5, 11),
            new Baddie(new THREE.Vector3(10,900,0), 5, 11),
            new Baddie(new THREE.Vector3(-10,950,0), 5, 14) ])}},  		

		{time:12.0, action:function(game){ game.makeLinkedBaddies( [
            new Baddie(new THREE.Vector3(-10,800,0), 5, 11),
            new Baddie(new THREE.Vector3(-10,850,0), 5, 14),
            new Baddie(new THREE.Vector3(-10,950,0), 5, 7) ])}},  		
		
		{time:13.0, action:function(game){ game.makeLinkedBaddies( [
            new Baddie(new THREE.Vector3(-10,800,0), 5, 11),
            new Baddie(new THREE.Vector3(-10,850,0), 5, 14),
            new Baddie(new THREE.Vector3(-10,950,0), 5, 7) ])}},  

		{time:16.0, action:function(game){ game.makeBossLinkedBaddies( [
            new Baddie(new THREE.Vector3(-10,800,0), 5, 4),
            new Baddie(new THREE.Vector3(-10,850,0), 5, 1),
            new Baddie(new THREE.Vector3(-10,950,0), 5, 2) ])}}, 

		{time:19.0, action:function(game){ game.makeLinkedBaddies( [
            new Baddie(new THREE.Vector3(-10,800,0), 5, 9),
            new Baddie(new THREE.Vector3(-10,850,0), 5, 6),
            new Baddie(new THREE.Vector3(-10,950,0), 5, 7) ])}}, 
        
        {time:22.0, action:function(game){ game.makeLinkedBaddies( [
            new Baddie(new THREE.Vector3(-10,800,0), 5, 14),
            new Baddie(new THREE.Vector3(-10,850,0), 5, 11),
            new Baddie(new THREE.Vector3(-10,950,0), 5, 12) ])}}, 
		
		{time:24.0, action:function(game){ game.makeLinkedBaddies( [
            new Baddie(new THREE.Vector3(-10,800,0), 5, 4),
            new Baddie(new THREE.Vector3(-10,850,0), 5, 4),
            new Baddie(new THREE.Vector3(-10,950,0), 5, 4) ])}},
		
		{time:26.0, action:function(game){ game.makeLinkedBaddies( [
            new Baddie(new THREE.Vector3(-10,800,0), 5, 1),
            new Baddie(new THREE.Vector3(-10,850,0), 5, 1),
            new Baddie(new THREE.Vector3(-10,950,0), 5, 1) ])}},
		
		{time:28.0, action:function(game){ game.makeLinkedBaddies( [
            new Baddie(new THREE.Vector3(-10,800,0), 5, 2),
            new Baddie(new THREE.Vector3(-10,850,0), 5, 2),
            new Baddie(new THREE.Vector3(-10,950,0), 5, 2) ])}},
		
		//death		

        // reset camera to default position. (time)
        {time:38.0, action:function(game){ game.defaultCamera(1.5)} },

        // this is an easy way to add 'padding' to the end of a chunk
        {time:40.0, action:function(game){ game.gameOver() }}
    ];
};

/*
1 1 1 4, 6 6 6 9, 11 11 11 14 (3:10)
11 14 7 10 8 6 (3:16)
4 1 2, 9 6 7, 14 11 12 (3:20+)
climax 3:29
boss death ~3:31


*/

