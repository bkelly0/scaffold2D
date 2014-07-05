(function() {
	
	function PlayState() {
		this.map = TileMap.newFromJSON(Scaffold.loader.assets['platformDemoMap.json'], Scaffold.loader.assets['images/pTiles.png'], 0);
		this.map.collideIndex = 1;
		this.map.debug = true;
		this.player = new Player(100,100);
		
		Scaffold.camera.follow(this.player);
		Scaffold.camera.lockToMap(this.map);
		
		this.platformMap = new PlatformMap(Scaffold.loader.assets['images/platform2.png']);
		this.platformMap.init(Scaffold.loader.assets['platformDemoMap.json'], 1);
		this.platformMap.addAll();
	
		/*
		this.boxes = new Group();
		for (var i=0; i<4; i++) {
			this.boxes.add(new Box(30+Math.random()*800, -50));
		}
		*/
	}
	
	self.PlayState = PlayState;
	PlayState.prototype = new State();
	
	PlayState.prototype.update = function(t) {
		this.player.update(t);
		this.platformMap.update(t);
		Scaffold.camera.update(t);
		
		//this.boxes.update(t);
		
		//Scaffold.collideGroup(this.player, this.boxes);
		//this.boxes.collideInternal();
		
		this.map.collide(this.player);
		//this.map.collideGroup(this.boxes);
		Scaffold.collideGroup(this.player, this.platformMap.group);
		
	}
	
	PlayState.prototype.render = function(t) {
		this.map.render();
		this.platformMap.render();
		//this.boxes.render();
		this.player.render();
	}
	
})();
