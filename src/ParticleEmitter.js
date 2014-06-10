(function() {
	
	//TODO: use groups
	
	function ParticleEmitter(x, y, className, interval, lifespan, useQuadTree) {
		this.members = [];
		this.currTime = 0;
		this.lastTime = 0;
		this.interval = interval;
		this.particleClass = className;
		this.x = x;
		this.y = y;
		this.elapsedTime = 0;
		this.lifespan = lifespan;
		this.tree;
		this.timer;
		
		//disabling the quadtree can speed things up but disables collisons with sprites
		if (useQuadTree==false) {
			this.useTree = false;
		} else {
			this.useTree = true;
		}
	}
	
	ParticleEmitter.prototype = {
		update: function(t) {
			this.elapsedTime+=t;
			this.lastTime+=t;
			
		
			if(this.interval>0 && this.lastTime>=this.interval) {
				var i = this.lastTime/this.interval >> 0;
				for (var i=0; i< this.lastTime/this.interval >> 0; i++) { //bitwise floor
					this.addParticle();
					if (i>75) { //mmmmm?
						break;
					}
				}
				
				this.lastTime = 0;
			}
			
			if (this.useTree) {
				this.tree = new QuadTree(0,Scaffold.camera.bounds);
			}
			
			var i = this.members.length;
			while(i--) {
				if (this.members[i].expires <= this.elapsedTime) {
					//remove
					this.members.splice(i,1);
					
				} else {
					if (this.useTree) {
						this.tree.insertSprite(this.members[i]);
					}
					this.members[i].update(t);
				}
			}

		},
		
		render: function() {
			Scaffold.renderer.renderGroup(this);
			
		},
		
		addParticle: function() {
		
			var p = new self[this.particleClass](this.x, this.y);
			p.expires = this.elapsedTime+this.lifespan;
			this.members.push(p);
		},
		
		emit: function(count) {
			var i = count;
			while(i--) {
				this.addParticle();
			}
		},
		
		emitWithTimer: function(interval, lifespan, time) {
			this.interval = interval;
			this.lifespan = lifespan;
			var that = this;
			this.timer = new Timer(time,false,function() {
				that.interval = 0;
			});
		},
		
		collide: function(sp) {
			var objects = this.tree.retrieve(sp);
			var i = objects.length;
			while(i--) {
				var obj = objects[i];
				obj.collideBounds(sp.getBounds()); //backwards?
			}
		}
	}
	
	self.ParticleEmitter = ParticleEmitter;
	
})();
