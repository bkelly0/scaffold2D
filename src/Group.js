(function() {
	
	function Group() {
		this.members = [];
		this.quadTree = new QuadTree(0, Scaffold.camera.bounds);
		this.removeList = []; //remove these members next update
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
			this.quadTree.drawNodes();
/*
			var m = [];
			var pos = [];
			var i = this.members.length;
			while (i--) {
				if (Scaffold.renderMode==1) {
					this.members[i].render(context, Scaffold.camera);
				} else {
					//since they all share the same texture, they can be drawn at once
					var spos = this.members[i].getRenderPositions();
					pos[pos.length] = spos[0]; pos[pos.length] = spos[1]; //vertex positions
					pos[pos.length] = spos[2]; pos[pos.length] = spos[3]; //texture positions
					
					pos[pos.length] = spos[4]; pos[pos.length] = spos[5];
					pos[pos.length] = spos[6]; pos[pos.length] = spos[7];
					
					pos[pos.length] = spos[8]; pos[pos.length] = spos[9];
					pos[pos.length] = spos[10]; pos[pos.length] = spos[11];
					
					pos[pos.length] = spos[12]; pos[pos.length] = spos[13];
					pos[pos.length] = spos[14]; pos[pos.length] = spos[15];
					
					//hide connecting strip
					if (i) {
						pos[pos.length]=spos[12];
						pos[pos.length]=spos[13];
						pos[pos.length]=0;
						pos[pos.length]=0;
						pos[pos.length]=this.members[i-1].x-Scaffold.camera.bounds.x;
						pos[pos.length]=this.members[i-1].y-Scaffold.camera.bounds.y;
						pos[pos.length]=0;
						pos[pos.length]=0;
	
					}
				}
				//m.push(c);
			}
			//this.quadTree.drawNodes(Scaffold.context);
			//this.members = m;
			if (Scaffold.renderMode==0 && this.members.length>0) {
				Scaffold.renderer.draw(new Float32Array(pos), this.members[0].texture);
			}
			*/
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
	
	window.Group = Group;
	
})();
