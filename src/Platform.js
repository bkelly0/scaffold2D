(function() {
	
	function Platform(x,y, spriteSheet, width, height, options) {
		Sprite.call(this, x,y, spriteSheet, width, height, 12);
		this.maxVelocity.x = 4;
		this.type = "Platform";
		this.moveable = false;
		
		this.direction = {x:0, y:0};
		this.gravity = 0;

		this.minX = (options.minX)? options.minX:null;
		this.maxX = (options.maxX)? options.maxX:null;
		this.maxY = (options.maxY)? options.maxY:null;
		this.minY = (options.minY)? options.minY:null;

		this.stickyY = false;
		this.stickyX = false;
		this.speed = (options.speed)? options.speed:0;
		
		this.pseudoPhysics = (options.pseudoPhysics)? options.pseudoPhysics : true;
		
		
		if (this.x<= this.minX) {
			this.direction.x = 1;
		} else if (this.x<=this.maxX) {
			this.direction.x = -1;
		}
		if (this.y<=this.minY) {
			this.direction.y=1;
		} else if (this.y>=this.maxY) {
			this.direction.y=-1;
		}
	}
	
	self.Platform = Platform;
	Platform.prototype = new Sprite();
	
	
	Platform.prototype.update = function(t) {
		if (this.maxY && this. minY) {
			if (this.pseudoPhysics) {
				this.velocity.y += this.speed*this.direction.y;
			} else {
				this.y += this.speed*this.direction.y;
			}
			if (this.y<this.minY && this.direction.y==-1) {
				this.direction.y = 1;
				this.y = this.minY;
			} else if (this.y>=this.maxY && this.direction.y==1) {
				this.direction.y = -1;
				this.y = this.maxY;
			}
		}
		if (this.maxX && this.minX) {
			if (this.pseudoPhysics) {
				this.velocity.x+=this.speed*this.direction.x;
			} else {
				this.x += this.speed*this.direction.x;
			}
			if (this.direction.x==1 && this.x>=this.maxX) {
				this.direction.x=-1; this.x = this.maxX;
			} else if (this.direction.x==-1 && this.x <= this.minX) {
				this.direction.x=1; this.x = this.minX;
			}
		}
	
		Sprite.prototype.update.call(this, t);
	}
	
})()
