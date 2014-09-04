//For use within the TileMap
function AnimatedTile(frameArray, fps) {
	this.frameRate = fps;
	this.fpsTime = 0;
	this.animation = frameArray;
	this.currentFrame = 0;
	this.tileFrame = frameArray[0]; //index of the tileset tile in the TileMap texture
}

self.AnimatedTile = AnimatedTile;

AnimatedTile.prototype.update = function(t) {
	this.fpsTime += t;
	
	if (this.fpsTime >= 1000/this.frameRate ) {
		this.fpsTime = 0;
		//change frame
		if (this.currentFrame+1>this.animation.length-1) {				
				this.currentFrame=0;
		} else {
			this.currentFrame+=1;
		}
		this.tileFrame = this.animation[this.currentFrame];
	}
}
