	function PlayState() {
		this.map = TileMap.newFromJSON(Scaffold.loader.assets['mazeMap.json'], Scaffold.loader.assets['images/pfMapTiles.jpg'], 0);
		this.map.collideIndex = 1;
		this.problem = new PathFindingProblem(this.map,[2,2],[67,73]);
		this.aStar = new AStarPathFind(this.problem);
		this.map.collideIndex = 1;
		this.solution = this.aStar.search();
		
		this.pathSprites = new Group();
		this.exploredGroup = new Group();
		
		Scaffold.gravity = 0;
		
		//show explored areas
		for (var node in this.aStar.closed) {
			node = node.split(",");
			var row = parseInt(node[0]);
			if (row==2) {
				console.log(node);
			}
		
			this.exploredGroup.add(new Sprite(parseInt(node[1])*10,parseInt(node[0])*10,Scaffold.loader.assets['images/explored.png'],10,10));
		}
	}
	
	self.PlayState = PlayState;
	PlayState.prototype = new State();
	
	PlayState.prototype.update = function(t) {
		Scaffold.camera.update(t);
		
		if (this.solution.length>0) {
			var node = this.solution.shift();
			var s = new Sprite(node[1]*10, node[0]*10, Scaffold.loader.assets['images/path.jpg'], 10,10);
			this.pathSprites.add(s);
		}
		this.pathSprites.update(s);
	}
	
	PlayState.prototype.render = function(t) {
		this.map.render();
		this.exploredGroup.render();
		this.pathSprites.render();
	
	}
	