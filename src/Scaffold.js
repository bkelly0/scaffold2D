/*!

ScaffoldJS 1.0.%buildNumber%

The MIT License (MIT)

Copyright (c) 2014 Bradford Kelly
brad@bradfordkelly.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

(function() {
	
	function Scaffold() {
		
	}

	self.Scaffold = Scaffold;

	//Static vars
	Scaffold.camera = null;
	Scaffold.gravity = 0;
	Scaffold.keysDown = [];
	Scaffold.state=null;
	Scaffold.lastTime =0;
	Scaffold.currentFPS=0;
	Scaffold.timers = [];
	Scaffold.data = {};
	Scaffold.paused = false;
	Scaffold.gamepads = [];
	Scaffold.renderMode = 0; //0 = webgl 1 = canvas
	Scaffold.scale = 1;
	Scaffold.timeScale = 1;
	Scaffold.soundAvailable = false;
	Scaffold.canvasFallback = true;
	
	//lookup for gamepad.button indexes
	Scaffold.gamepadLookup = {
		up:12,
		down:13,
		left:14,
		right:15,
		select:8,
		start:9,
		a: 0,
		b: 2,
		c: 1,
		d:3,
		l1:4,
		l2:6,
		r1:5,
		r2:7,
		l3:10,
		r3:11
	}
	
	Scaffold.prototype = {
	
	}
	
	Scaffold.init = function(canvas) {

		if (Scaffold.renderMode==0) {
			Scaffold.renderer = new RendererGL(canvas);
			if (!Scaffold.renderer.gl && Scaffold.canvasFallback) {
				Scaffold.renderMode = 1;
			}
		}
		if (Scaffold.renderMode==1) {
			Scaffold.renderer = new RendererCanvas(canvas);
			
		}
		
	  	if(Sound.init()) {
	  		Scaffold.soundAvailable = true;
	  	}
	
		Scaffold.camera = new Camera(canvas.width, canvas.height);
		
		//gamepads only currently supported by chrome and firefox 
		if (navigator.userAgent.indexOf("Firefox")!=-1) {
			window.addEventListener('MozGamepadConnected', Scaffold.gamepadConnected, false);
    		window.addEventListener('MozGamepadDisconnected', Scaffold.gamepadDisconnected, false);
		} else if (navigator.userAgent.indexOf("Chrome")!=-1 && navigator.userAgent.indexOf("Mobile")==-1) {
			Scaffold.gamepads = navigator.webkitGetGamepads();
		}

	
		if (!self.requestAnimationFrame) {
			if (self.msRequestAnimationFrame) {
				self.requestAnimationFrame = self.msRequestAnimationFrame;
			} else if (self.mozRequestAnimationFrame) {
				self.requestAnimationFrame = self.mozRequestAnimationFrame;
			} else if (self.webkitRequestAnimationFrame) {
				self.requestAnimationFrame = self.webkitRequestAnimationFrame;
			} else if (self.oRequestAnimationFrame) {
				self.requestAnimationFrame = self.oRequestAnimationFrame;
			} else {
				//console.log("RequestAnimationFrame not found.");
				self.requestAnimationFrame = function(callback) {
					setInterval(callback, 16);
				}
			}
		}
	
	}
	

	Scaffold.setState = function(state) {
		if (state!=null) {
			state = null;
		}
		Scaffold.state = state;
	}
	
	Scaffold.run = function() {
		var d =Date.now();
	    var elapsedTime = d-Scaffold.lastTime;
	    if (Scaffold.lastTime==0) elapsedTime = 16;
	    
	    Scaffold.timeScale = elapsedTime/16; //percentage based on 60 fps
	    Scaffold.lastTime = d;

	  
	    
	    Scaffold.currentFPS = (1000/elapsedTime + .5) | 0;
	    
	    
	    if (!Scaffold.paused) {
	
			var i = Scaffold.timers.length;
			while(i--) {
				Scaffold.timers[i].update(elapsedTime);
			}
		
		    if (Scaffold.state!=null) {
		    	Scaffold.state.update(elapsedTime);
		    	if (Scaffold.renderMode==1) {
		    		Scaffold.renderer.context.clearRect(0,0, Scaffold.camera.bounds.width, Scaffold.camera.bounds.height);
		    	} else {
		    		Scaffold.renderer.startRender();
		    	}
		    	Scaffold.state.render();	
		    }
	    }
	              
	   
	    requestAnimationFrame(Scaffold.run);
	};
	
	Scaffold.playSound = function(src) {
		this.loader.assets[src].play();
	};
	
	Scaffold.keyDown = function(e) {
		//if (e.keyCode >=37 && e.keyCode <=40) {
			Scaffold.keysDown[e.keyCode] = 1;
			
			/*
			 * Default keys:
			 *  "+ -" Volume control
			 *  "p" pause
			 */
			if (e.keyCode==189) {
				//volume down
				if (Sound.volume>0) {
					Sound.setVolume(Sound.volume-.1);
				}
			} else if (e.keyCode==187) {
				//volume up
				if (Sound.volume<1) {
					Sound.setVolume(Sound.volume+.1);
				}
			} if (e.keyCode==80) {
				Scaffold.paused = !Scaffold.paused;
			}	
		//} 
	}
	
	Scaffold.keyUp = function(e) {
		delete Scaffold.keysDown[e.keyCode];
	}
	
	Scaffold.gamepadConnected = function(e) {
		Scaffold.gamepads.push(e.gamepad);
	}

	Scaffold.gamepadDisconnected = function(e) {
		
	}
	
	Scaffold.collideSprites = function(a,b) {
		
	}
	
	Scaffold.gamepadDown = function(key) {
		
	}
	
	Scaffold.getOverlap = function(boundsA, boundsB) {
	
		var xBottomRight = Math.min(boundsB.x+boundsB.width, boundsA.x+boundsA.width);
		var xTopLeft = Math.max(boundsB.x,boundsA.x);
						
		var xOverlap = Math.max(0, xBottomRight - xTopLeft);
						
		var yBottomRight = Math.min(boundsB.y+boundsB.height, boundsA.y+boundsA.height);
		var yTopLeft = Math.max(boundsB.y, boundsA.y);

		var yOverlap = Math.max(0, (yBottomRight - yTopLeft));
		
		return {total : xOverlap * yOverlap, y:yOverlap, x:xOverlap};
	}

	Scaffold.resolveX = function(spA, spB, overlap) {
		
		var diffA = Math.abs(spA.x - spA.prevPos.x);
		var diffB = Math.abs(spB.x - spB.prevPos.x);
		var diffTotal = diffA + diffB;
		
		
		if (!spA.moveable || spA.locked.left) {
			spB.x = spA.x+spA.spriteWidth;
			spB.velocity.x *= -spB.bounce;
		} else if (!spB.moveable || spB.locked.right) {
			spA.x = spB.x - spA.spriteWidth;
			spA.velocity.x *= -spA.bounce;
		} else {			
			spA.x -= overlap.x*(diffB/diffTotal);
			spB.x += overlap.x*(diffA/diffTotal);
						
			var vA = spB.velocity.x;
			var vB = spA.velocity.x;
			var average = (vA + vB) /2;

			spA.velocity.x = average;
			spB.velocity.x = average;
		}
		
	}
	
	Scaffold.resolveY = function(spA, spB, overlap) {
		var diffA = Math.abs(spA.y - spA.prevPos.y);
		var diffB = Math.abs(spB.y - spB.prevPos.y);
		var diffTotal = diffA + diffB;
		
		if (!spA.moveable || spA.locked.top) {
			spB.y = spA.y+spA.spriteHeight;
			spB.velocity.y =0;
		} else if (!spB.moveable || spB.locked.bottom) {
			spA.y = spB.y - spA.spriteHeight;
			spA.velocity.y *= -spA.bounce;
			
		} else {
			
			spA.x -= overlap.y*(diffB/diffTotal);
			spB.x += overlap.y*(diffA/diffTotal);
								
			var vA = spB.velocity.y * ((spB.velocity.y>0)? 1: -1);
			var vB = spA.velocity.y * ((spA.velocity.y>0)? 1: -1);
			var average = (vA + vB) /2;

			spA.velocity.y = average * ((spA.velocity.y>0)?1:-1);
			spB.velocity.y = average * ((spA.velocity.y>0)?1:-1);
			
		}

	}
	
	//Collide Two sprites 
	Scaffold.collide = function(spA, spB) {
		if (spB.type == "Platform") {
			return Scaffold.collideReposition(spA,spB); //spB is a platform
		}
		
		var overlap = Scaffold.getOverlap(spA.getBounds(), spB.getBounds());
		spA.colliding = false; spB.colliding = false;

		if (overlap.total>0) {
			if (spA.solidCollide && spB.solidCollide) {
				var pp = spA.pseudoPhysics && spB.pseudoPhysics;
				var posA = {x: spA.x, y:spA.y};
				var posB ={x: spB.x, y: spB.y};
				
				if (spA.moveable && spB.moveable) { //both object can be moved during a collision
					
					var o = Scaffold.getOverlap(spA.getBounds(), spB.getBounds());
					//console.log(o);
					
					if (o.total>0) {
						if (spA.prevPos.y+spA.spriteHeight <= spB.prevPos.y+5 || spA.prevPos.y >= spB.prevPos.y+spB.spriteHeight ) {
							if (spA.y<spB.y) {
								Scaffold.resolveY(spA, spB, o);
							} else {
								Scaffold.resolveY(spB, spA, o);
							}
						} else {
							if (spA.x< spB.x) {
								Scaffold.resolveX(spA, spB, o);	
							} else {
								Scaffold.resolveX(spB, spA, o);
							}
							
						}
						
					}
				}
			}
			
			//Do A
			var e = {top:0, bottom:0, left:0, right:0, type:spB.type, obj:spB};
			spA.colliding = true; spB.colliding = true;
			if (spA.onCollide!=null) {
				e = Scaffold.setDirection(spB,spA,e);
				spA.onCollide(e);
			}
			
			//Do B
			if (spB.onCollide!=null) {
				e = {top:0, bottom:0, left:0, right:0, type:spA.type, obj:spA};
				e = Scaffold.setDirection(spA,spB,e);
				spB.onCollide(e);
			}
			
		}
	}
	
	Scaffold.min= function() {
		var i=arguments.length;
		while(i--) {
			if (arguments[0]>arguments[i]) {
				arguments[0] = arguments[i];
			}
		}
		return arguments[0];
	}
	
	Scaffold.max = function() {
		var i=arguments.length;
		while(i--) {
			if (arguments[0]<arguments[i]) {
				arguments[0] = arguments[i];
			}
		}
		return arguments[0];
	}
	
	//collide a sprite with a platform
	//steps through A x and y movement (like tilemap)
	Scaffold.collidePlatform= function(spA,spB) { //spB should be a platform object
	
		var oldX = spA.x;
		spA.x = spA.prevPos.x;
	
		var boundsA = spA.getBounds();
	
		boundsA.x = boundsA.x+spA.trim.right;
		boundsA.y = boundsA.y+spA.trim.top;
		boundsA.width = boundsA.width - spA.trim.right;
		boundsA.height = spA.spriteHeight - spA.trim.bottom;

	
		var overlap = Scaffold.getOverlap(boundsA, spB.getBounds());
	
		var e = {top:0, bottom:0, left:0, right:0, type:spB.type, obj:spB};
		var collided = 0;
		
		
		
		if (overlap.total>0) {
		
			
			if (spA.prevPos.y+spA.spriteHeight-spA.trim.bottom <= spB.prevPos.y) {
				spA.y = spB.y-spA.spriteHeight+spA.trim.bottom;
				
				spA.velocity.y=0;
				e.bottom = 1;
				collided = 1;
				spA.platform = spB;
			} else if (spA.prevPos.y+spA.trim.top >= spB.prevPos.y+spB.spriteHeight) {
				spA.y = spB.y + spB.spriteHeight-spA.trim.top;
			
				if (spA.velocity.y<0) { //prevent sticking to the bottom of the moving platform
					spA.velocity.y = 0;
				}
				e.top= 1;
				collided = 1;
				
			}
		}
		
		
		spA.x = oldX;
	
		
		overlap = Scaffold.getOverlap(spA.getBounds(), spB.getBounds());
		
		if (overlap.total > 0) {
			spA.velocity.x=0;
			if (spA.prevPos.x+spA.spriteWidth <= spB.prevPos.x) {
				spA.x = spB.x - spA.spriteWidth;
				e.right = 1;
				collided = 1;
			
			} else if (spA.prevPos.x>= spB.prevPos.x+spB.spriteWidth) {
				spA.x = spB.x+spB.spriteWidth;
				e.left = 1;
				collided = 1;
			}
		}
		
		
		if (collided && spA.onCollide!=null) {
			spA.onCollide(e);
		}
	}
	
	Scaffold.setDirection=function(a,b,event) {
		if (a.prevPos.x+a.spriteWidth<=b.prevPos.x) {
			event.left = 1;
		} else if (a.prevPos.x>=b.prevPos.x+b.spriteWidth) {
			event.right = 1;
		}
		if (a.prevPos.y+a.spriteHeight<=b.prevPos.y) {
			event.top = 1;
		} else if (a.prevPos.y>=b.prevPos.y+b.spriteHeight) {
			event.bottom = 1;
		}
		return event;
	}
	
	//Collide a sprite with a group
	Scaffold.collideGroup=function(sp,grp) {
			var objects = grp.quadTree.retrieve(sp);
			var i = objects.length;
		
			while (i--) {
				var obj = objects[i];
				Scaffold.collide(sp, obj);
			}
	}
	
	//collide two groups
	Scaffold.collideGroups = function(grpA, grpB) {
		var i = grpA.members.length;
		while (i--) {
			Scaffold.collideGroup(grpA.members[i],grpB);
		}
	}
	
	//collide a group with a group of platforms
	//second argument should be a group of platforms
	Scaffold.collideGroupPlatforms=function(grpA, grpB) {
		for(var i=0; i < grpA.members.length; i++) {
			var objects = grpB.quadTree.retrieve(grpA.members[i]);
			
			for (var j=0; j<objects.length; j++) {
				var obj = objects[j];
				Scaffold.collideReposition(grpA.members[i], obj);
			}
			
		}
	}
	
    window.addEventListener('keydown', Scaffold.keyDown, false);
    window.addEventListener('keyup', Scaffold.keyUp, false);
	
	
})();