	
	function Button(name, x,y,width,height,image) {
		this.image = image;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.over = 0; //mouse is over
		this.onMouseUp = null;
		this.clickTime = 0;
		this.listeners = [];
		this.id = name;
	}
	
	Button.prototype = {
		update: function(t) {
			if(this.inRect(Scaffold.state.mouseX, Scaffold.state.mouseY)) {
					this.over = 1;
					if (Scaffold.state.lastMouseUp.timestamp!=this.clickTime && this.inRect(Scaffold.state.lastMouseUp.x, Scaffold.state.lastMouseUp.y)) {
						this.clickTime = Scaffold.state.lastMouseUp.timestamp;
						for (var i=0;i<this.listeners.length;i++) {
								this.listeners[i].onButtonClick({target:this.id});
						}
					}
			} else {
					this.over = 0;
			}
		},
		
		render: function() {
			Scaffold.context.drawImage(this.image, this.width*this.over,0,this.width,this.height, this.x, this.y, this.width,this.height);
			
		},
		
		inRect: function(x,y) {
			if((x > this.x && x < this.x+this.width) && (y > this.y && y < this.y+this.height)) {
				return true;
			} else {
				return false;
			}
		},
		
		addListener: function(obj) {
			if (obj.onButtonClick!=null) {
				this.listeners.push(obj);
			}
		},
		
		destroy: function() {
			this.listeners = null;
		}
	};
	
	window.Button = Button;

	function AnimatedButton(name, x,y,width,height,image, animationFramesNormal, animationFramesOver, fps) {
		this.id = "name";
		Sprite.call(this, x, y, image, width, height, fps);
		this.gravity = 0;
		this.over = 0;
		this.addAnimation("normal",animationFramesNormal);
		this.addAnimation("over", animationFramesOver);
		this.playAnimation("normal");
		this.animationKey = 0;
		this._super_update = Sprite.prototype.update;
		this.listeners = [];
	}
	
	AnimatedButton.prototype = new Sprite();
	
	AnimatedButton.prototype.update = function(t) {
			if(this.inRect(Scaffold.state.mouseX, Scaffold.state.mouseY)) {
					this.over = 1;
				
					if (Scaffold.state.lastMouseUp.timestamp!=this.clickTime && this.inRect(Scaffold.state.lastMouseUp.x, Scaffold.state.lastMouseUp.y)) {
						this.clickTime = Scaffold.state.lastMouseUp.timestamp;
						for (var i=0;i<this.listeners.length;i++) {
								this.listeners[i].onButtonClick({target:this.id});
						}
					}
					if (this.animationKey!=1) {
						this.animationKey = 1;
						this.playAnimation("over");
					}
					
			} else {
					this.over = 0;
					if (this.animationKey!=0) {
						this.playAnimation("normal");
						this.animationKey = 0;
					}
			}
		
		this._super_update.call(this,t);
	}
	
	AnimatedButton.prototype.addListener = function(obj) {
		if (obj.onButtonClick!=null) {
			this.listeners.push(obj);
		}
	}
	
	AnimatedButton.prototype.inRect = function(x,y) {
			if((x > this.x && x < this.x+this.spriteWidth) && (y > this.y && y < this.y+this.spriteHeight)) {
				return true;
			} else {
				return false;
			}
	}
	
	AnimatedButton.prototype.destroy = function() {
		this.listeners = null;
	}
	
	AnimatedButton.prototype.render = function() {
		var t = this;
		Scaffold.context.drawImage(t.images, t.spriteWidth*t.currentAnimation[t.currentFrame], 0, t.spriteWidth, t.spriteHeight, t.x, t.y, t.spriteWidth, t.spriteHeight);

	}
	
	self.AnimatedButton = AnimatedButton;
