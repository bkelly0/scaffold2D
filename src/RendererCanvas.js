(function() {
	
	function RendererCanvas(canvas) {
		this.context = canvas.getContext('2d');
		this.context.scale(Scaffold.scale,Scaffold.scale);
	}
	
	self.RendererCanvas = RendererCanvas;
	
	RendererCanvas.prototype = {
		renderSprite: function(sp) {
			if (sp.direction.x==-1 && sp.flippedContextBuffer!=null) {
				this.context.drawImage(sp.flippedContextBuffer.canvas, sp.flippedContextBuffer.canvas.width - sp.framePositions[sp.currentAnimation.frames[sp.currentFrame]].x-sp.spriteWidth, sp.framePositions[sp.currentAnimation.frames[sp.currentFrame]].y, sp.spriteWidth, sp.spriteHeight, sp.x-Scaffold.camera.bounds.x, sp.y-Scaffold.camera.bounds.y, sp.spriteWidth, sp.spriteHeight);
			} else {
				this.context.drawImage(sp.images, sp.framePositions[sp.currentAnimation.frames[sp.currentFrame]].x, sp.framePositions[sp.currentAnimation.frames[sp.currentFrame]].y, sp.spriteWidth, sp.spriteHeight, sp.x-Scaffold.camera.bounds.x, sp.y-Scaffold.camera.bounds.y, sp.spriteWidth, sp.spriteHeight);
			}
		},
		
		renderGroup: function(grp) {
			var i=grp.members.length;
			while(i--) {
				this.renderSprite(grp.members[i]);
			}
		},
		
		drawImage: function(assetStr, posArr) {
			var i = posArr.length;
			var x, y = 0;
			while(i--) {
				x = posArr[i].x;
				y = posArr[i].y;

				//this.context.drawImage(Scaffold.loader.assets[assetStr], x, y);
			}
		}
	}
	
})();
