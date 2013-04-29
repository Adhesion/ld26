/**
 * Created with JetBrains WebStorm.
 * User: Roushey
 * Date: 4/27/13
 * Time: 7:50 PM
 */

function BossChunk(level){
    Chunk.call(this, level);
}

BossChunk.prototype = new Chunk();
BossChunk.prototype.constructor = IntroChunk;

BossChunk.prototype.build = function() {
    this.items = [
        {time:0.0, action:function(game){ game.enableKey(3) } },
        {time:1.0, action:function(game){ game.enableKey(4) } },

        {time:1.0, action:function(game){
            game.bossAppear(new THREE.Vector3(0, 800, 300))
            game.bossMove(new THREE.Vector3(0, 500, 0)) } },
        
        // camera Vector3 pos, Vector3 target default is (0,-200, 200) --> (0,0,0)
        {time:2.0, action:function(game){ game.moveCamera(new THREE.Vector3(0,-200, 150), new THREE.Vector3(0,0,0), 1.0) } },
		
		{time:3.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,500,0), 5, 9) ) } },
		
		{time:4.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,500,0), 5, 4) ) } },
		{time:4.5, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,500,0), 5, 1) ) } },
		{time:5.0, action:function(game){ game.makeBaddie( new Baddie(new THREE.Vector3(0,500,0), 5, 14) ) } },

		{time:6.0, action:function(game){ game.bossMove(new THREE.Vector3(200, 500, 0)) } },
		{time:6.5, action:function(game){ game.moveCamera(new THREE.Vector3(-50,-200, 150), new THREE.Vector3(100,0,0), 1.5) } },

		{time:8.0, action:function(game){ game.makeBossLinkedBaddies( [
            new Baddie(new THREE.Vector3(210,500,0), 5, 9),
            new Baddie(new THREE.Vector3(200,550,0), 5, 6),
            new Baddie(new THREE.Vector3(210,600,0), 5, 2) ])}},
		
		{time:12.0, action:function(game){ game.bossMove(new THREE.Vector3(100, 500, 0)) } },
		{time:12.5, action:function(game){ game.moveCamera(new THREE.Vector3(-50,-200, 150), new THREE.Vector3(50,0,0), 1.5) } },
		
		{time:13.0, action:function(game){ game.makeLinkedBaddies( [
            new Baddie(new THREE.Vector3(110,500,0), 5, 0),
            new Baddie(new THREE.Vector3(100,550,0), 5, 2),
            new Baddie(new THREE.Vector3(110,600,0), 5, 9),
            new Baddie(new THREE.Vector3(100,650,0), 5, 6) ])}},
		
		{time:15.0, action:function(game){ game.bossMove(new THREE.Vector3(700, 0, 0)) } },
		
        // this is an easy way to add 'padding' to the end of a chunk
        {time:16.0, action:function(game){ }}
    ];
};



