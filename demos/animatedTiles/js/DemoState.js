function DemoState() {
		this.map = TileMap.newFromJSON(
			Scaffold.loader.assets['map.json'], 
			Scaffold.loader.assets['images/tiles.png'],
			0
		);
}

DemoState.prototype = new State();

DemoState.prototype.update = function(t) {
	this.map.update(t);
}

DemoState.prototype.render = function() {
	this.map.render();
}
