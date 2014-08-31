
	function Circle(x,y) {
		Sprite.call(this,x,y,Scaffold.loader.assets['images/circle.png'],10,10);
		this.direction = {x:1, y:1};
		if (Math.random()>.5) {
			this.direction.x=-1;
		}
		if (Math.random()>.5) {
			this.direction.y=-1;
		}
		this.pseudoPhysics = false;
		
		this.speed = Math.random()*1+1;
		
		this.addAnimation("white",[0]);
		this.addAnimation("green",[1]);
	}
	
	Circle.prototype = new Sprite();
	self.Circle = Circle;
	
	Circle.prototype.update = function(t) {
		Sprite.prototype.update.call(this,t);
		this.x += Scaffold.timeScale*this.speed*this.direction.x;
		this.y += Scaffold.timeScale*this.speed*this.direction.y;
		if (this.x<=0) {
			this.x = 0;
			this.direction.x*=-1;
		} else if (this.x+this.spriteWidth>=800) {
			this.x = 800-this.spriteWidth;
			this.direction.x*=-1;
		}
		
		if (this.y<=0) {
			this.direction.y*=-1;
			this.y=0;
		} else if (this.y+this.spriteHeight>=600) {
			this.direction.y*=-1;
			this.y = 600-this.spriteHeight;
		}
		
		if (this.colliding) {
			this.playAnimation("green");
		} else {
			this.playAnimation("white");
		}
	}
