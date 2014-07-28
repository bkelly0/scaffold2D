(function() {

	function Particle(x,y) {
	
		Sprite.call(this, x, y, Scaffold.loader.assets['images/particle.png'], 10, 10, 12);	
		
		this.maxVelocity.y = 20;
		this.maxVelocity.x = 20;
		
		this.velocity.x = Math.random()*10 - 5;

		this.velocity.y = -Math.random()*12;
		
		this.bounce = .3 + Math.random();
		
		this.drag.x = 0;
		this._super_update = Sprite.prototype.update;
	
		this.type = "Particle";

	}
	Particle.prototype = new Sprite();
	Particle.constructor = Particle;

	
	Particle.prototype.update = function(t) {
		this._super_update.call(this, t);
		if (this.y>400 || this.x+this.spriteWidth<0 || this.x>800) {
			Scaffold.state.emitter.members.splice(Scaffold.state.emitter.members.indexOf(this),1);
		}
		
	}
	

	
	window.Particle = Particle;

})();