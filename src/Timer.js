(function() {
	
	function Timer(i, rpt, callback) {
		this.interval = i;
		this.repeat = rpt;
		this.callback = callback;
		this.currTime = 0;
		Scaffold.timers.push(this);
		this.index = Scaffold.timers.length-1;
	}
	
	
	Timer.prototype = {
		 update: function(t) {
			this.currTime += t;
			if (this.currTime>=this.interval) {
				this.currTime = 0;
				this.callback();
				if (!this.repeat) {
					this.clear();
				}
			}
		},
		
		clear: function() {
			Scaffold.timers.splice(Scaffold.timers.indexOf(this),1);
		}
	}
	
	self.Timer = Timer;
	
})();
