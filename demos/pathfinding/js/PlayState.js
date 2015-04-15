	function PlayState() {
		this.map = TileMap.newFromJSON(Scaffold.loader.assets['mazeMap.json'], Scaffold.loader.assets['images/pfMapTiles.jpg'], 0);
		this.map.collideIndex = 1;
		

		this.map.collideIndex = 1;
		this.solution = [];
		
		this.pathSprites = new Group();
		this.exploredGroup = new Group();
		
		this.selectGoal = true;
		this.goalMarker = new Sprite(0,0,Scaffold.loader.assets['images/path.jpg'],10,10);
		
		Scaffold.gravity = 0;
		
		this.listenToMouse();
		

		
		var that = this;
		Scaffold.canvas.onmousedown = function(e) {
			//clear display
			that.exploredGroup = new Group();
			that.pathSprites = new Group();
			//change back cursor
			$(Scaffold.canvas).css("cursor","default");
			
			that.soultion = [];
			that.selectGoal = false;
			console.log(that.goalMarker.y/10, that.goalMarker.x/10);
			that.problem = new PathFindingProblem(that.map,[2,2],[that.goalMarker.y/10, that.goalMarker.x/10]);
			that.aStar = new AStarPathFind(that.problem);
			that.solution = that.aStar.search();
			//show explored areas
			for (var node in that.aStar.closed) {
				node = node.split(",");
				that.exploredGroup.add(new Sprite(parseInt(node[1])*10,parseInt(node[0])*10,Scaffold.loader.assets['images/explored.png'],10,10));
			}
		}
	}
	
	self.PlayState = PlayState;
	PlayState.prototype = new State();
	
	PlayState.prototype.update = function(t) {
		Scaffold.camera.update(t);
		
		//check mouse
		if (this.selectGoal) {
			var tile = this.map.getTileAt(this.mouseX, this.mouseY);
			
			if (tile.tileId < this.map.collideIndex) {
				$(Scaffold.canvas).css("cursor","pointer");
				this.goalMarker.x = tile.column*10;
				this.goalMarker.y = tile.row*10;
			} else {
				$(Scaffold.canvas).css("cursor","default");
			}
		}

		if (this.solution.length>0) {
			var node = this.solution.shift();
			var s = new Sprite(node[1]*10, node[0]*10, Scaffold.loader.assets['images/path.jpg'], 10,10);
			this.pathSprites.add(s);
		} else {
			this.selectGoal = true;
		}
		this.pathSprites.update(s);
	}
	
	PlayState.prototype.render = function(t) {
		this.map.render();
		this.exploredGroup.render();
		this.pathSprites.render();
		this.goalMarker.render();
	
	}
	