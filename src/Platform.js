(function() {
	
	function Platform(x,y, spriteSheet, width, height, options) {
		Sprite.call(this, x,Number(y), spriteSheet, width, height, 12);
		this.solidCollisions = true;
		this.maxVelocity.x = 4;
		this.type = "Platform";
		this.moveable = false;
		
		this.direction = {x:0, y:0};
		this.drag = {x:0, y:0};
		this.gravity = 0;

		this.minX = (options.minX)? Number(options.minX):null;
		this.maxX = (options.maxX)? Number(options.maxX):null;
		this.maxY = (options.maxY)? Number(options.maxY):null;
		this.minY = (options.minY)? Number(options.minY):null;

		this.stickyY = true;
		this.stickyX = true;
		this.speed = (options.speed)? Number(options.speed):0;
		
		this.pseudoPhysics = (options.pseudoPhysics=="false")? false : true;
		console.log(this);
		
		if (this.minX && this.x<= this.minX) {
			this.direction.x = 1;
		} else if (this.maxX && this.x<=this.maxX) {
			this.direction.x = -1;
		}
		if (this.minY && this.y<=this.minY) {
			this.direction.y=1;
		} else if (this.minY && this.y>=this.maxY) {
			this.direction.y=-1;
		}
	}
	
	self.Platform = Platform;
	Platform.prototype = new Sprite();
	
	
	Platform.prototype.update = function(t) {
		Sprite.prototype.update.call(this, t);

		if (this.maxY && this. minY) {
			if (this.pseudoPhysics) {
				this.velocity.y += this.speed*this.direction.y;
			} else {
				this.prevPos.y = this.y;
				this.y += this.speed*this.direction.y;
			}
			if (this.y<this.minY && this.direction.y==-1) {
				this.direction.y = 1;
				this.y = this.minY;
				this.velocity.y = 0;
			} else if (this.y>=this.maxY && this.direction.y==1) {
				this.direction.y = -1;
				this.y = this.maxY;
				this.velocity.y = 0;
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
				this.velocity.x = 0;
			} else if (this.direction.x==-1 && this.x <= this.minX) {
				this.direction.x=1; this.x = this.minX;
				this.velocity.x = 0;
			}
		}
	
	}
	
	Platform.prototype.onCollide = function(e) {
		if (e.obj.locked.top && e.top || e.obj.locked.bottom && e.bottom) {
			this.velocity = {x:0,y:0};
			this.y = this.prevPos.y;
			e.obj.y = e.obj.prevPos.y;
			this.direction.y *= -1;
		}
	}
})()
