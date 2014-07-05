(function() {
	
	function PlayState() {
		this.mapFront = TileMap.newFromJSON(Scaffold.loader.assets['parallaxMap.json'], Scaffold.loader.assets['images/pTiles.png'], 1);
		this.mapFront.collideIndex = 1;
		
		this.mapBack = TileMap.newFromJSON(Scaffold.loader.assets['parallaxMap.json'], Scaffold.loader.assets['images/pTiles.png'], 0);
		this.mapBack.parallax = .5;
		
		this.player = new Player(100,100);
		
		Scaffold.camera.follow(this.player);
		Scaffold.camera.lockToMap(this.mapFront);
		

	}
	
	self.PlayState = PlayState;
	PlayState.prototype = new State();
	
	PlayState.prototype.update = function(t) {
		this.player.update(t);
		Scaffold.camera.update(t);
		this.mapFront.collide(this.player);
	}
	
	PlayState.prototype.render = function(t) {
		this.mapBack.render();
		this.mapFront.render();
		this.player.render();
	}
	
})();
