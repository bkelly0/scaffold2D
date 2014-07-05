(function() {
	
	function Box(x,y) {
		Sprite.call(this,x,y,Scaffold.loader.assets['images/box.png'], 45,45);
		this.solidCollide = true;
		this.bounce = 0;
		this.velocity.x = 5+Math.random()*5 * (Math.random()>.5)?-1:1;
	}
	
	self.Box = Box;
	Box.prototype = new Sprite();
	
})();

/*
 * ,
                 
                {
                 "gid":3,
                 "height":0,
                 "name":"",
                 "properties":
                    {
                     "maxX":"1050",
                     "minX":"840",
                     "speed":".3"
                    },
                 "type":"",
                 "visible":true,
                 "width":0,
                 "x":840,
                 "y":660
                }
 */