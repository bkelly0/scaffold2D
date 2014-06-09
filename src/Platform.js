(function() {
	//AKA TileGroup
	/*
	 * This could extend sprite... but this may be cheaper for now
	 */
	function Platform(x, y,tWidth,tHeight,images,data) {
		this.width = data[0].length*tWidth;
		this.height = data.length*tHeight;
		
		this.buffer = document.createElement('canvas');
		this.buffer.width = this.width;
		this.buffer.height = this.height;
		
		//draw buffer
		this.context = this.buffer.getContext("2d");
		for (var r=0;r<data.length;r++) {
			for(var c=0;c<data[r].length;c++) {
				var tileNum = data[r][c];
				this.context.drawImage(images, tileNum*tWidth ,0,
					tWidth, tHeight, 
					c*tWidth, tHeight*r,tWidth,tHeight);
			}
		}
		this.id = 0;
		this.x = x;
		this.y = y;
		this.mode = 0; //0 for to, 1 for from
		
		this.startPos = {x: x, y: y};
		this.endPos = {x: x, y: y};
		this.speed = {x:1.5, y:1.5};
		this.stillTime = 1000;
		this.bounds={left: this.x, right:this.x+this.width, top: this.y, bottom:this.y+this.height, x:this.x, y:this.y, width:this.width, height:this.height};
		this.type = "Platform";
		
		this.currTime = 0;
		
		this.prevPos = {x: this.x, y: this.y};
		this.spriteHeight = this.height;
		this.spriteWidth = this.width;

	}
	
	Platform.prototype = {
		render:function() {
			Scaffold.context.drawImage(this.buffer, this.x-Scaffold.camera.bounds.x, this.y-Scaffold.camera.bounds.y);
		},
		
		update: function(t) {
			this.prevPos = {x: this.x, y: this.y};
			this.currTime+=t;
			
			if (this.currTime > this.stillTime) {
				if (this.mode==0) {
					//motion
					if (this.y<this.endPos.y) {
						this.y+=this.speed.y;
						if (this.y>=this.endPos.y) {
							this.y = this.endPos.y;
						}
					} else if (this.y>this.endPos.y) {
						this.y-=this.speed.y;
						if (this.y<=this.endPos.y) {
							this.y = this.endPos.y;

						}
					}
					
					//motion x
					if (this.x<this.endPos.x) {
						this.x+=this.speed.x;
						if (this.x>=this.endPos.x) {
							this.x = this.endPos.x;
						}
					} else if (this.x>this.endPos.x) {
						this.x-=this.speed.x;
						if (this.x>=this.endPos.x) {
							this.x = this.endPos.x;
						}
					}
					
					if (this.x==this.endPos.x && this.y==this.endPos.y) {
						this.currTime = 0;
						this.mode = 1;
					}
					
				} else {
					//motion
					if (this.y<this.startPos.y) {
						this.y+=this.speed.y;
						if (this.y>=this.startPos.y) {
							this.y = this.startPos.y;

						}
					} else if (this.y>this.startPos.y) {
						this.y-=this.speed.y;
						if (this.y<=this.startPos.y) {
							this.y = this.startPos.y;

						}
					}
					
					//motion x
					if (this.x<this.startPos.x) {
						this.x+=this.speed.x;
						if (this.x>=this.startPos.x) {
							this.x = this.startPos.x;
						}
					} else if (this.x>this.startPos.x) {
						this.x-=this.speed.x;
						if (this.x<=this.startPos.x) {
							this.x = this.startPos.x;
						}
					}
					
					if (this.x==this.startPos.x && this.y==this.startPos.y) {
						this.currTime = 0;
						this.mode = 0;
					}
				}

			}
			this.bounds={left: this.x, right:this.x+this.width, top: this.y, bottom:this.y+this.height, x:this.x, y:this.y, width:this.width, height:this.height};
			
		},
		
		setEndPos: function(px,py) {
			this.endX = x;
			this.endY = y;
		}
		

	}
	
	window.Platform = Platform;
	
})();
