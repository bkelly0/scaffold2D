
	function PlayState(maxObjects, total) {
		this.circleGroup = new Group();
		this.circleGroup.debugQuadTree = true;
		this.circleGroup.maxQuadObjects = maxObjects;
		for (var i=0; i<total; i++) {
			this.circleGroup.add(new Circle(Math.random()*800, Math.random()*600));
		}
	
	}
	
	PlayState.prototype = new State();
	self.PlayState = PlayState;
	
	PlayState.prototype.update = function(t) {

		this.circleGroup.update(t);
		this.circleGroup.collideInternal();
	}
	
	PlayState.prototype.render = function()	 {
		this.circleGroup.render();
	}
	
