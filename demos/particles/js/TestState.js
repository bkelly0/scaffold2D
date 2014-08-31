(function() {
	
	function TestState() {
		this.emitter = new ParticleEmitter(400,200,Particle,2, 2000);
		this.emitter.useTree = false;
	}
	
	
	TestState.prototype = new State();
	
	TestState.prototype.update = function(t) {
		//no need to call super for extending State
		this.emitter.update(t);
	}
	
	TestState.prototype.render = function() {
		//no need to call super here either
		this.emitter.render();
	}
	
	window.TestState = TestState;
})();
