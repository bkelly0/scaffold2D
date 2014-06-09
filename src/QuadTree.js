( function() {
	
	function QuadTree(level, bounds, maxLevels, maxObj, dbg) {
		this.level = level;
		this.bounds = bounds;
		this.sprites = [];
		this.nodes = []; //array of 4 QuadTree objects
		
		this.maxObjects = maxObj || 10;
		this.maxLevels = maxLevels || 10;
		this.debug = false || dbg;
	}
	
	QuadTree.prototype = {
		clearNodes: function() {
			this.sprites = [];
			for (var i=0; i<nodes.length; i++) {
				this.nodes[i].clear(); //better be quadtree
			}
		},
		
		splitNodes: function() {
				var rect = {x: this.bounds.x, y:this.bounds.y, width:this.bounds.width/2, height:this.bounds.height/2};
				this.nodes[0] = new QuadTree(this.level+1, {x:rect.x, y:rect.y, width:rect.width, height:rect.height }, this.maxLevels, this.maxObjects, this.debug);
				
				rect.x = this.bounds.x + rect.width;
				this.nodes[1] = new QuadTree(this.level+1, {x:rect.x, y:rect.y, width:rect.width, height:rect.height }, this.maxLevels, this.maxObjects, this.debug);


				rect.x=this.bounds.x;
				rect.y=this.bounds.y + rect.height;
				this.nodes[2] = new QuadTree(this.level+1, {x:rect.x, y:rect.y, width:rect.width, height:rect.height }, this.maxLevels, this.maxObjects, this.debug);

				
				rect.x=this.bounds.x + rect.width;
				this.nodes[3] = new QuadTree(this.level+1, {x:rect.x, y:rect.y, width:rect.width, height:rect.height }, this.maxLevels, this.maxObjects, this.debug);
			
		}, 
		
		//for debugging and testing
		drawNodes: function(context) {
			//console.log(this.level + " " + this.sprites.length);
			if (Scaffold.renderMode == 1) {
				var context = Scaffold.renderer.context;
				context.beginPath();
				context.lineWidth="2";
				context.strokeStyle="yellow";
			
				context.rect(this.bounds.x-Scaffold.camera.bounds.x, this.bounds.y-Scaffold.camera.bounds.y, this.bounds.width, this.bounds.height);
				context.stroke();
				if (this.nodes[0]==null) {
					return;
				} 
	
				
				for (var i=0; i<4; i++) {
					
						this.nodes[i].debug = true;
						context.beginPath();
						context.lineWidth="2";
						context.strokeStyle="red";
						context.rect(this.nodes[i].bounds.x-Scaffold.camera.bounds.x, this.nodes[i].bounds.y-Scaffold.camera.bounds.y, this.nodes[i].bounds.width, this.nodes[i].bounds.height);
						context.stroke();
				
					this.nodes[i].drawNodes(context);
				}
			} else {

				for (var i=0; i<this.nodes.length; i++) {
					
						this.nodes[i].debug = true;
						Scaffold.renderer.drawRect(this.nodes[i].bounds.x-Scaffold.camera.bounds.x, this.nodes[i].bounds.y-Scaffold.camera.bounds.y, this.nodes[i].bounds.width, this.nodes[i].bounds.height, [255,240,1,1], 1);
			
					this.nodes[i].drawNodes();
				}
			}
			
		},
		
		getIndex: function(sp) {
			var my = this.bounds.y + this.bounds.height/2; //mid y
			var mx = this.bounds.x + this.bounds.width/2; //mid x
			var top = (sp.y < my && sp.y+sp.spriteHeight < my);
			var bottom = (sp.y > my);
			
			if (sp.x < mx && sp.x+sp.spriteWidth < mx) {
				//left
				if (top) {
					return [0];
				} else if (bottom) {
					return [2];
				}
			} else if (sp.x>mx) {
				if (top) {
					return [1];
				} else if (bottom) {
					return [3];
				}
			}
			
			
			if (sp.x <=mx && sp.x+sp.spriteWidth > mx) {
				//horizontal overlap
				if (sp.y>mx) {
					return [2,3];
				} else if (sp.y<mx) {
					return [0,1];
				} else {
					return [0,1,2,3];
				}
			}
			
			if (sp.y <= my && sp.y+sp.spriteHeight >= my) {
				if (sp.x>mx) {
					return [1,3];
				} else if (sp.x<mx) {
					return [0,1];
				} else {
					return [1,2,3];
				}
			}
	
			return [-1]; //doesn't fit into a node
		},
		
		insertSprite: function(sp) {
			var c = Scaffold.camera;
			if (sp.x>c.bounds.x+c.bounds.width || sp.x+sp.spriteWidth < c.bounds.x || sp.y > c.bounds.y+c.bounds.height || sp.y+sp.spriteHeight < c.bounds.y ) {
				return; //off screen
			}
			
			if (this.nodes[0] != null) {
				var indexes = this.getIndex(sp);
				for (var i =0; i<indexes.length; i++) {
					if (indexes[i]!=-1) {
						this.nodes[indexes[i]].insertSprite(sp);
						return;
					}
				}
			}
			this.sprites.push(sp);
			
			if (this.sprites.length > this.maxObjects && this.level < this.maxLevels) {
				if (this.nodes[0]==null) {
					this.splitNodes();
				}
				
				var i = 0;
				while (i< this.sprites.length) {
					var indexes = this.getIndex(this.sprites[i]);
					for (var j = 0; j<indexes.length; j++) {
						if (indexes[j]!=-1) {
							var spr;
							if (j==indexes.length-1) {
								spr = this.sprites.splice(i,1)[0];
							} else {
								spr = this.sprites[i];
							}
							this.nodes[indexes[j]].insertSprite(spr);
						} else {
							i++;
						}
					}
				}
			}
		},
		
		retrieve: function(sp) {
			
			var index = this.getIndex(sp);
			var ret = [];
			for (var i=0; i< index.length; i++) {
				if (index[i]!=-1 && this.nodes[0]!=null) {
					 ret=this.nodes[index[i]].retrieve(sp).concat(ret);
				}
		
			}
			if (ret.length>0) {
				return ret;
			}
			return this.sprites;
			
		}
	}
	
	window.QuadTree = QuadTree;
})();
