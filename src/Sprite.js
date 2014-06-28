(function() {
	function Sprite(x, y, spriteSheet, sw, sh, fps) {
		this.x = x || 0;
		this.y = y || 0;
		this.prevPos = {x:x, y:y};
		this.direction = {x: 0, y:0};
		this.images = spriteSheet || null;
		this.colliding = false;
		
		this.frameRate = fps || 30;
		this.fpsTime = 0;
		this.animations = [];
			
		this.currentFrame = 0;
		this.currentAnimation = {frames:[0], repeat:0};
		

		this.spriteWidth = sw ||  0;
		this.spriteHeight = sh || 0;
		
		//don't use bounds directly. use getBounds()
		this.bounds={left: this.x, width:this.spriteWidth, height:this.spriteHeight, right:this.x+this.spriteWidth, top: this.y, bottom:this.y+this.spriteHeight};

					

		this.velocity = {x:0 , y:0};
		this.maxVelocity = {x:6, y:8}
		this.drag = {x:.1, y: 0}; 
		this.gravity = Scaffold.gravity;
		this.bounce = 0; //ammount of bounce when colliding with a map
			
		this.type = "Sprite"; //sent with collision events
		this.direction = {x: -1, y:0};		
		
		this.platform = null; //when attached to platform
			
		this.trim = {left:0 ,top:0, right:0, bottom:0}; //trims to collision area down from the sprite size
		
		this.flashing = false;
		
		this.pseudoPhysics = 1; //disable to just use x/y positions without velocity,drag, or gravity
		this.solidCollide = 0;
		this.moveable = 1;
		this.locked = {left:0, right:0, top:0, bottom:0 };
		
		//save the frame positions in the sprites image file
		this.framePositions = [];
			if (this.images) {
				var cx=0;
				var cy=0;
			
				if (Scaffold.renderMode==1) {
					while(cy<this.images.height) {
						while(cx<this.images.width) {
							this.framePositions.push({x: cx, y:cy});
							cx+=this.spriteWidth;
						}
						cx = 0;
						cy += this.spriteHeight;
					}
				} else {
					//webgl
					var pixelHeight = 1/this.images.height;
					var pixelWidth = 1/this.images.width;
					while(cy<this.images.height) {
						while(cx<this.images.width) {
							this.framePositions.push({tx1: cx*pixelWidth, ty1: cy*pixelHeight, tx2: (cx+sw)*pixelWidth, ty2: (cy+sh)*pixelHeight});
							cx+=this.spriteWidth;
						}
						cx = 0;
						cy += this.spriteHeight;
					}	
					this.texture = Scaffold.renderer.textures[this.images.src];
				}
			}
	}
	
	Sprite.prototype = {
		enableFlipping: function() {
			//creates a buffer for a horizontally flipped sprite (canvas only)
		    var buffer = document.createElement('canvas');
			buffer.width = this.images.width;
			buffer.height = this.images.height;
			this.flippedContextBuffer = buffer.getContext('2d');
			this.flippedContextBuffer.save();
			this.flippedContextBuffer.scale(-1,1);
			this.flippedContextBuffer.drawImage(this.images,-this.images.width,0);
			this.flippedContextBuffer.restore();
		},

		flash: function(time) {
			//the current animation needs at least 2 frames for flashing to work
			this.flashing = true;
			var that = this;
			var timer = new Timer(time,false, function() {
				that.flashing = false;
			})
		},
		
		addAnimation: function(name, frames, repeat) {
			var r = repeat || 1;
			this.animations[name] = {'frames': frames, 'repeat':r };
		},
		
		playAnimation: function(name) {
			if (this.currentAnimation!=this.animations[name]) {
				this.currentFrame = 0; //index in current animation
				this.currentAnimation = this.animations[name];
			}
		},
		
		stopAnimation: function() {
			this.currentAnimation = {frames:[], repeat:1};
		},
		
		
		update: function(elapsedTime) {
			var tp = Scaffold.timeScale;
			
			if (this.currentAnimation.frames.length>1) {
				this.fpsTime += elapsedTime;
			
				if (this.fpsTime >= 1000/this.frameRate ) {
					this.fpsTime = 0;
					//change frame
					if (this.currentFrame+1>this.currentAnimation.frames.length-1) {
						
						if (this.currentAnimation.repeat) {
							this.currentFrame=0;
						} else if (this.animationComplete) {
							this.animationComplete();
						}
					} else {
						this.currentFrame+=1;
					}
				}
			
			}
			
			this.prevPos.x = this.x;
			this.prevPos.y = this.y;
			this.prevVelocity = this.velocity;

			if (this.pseudoPhysics) {
				//this.velocity.y += this.gravity*tp;
				if (this.velocity.y>0) {
					this.velocity.y += this.gravity-this.drag.y; 
					if (this.velocity.y<0) this.velocity.y = 0;
				} else if (this.velocity.y<0) {
					this.velocity.y += this.gravity+this.drag.y; 
					if (this.velocity.y>0) this.velocity.y = 0;
				} else {
					this.velocity.y+=this.gravity;
				}
				
				if (this.velocity.y>this.maxVelocity.y) {
					this.velocity.y = this.maxVelocity.y;
				} else if (this.velocity.y<-this.maxVelocity.y) {
					this.velocity.y = -this.maxVelocity.y;
				}
				
				
				//this.y += this.velocity.y + .5|0; //binary or round
				this.y+=this.velocity.y*Scaffold.timeScale;
				
				if (this.velocity.x>0) {
					this.velocity.x-= this.drag.x;
					if (this.velocity.x<0) this.velocity.x=0;
				} else if (this.velocity.x<0) {
					this.velocity.x += this.drag.x;
					if (this.velocity.x>0) this.velocity.x = 0;
				}
				
				
				
				if (this.velocity.x > this.maxVelocity.x) {
					this.velocity.x = this.maxVelocity.x;
				} else if (this.velocity.x < -this.maxVelocity.x) {
					this.velocity.x = -this.maxVelocity.x;
				}
				this.x+=this.velocity.x*Scaffold.timeScale;
				this.temp = Scaffold.timeScale;
			}
			
			
			//sticky platforms
		
			if (this.platform!=null) {
				this.x+= this.platform.x-this.platform.prevPos.x;
				if (this.velocity.y>0) {
					this.y = this.platform.y-this.spriteHeight+this.trim.bottom;
					this.velocity.y = 0;
				}
				if (this.x>=this.platform.x+this.platform.spriteWidth || this.x+this.spriteWidth<=this.platform.x || this.velocity.y<0) {
					this.platform=null;
				}
			}
		
		},
		
		getBounds: function() {
			this.bounds.left = this.x;
			this.bounds.right = this.x+this.spriteWidth;
			this.bounds.top = this.y;
			this.bounds.bottom = this.y+this.spriteHeight;
			this.bounds.x = this.x;
			this.bounds.y = this.y;
			return this.bounds;
		},
		
		render: function() {
			var t = this;
			if (t.flashing==false || this.currentFrame%2==0) {
				Scaffold.renderer.renderSprite(this);
			}
		},
		

		onCollide: function(e) {
			
			if (e.type=="map" && e.velocity.y > 1 && (e.top || e.bottom)) {
				this.velocity.y = - e.velocity.y*this.bounce;
			}
			if (e.type=="map" && (e.right || e.left)) {
				this.velocity.x = - e.velocity.x*this.bounce;
			}
	
		
		},
		
	
		
	}
	
	
	
	self.Sprite = Sprite;
	
})();