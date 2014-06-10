(function() {
	
	
	function ProgressBar(x,y, width, height, borderRGBA, fillRGBA, backgroundRGBA) {
		//the arguments should be arrays [r,g,b,a]
		this.border = borderRGBA;
		this.background = backgroundRGBA;
		this.fill = fillRGBA;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		//TODO: Check values
		
		this.percent = .5;
	}
	
	ProgressBar.prototype = {
		update: function(t) {
			
		},
		
		render: function() {
			if (Scaffold.renderMode==1) {
				//TODO: move into canvas renderer
				Scaffold.context.fillStyle = "rbga(" + this.background[0] + "," + this.background[1] + "," + this.background[2] + "," + this.background[3] + ")";
				Scaffold.context.fillRect(this.x,this.y, this.width, this.height);
				
				Scaffold.context.fillStyle = "rbga(" + this.fill[0] + "," + this.fill[1] + "," + this.fill[2] + "," + this.fill[3] + ")";
				Scaffold.context.fillRect(this.x,this.y,this.width*this.percent,this.height);
			} else {
				if (this.background) 
				Scaffold.renderer.drawFill(this.x, this.y, this.width, this.height,this.background);
				Scaffold.renderer.drawFill(this.x, this.y, this.width*this.percent, this.height,this.fill);
				Scaffold.renderer.drawRect(this.x, this.y, this.width, this.height,this.border, 1);
			}
		}
	}
	
	self.ProgressBar = ProgressBar;
	
})();
