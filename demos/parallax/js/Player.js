(function() {
	
	function Player(x,y) {
		Sprite.call(this,x,y,Scaffold.loader.assets['images/player.png'],20,20);
		this.solidCollisions = true;
		this.jumping = false;
		this.maxVelocity.y = 10;
	}
	
	self.Player = Player;
	Player.prototype = new Sprite();
	
	Player.prototype.update = function(t) {
		if (Scaffold.keysDown[37]) {
			this.velocity.x -= 1;
			this.direction.x=-1;	
		} else if (Scaffold.keysDown[39]) {
			this.velocity.x += 1;
			this.direction.x = 1;
		}
		
		if (Scaffold.keysDown[38] && !this.jumping) {
			if (this.platform) {
					this.platform = null;
				}
				this.velocity.y = -10;
				this.jumping = true;
		}
		//console.log(this.platform);
		Sprite.prototype.update.call(this,t);
	}
	
	Player.prototype.onCollide = function(e) {
		Sprite.prototype.onCollide.call(this,e);
		if (e.bottom) {
			this.jumping = false;
		}
		
	}
	
})();
