(function() {
	
	function Group() {
		this.members = [];
		this.quadTree = new QuadTree(0, Scaffold.camera.bounds);
		this.removeList = []; //remove these members next update
		this.debugQuadTree = false;
	}
	
	Group.prototype = {
		add:function(obj) {
			this.members.push(obj);
		},
		
		remove:function(obj) {
			this.removeList[this.removeList.length] = obj;
		},
		
		render:function(context, camera) {
			Scaffold.renderer.renderGroup(this);
			if (this.debugQuadTree) {
				this.quadTree.renderNodes();
			}
		},
		
		update:function(t) {
			//remove list prevents removed members from being added to the quadtree
			var j = this.removeList.length;
			while(j--) {
				this.members.splice(this.members.indexOf(this.removeList[j]),1);
			}
			this.removeList = [];
			
			this.quadTree = new QuadTree(0, Scaffold.camera.bounds);
			//var m=[];
			var i = this.members.length;
			while (i--) {
				this.members[i].update(t);
				
				this.quadTree.insertSprite(this.members[i]);
			}
			//this.members = m;
			
			
		},
		
		collideInternal:function(t) {
			var spArr=null;
			for(var i=0;i<this.members.length;i++) {
				spArr = this.quadTree.retrieve(this.members[i]);
				for (var j=0;j<spArr.length;j++) {
					if (this.members[i]!= spArr[j] && spArr[j].colliding == false) {
						Scaffold.collide(this.members[i], spArr[j]);
					}
				}
			}
		}
		
	}
	
	self.Group = Group;
	
})();
