(function() {

	function State() {
		//listenToMouse needs called to start populating these values
		this.canvasRect = null;
		this.mouseX = 0;
		this.mouseY = 0;
		this.lastMouseUp = {x:0, y:0, timestamp: 0};
	}
	
	State.prototype = {
		update: function(t) {
		
		},
		
		render: function() {
		
		},
		
		listenToMouse: function() {
			this.canvasRect = Scaffold.context.canvas.getBoundingClientRect();
			Scaffold.context.canvas.onmousemove = (function(self) {
				return function(e) {
					self.mouseX = e.clientX - self.canvasRect.left;
					self.mouseY = e.clientY - self.canvasRect.top;
				}
			})(this);
			
			Scaffold.context.canvas.onmouseup = (function(self) {
				return function(e) {
					self.lastMouseUp = {x: self.mouseX, y: self.mouseY, timestamp: new Date().getTime()};
				}
			})(this);
		}
		
	}
	
	window.State = State;

})();