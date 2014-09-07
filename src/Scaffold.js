/*!

Scaffold2D 1.0.%buildNumber%

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
var RenderModes = {WEBGL:0, CANVAS:1};
var ScaleModes = {WEBGL:0, CANVAS:1}; //canvas is faster, but webgl looks better


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
	Scaffold.renderMode = RenderModes.WEBGL;
	Scaffold.scale = 1;
	Scaffold.scaleMode = ScaleModes.CANVAS;
	Scaffold.timeScale = 1;
	Scaffold.maxTimeScale = 2.5;
	Scaffold.soundAvailable = false;
	Scaffold.canvasFallback = true;
	Scaffold.nexState = null;
	
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
		

	  	if (Scaffold.scaleMode == ScaleModes.CANVAS && Scaffold.scale!=1) {
	  		//scale the canvas
	  		canvas.style.width = canvas.width + 'px';
	  		canvas.style.height = canvas.height + 'px';
	  		canvas.width = Math.round(canvas.width/2);
	  		canvas.height = Math.round(canvas.height/2);
	  		Scaffold.scale = 1; //don't use this value
	  	
	  	}

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
	
	//changes state, but lets the current state complete the update/render cycle
	Scaffold.setState = function(state) {
		Scaffold.nextState = state;
	}
	
	Scaffold.run = function() {
		if (Scaffold.nextState!=null) {
			Scaffold.state = Scaffold.nextState;
		}
		
		var d =Date.now();
	    var elapsedTime = d-Scaffold.lastTime;
	    if (Scaffold.lastTime==0) elapsedTime = 16.67;
	    
	    Scaffold.timeScale = elapsedTime/16.67; //percentage based on 60 fps
	    if (Scaffold.timeScale > Scaffold.maxTimeScale) {
	    	Scaffold.timeScale = Scaffold.maxTimeScale;
	    } else if (Scaffold.timeScale<1) {
	    	Scaffold.timeScale=1; //cap at 100%
	    }
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

	Scaffold.resolveX = function(spA, spB) {
		
		var diffA = spA.x - spA.prevPos.x;
		var diffB = spB.x - spB.prevPos.x;
		var diffTotal = Math.abs(diffA) + Math.abs(diffB);
		var overlap = 0;
		var tolerance = diffTotal + Scaffold.timeScale*2;
		
		var diffA = spA.x - spA.prevPos.x;
		var diffB = spB.x - spB.prevPos.x;
		var diffTotal = Math.abs(diffA) + Math.abs(diffB);
		var overlap = 0;
		var tolerance = diffTotal + Scaffold.timeScale*1;
		
		if (diffA > diffB) {
			overlap = spA.x + spA.spriteWidth - spB.x;
			if (overlap > tolerance) {
				return;
			}
		} else if (diffA < diffB) {
			overlap = spA.x - spB.spriteWidth - spB.x;
			if (-overlap > tolerance) {
				return;
			}
		} else {
			return;
		}
		
			
		if (diffA > diffB) {
			overlap = spA.x + spA.spriteWidth - spB.x;
			if (overlap > tolerance) {
				return;
			}
		} else if (diffA < diffB) {
			overlap = spA.x - spB.spriteWidth - spB.x;
			if (-overlap > tolerance) {
				return;
			}
		} else {
			return;
		}
		
		if (!spA.moveable || spA.locked.left) {
			spB.x += overlap;
			spB.velocity.x *= -spB.bounce;
		} else if (!spB.moveable || spB.locked.right) {
			spA.x -= overlap;
			spA.velocity.x *= -spA.bounce;
		} else {			
			spA.prevPos.x = spA.x;
			spB.prevPos.x = spB.x;
			spA.x -= overlap*.5;
			spB.x += overlap*.5;
						
			var vA = spB.velocity.x;
			var vB = spA.velocity.x;
			var average = (vA + vB) /2;

			spA.velocity.x = average;
			spB.velocity.x = average;
		}
		
		
	}
	
	Scaffold.resolveY = function(spA, spB) {
		var diffA = spA.y - spA.prevPos.y;
		var diffB = spB.y - spB.prevPos.y;
		var diffTotal = Math.abs(diffA) + Math.abs(diffB);
		var overlap = 0;
		var tolerance = diffTotal + Scaffold.timeScale*2;
		
		//console.log(diffA + " " + diffB);
		
		if (diffA > diffB) {
			overlap = spA.y + spA.spriteHeight - spB.y;
			if (overlap > tolerance) {
				return;
			}
		} else if (diffA < diffB) {
			overlap = spA.y - spB.y - spB.spriteHeight;
			if (-overlap > tolerance) {
				return;
			}
		} else {
			return;
		}
		if (!spA.moveable || spA.locked.top) {
			spB.y += overlap;
			spB.y = spA.y+spA.spriteHeight;
			spB.velocity.y *=-spB.bounce;
		} else if (!spB.moveable || spB.locked.bottom) {
			spA.y -= overlap;
			spA.velocity.y *= -spA.bounce;
			
		} else {
			
			spA.y -= overlap*.5;
			spB.y += overlap*.5;
								
			var vA = spB.velocity.y * ((spB.velocity.y>0)? 1: -1);
			var vB = spA.velocity.y * ((spA.velocity.y>0)? 1: -1);
			var average = (vA + vB) /2;

			spA.velocity.y = average * ((spA.velocity.y>0)?1:-1);
			spB.velocity.y = average * ((spA.velocity.y>0)?1:-1);
			
		}
	}
	
	//Collide Two sprites 
	Scaffold.collide = function(spA, spB) {
	
		var overlap = Scaffold.getOverlap(spA.getBounds(), spB.getBounds());
		spA.colliding = false; spB.colliding = false;
	
		if (overlap.total>0) {
			
			if (spA.solidCollide && spB.solidCollide) {
				Scaffold.resolveY(spA, spB);
				if (spA.prevPos.y != spA.y || spB.prevPos.y!=spB.prevPos.y) { //could be part of a series of objects
					Scaffold.resolveX(spA, spB);
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
	
    window.addEventListener('keydown', Scaffold.keyDown, false);
    window.addEventListener('keyup', Scaffold.keyUp, false);


