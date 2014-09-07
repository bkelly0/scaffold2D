
	function Camera(w,h) {
		this.bounds = {x:0, y:0, width:w/Scaffold.scale, height:h/Scaffold.scale};
		this.following = null;
		this.maxX = null;
		this.maxY = null;
		
		this.followOffset = {x:.5, y:.5}; //offset between 0-1 for following sprite when scrolling (center default)
		
		this.shaking = true;
		this.endShakeTime = 0;
		this.shakeIntensity = 4;
		this.shakeTime = 0;
		this.currShakeTime = 0;
		this.prevBounds = {x:0, y:0}; //shaking center
	}
	
	Camera.prototype = {
		follow: function(sprite) {
			this.following = sprite;
		},
		
		shake: function(duration, intensity) {
			this.shakeTime = duration;
			if (intensity!=null) {
				this.shakeIntensity 
			}
			this.shaking = true;
			
		},
		
		update: function(t) {
			if (this.following!=null) {
				
				var newX = this.following.x - this.bounds.width*this.followOffset.x;

				if (this.following.x >= this.bounds.x+this.bounds.width*this.followOffset.x) {
					//center of screen horizontally
					if (this.maxX == null || newX < this.maxX) {
						this.bounds.x = newX + .5 | 0; //binary "OR" round (positive num only)
						this.prevBounds.x = this.bounds.x;
					}
				} else if (this.bounds.x>0) {
					this.bounds.x = newX + .5 | 0; //moving left (binary OR)
					this.prevBounds.x = this.bounds.x;
				} else {
					this.bounds.x=0;
					this.prevBounds.x = this.bounds.x;
				}
				
				var newY = this.following.y - this.bounds.height*this.followOffset.y;
				
				
				if (this.following.y >= this.bounds.y + this.bounds.height*this.followOffset.y) {
					
					//offset vertically
					if (this.maxY ==null || newY < this.maxY) {
						this.bounds.y = newY + .5 | 0;						
						this.prevBounds.y = this.bounds.y;
					}
					if (this.bounds.y<0) {
						this.bounds.y=0;
					}
				} else if (this.bounds.y>0) {
					this.bounds.y = newY;
					this.prevBounds.y = this.bounds.y;
				} else {
					this.bounds.y=0;
					this.prevBounds.y = this.bounds.y;
				}
				
			}
						
			
			if (this.shaking && this.currShakeTime>=this.shakeTime) {
					this.shaking = false;
					this.currShakeTime = 0;
			}
				
			if (this.shaking) {	
				this.currShakeTime += t;
				var he = this.shakeIntensity /2;
				this.bounds.x = this.prevBounds.x;
				this.bounds.y = this.prevBounds.y;
				
				this.bounds.x += Math.round(Math.random()*this.shakeIntensity - he);
				this.bounds.y+= Math.round(Math.random()*this.shakeIntensity - he);
				if (this.bounds.x>this.maxX) {
					this.bounds.x = this.maxX-1;
				} else if (this.bounds.x<0) {
					this.bounds.x=0;
				}
				if (this.bounds.y>this.maxY) {
					this.bounds.y=this.maxY-1;
				} else if (this.bounds.y<0) {
					this.bounds.y=0;
				}

			}
			

		},
		
		//Won't let the camera bounds leave the edges of a map
		lockToMap: function(tileMap) {
			this.maxX = tileMap.width - this.bounds.width + .5 | 0;
			this.maxY = tileMap.height - this.bounds.height  + .5 | 0;
			
		}
		
	}
	
	self.Camera = Camera;