(function() {
	
	function RendererGL(canvas) {
		this.textures = [];
    	
	    this.gl = canvas.getContext("experimental-webgl");
	    if (!this.gl) return false;
	  
	    this.gl.viewportWidth = canvas.width;
	    this.gl.viewportHeight = canvas.height;
	    
	    //shader code
	    var shaderSrc = [];
	    shaderSrc[0] = "attribute vec4 aPosition;";
	    shaderSrc[1] = "varying vec2 vTexCoord;";
	    shaderSrc[2] = "uniform vec2 uResolution; uniform bool useImageTexture;";
	    shaderSrc[3] = "void main(void) {";
	    shaderSrc[4] = "    vTexCoord = aPosition.zw;vec2 zeroToOne = aPosition.xy / uResolution; vec2 zeroToTwo = zeroToOne * 2.0;vec2 clipSpace = zeroToTwo - 1.0;gl_Position.zw = vec2(1.0, 1.0);gl_Position.xy = vec2(clipSpace * vec2(1, -1));"
		shaderSrc[5] = "}";
		var shaderSrcStr = shaderSrc.join("\n");
		
		var vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
	    this.gl.shaderSource(vertexShader, shaderSrcStr);
 		this.gl.compileShader(vertexShader);
  		var cStatus = this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS);
 		if (!cStatus) {
 			alert("Failed to compile vertex shader");
 		}

		shaderSrc=[];
		shaderSrc[0]="precision mediump float;";
		shaderSrc[1]="varying vec2 vTexCoord;";
		shaderSrc[2]="uniform sampler2D sTexture; uniform bool useImageTexture; uniform vec4 uColor;";
		shaderSrc[3]="void main(void) {";
		shaderSrc[4]="    if (useImageTexture) {vec4 texColor;texColor = texture2D(sTexture, vTexCoord);gl_FragColor = texColor; }";
		shaderSrc[5]=" else { gl_FragColor = uColor; }"
		shaderSrc[6]="}";
		shaderSrcStr=shaderSrc.join("\n");
		
		var fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
	    this.gl.shaderSource(fragmentShader, shaderSrcStr);
 		this.gl.compileShader(fragmentShader);
  		cStatus = this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS);
 		if (!cStatus) {
 			alert("Failed to compile fragment shader");
 		}
 		

	    //normal texture program
	    this.program = this.gl.createProgram();
	    this.gl.attachShader(this.program, vertexShader);
	    this.gl.attachShader(this.program, fragmentShader);
	    this.gl.linkProgram(this.program);
	    this.gl.useProgram(this.program);
	    
	    this.program.positionAttribute = this.gl.getAttribLocation(this.program, "aPosition");
	    this.program.samplerUniform = this.gl.getUniformLocation(this.program, "sTexture");
	    this.program.useImageTextureUniform = this.gl.getUniformLocation(this.program,"useImageTexture");
	    this.program.colorUniform = this.gl.getUniformLocation(this.program,"uColor");

	    this.gl.enableVertexAttribArray(this.program.positionAttribute);
	

	  	// set the resolution
	  	this.gl.uniform2f(this.gl.getUniformLocation(this.program, "uResolution"), canvas.width/Scaffold.scale, canvas.height/Scaffold.scale);
		//set to use image
		this.gl.uniform1i(this.program.useImageTextureUniform, true);
	
	    this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
	    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	
	    this.gl.enable(this.gl.BLEND);
	    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
	    
	    this.buffer = this.gl.createBuffer();
	}
	
	RendererGL.prototype = {
		
		startRender:function() {
			//this.buffer = this.gl.createBuffer();
			this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
	    	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		},

		
		draw: function(pos, tex) {
		    //supplied with positioning data for the object and texture
		    this.gl.activeTexture(this.gl.TEXTURE0);

		    this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
		    
		  	this.gl.uniform1i(this.program.useImageTextureUniform, true);

		    
		    this.gl.uniform1i(this.program.samplerUniform, 0);
		    
		    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
		    
		    this.buffer.itemSize = 4;
		    this.buffer.numItems = pos.length/this.buffer.itemSize;
		
		
		    this.gl.bufferData(this.gl.ARRAY_BUFFER, pos, this.gl.STREAM_DRAW);
		    this.gl.vertexAttribPointer(this.program.positionAttribute, this.buffer.itemSize, this.gl.FLOAT, false, 0, 0);
		    
		    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.buffer.numItems);
		    
		    
		},
		
		drawLine: function(pos, color, lineWidth, fill) {
			var c = color || [1,1,1,1];
			var w = lineWidth || 1;
			var f = fill || false;
	
			this.gl.uniform4f(this.program.colorUniform, c[0], c[1], c[2], c[3]);
			this.gl.uniform1i(this.program.useImageTextureUniform, false);
			this.buffer.itemSize = 2;
			this.buffer.numItems = pos.length/this.buffer.itemSize;
			this.gl.lineWidth(w);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, pos, this.gl.STREAM_DRAW);
			this.gl.vertexAttribPointer(this.program.positionAttribute, this.buffer.itemSize, this.gl.FLOAT, false, 0, 0);
			
			if (!fill) {
				this.gl.drawArrays(this.gl.LINE_STRIP, 0, this.buffer.numItems);
			} else {
				this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.buffer.numItems);
			}
		},
		
		drawCircle: function(x,y,radius, numPoints, color, lineWidth) {
			var pos = [];
			var w = lineWidth || 1;
			for(r=0; r<6.28; r+=.2) {  // 360 degree radians
				pos[pos.length] = x + radius*Math.cos(r);
				pos[pos.length] = y + radius*Math.sin(r);
			}
			pos[pos.length] = pos[0];
			pos[pos.length] = pos[1];
			this.drawLine(new Float32Array(pos), color, w);	
		},
		
		drawRect: function(x,y,width,height,color,lineWidth) {
			var pos=[];
			pos[pos.length] =x;
			pos[pos.length] =y;
			pos[pos.length] =x + width;
			pos[pos.length] =y;
			pos[pos.length] =x + width;
			pos[pos.length] =y + height;
			pos[pos.length] =x;
			pos[pos.length] =y + height;
			pos[pos.length] =x;
			pos[pos.length] =y;
			
			this.drawLine(new Float32Array(pos), color, lineWidth);
		},
		
		drawFill: function(x,y,width,height,color) {
			var pos=[];
			pos[pos.length] =x;
			pos[pos.length] =y;
			
			pos[pos.length] =x + width;
			pos[pos.length] =y;

			pos[pos.length] =x;
			pos[pos.length] =y + height;
			pos[pos.length] =x + width;
			pos[pos.length] =y + height;
			
			this.drawLine(new Float32Array(pos), color, 1, true);
		},
		
		addTexture: function(img) {
			if(this.textures[img.src]!=null) {
        		 return this.textures[img.src];
		     } else {
		         var t = this.gl.createTexture();
		         this.gl.bindTexture(this.gl.TEXTURE_2D, t);
		         this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
		         this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
		        
		         this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
		         this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
		         this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);
		         this.textures[img.src] = t;
		         t.index = img.src;
		         console.log("Texture Created.");
		         return t;
		     }
		},
		
		renderSprite: function(sp) {
			this.draw(this.getRenderPositions(sp), this.textures[sp.images.src]);
		},
		
		renderGroup: function(grp) {
			//TODO: support multiple textures in a group
			
			var i = grp.members.length;
			
			if (!i) {
				return;
			}
			
		
			var obj = new Object();
			var lastVertex
			var index;
			
			while(i--) {
					//if they all share the same texture, they can be drawn at once
					
				if (grp.members[i].flashing && grp.members[i].currentFrame%2==1) {
					continue;
				}
				
				index = grp.members[i].texture.index;
				if (!obj[index]) {
					obj[index] = [];
				}
				
				var spos = this.getRenderPositions(grp.members[i]);
				
				//hidden connecting strip
				if (obj[index].length>0) {
					obj[index][obj[index].length]=obj[index][obj[index].length-4];
					obj[index][obj[index].length]=obj[index][obj[index].length-4];
					obj[index][obj[index].length]=0;
					obj[index][obj[index].length]=0;
					obj[index][obj[index].length]=spos[0];
					obj[index][obj[index].length]=spos[1];
					obj[index][obj[index].length]=0;
					obj[index][obj[index].length]=0;	
				}
				
				obj[index][obj[index].length] = spos[0]; obj[index][obj[index].length] = spos[1]; //vertex positions
				obj[index][obj[index].length] = spos[2]; obj[index][obj[index].length] = spos[3]; //texture positions
					
				obj[index][obj[index].length] = spos[4]; obj[index][obj[index].length] = spos[5];
				obj[index][obj[index].length] = spos[6]; obj[index][obj[index].length] = spos[7];
					
				obj[index][obj[index].length] = spos[8]; obj[index][obj[index].length] = spos[9];
				obj[index][obj[index].length] = spos[10]; obj[index][obj[index].length] = spos[11];
					
				obj[index][obj[index].length] = spos[12]; obj[index][obj[index].length] = spos[13];
				obj[index][obj[index].length] = spos[14]; obj[index][obj[index].length] = spos[15];

			} 
			for (var texSrc in obj) {
				this.draw(new Float32Array(obj[texSrc]), this.textures[texSrc]);
			}
		},
		
		getRenderPositions: function(sp) {
			
			var x1 = sp.x-Scaffold.camera.bounds.x;
			var y1 = sp.y-Scaffold.camera.bounds.y;
			var x2 = x1+sp.spriteWidth;
			var y2 = y1+sp.spriteHeight;

			if (sp.direction.x<0) {
				tx1 = sp.framePositions[sp.currentAnimation.frames[sp.currentFrame]].tx2; //flip horizontal
				tx2 =sp.framePositions[sp.currentAnimation.frames[sp.currentFrame]].tx1;
			} else {
				tx1 = sp.framePositions[sp.currentAnimation.frames[sp.currentFrame]].tx1;
				tx2 = sp.framePositions[sp.currentAnimation.frames[sp.currentFrame]].tx2;
			}
			
			//TODO: Vertical flipping

			return new Float32Array([
				x1, y1, tx1, sp.framePositions[sp.currentAnimation.frames[sp.currentFrame]].ty1,
				x2, y1, tx2, sp.framePositions[sp.currentAnimation.frames[sp.currentFrame]].ty1,
			    x1, y2, tx1, sp.framePositions[sp.currentAnimation.frames[sp.currentFrame]].ty2,
			    x2, y2, tx2, sp.framePositions[sp.currentAnimation.frames[sp.currentFrame]].ty2
			]);
			
		},
		
		//draws an image without any sprite data (good for HUD)
		//takes an array of x & y values: [{x:0, y:0}, {x:10,y:10}]
		drawImage: function(img, xyArr) {
			var pos = [];
			var x, y = 0;
			var i = xyArr.length;

			while(i--) {
				x = xyArr[i].x;
				y = xyArr[i].y;
				
				pos[pos.length] = x; 				pos[pos.length] =y;
				pos[pos.length] = 0; 				pos[pos.length] = 0;
				
				pos[pos.length] = x+img.width; 		pos[pos.length] = y;
				pos[pos.length] = 1; 				pos[pos.length] = 0;
				
				pos[pos.length] = x; 				pos[pos.length] = y + img.height;
				pos[pos.length] = 0; 				pos[pos.length] = 1;
				
				pos[pos.length] = x + img.width; 	pos[pos.length] = y+img.height;
				pos[pos.length] = 1; 				pos[pos.length] = 1;
				
				if (i>0) {
					//connecting strip
					pos[pos.length] = x + img.width;		pos[pos.length] = y+img.height;
					pos[pos.length] = 0;					pos[pos.length] = 0;
					pos[pos.length] = xyArr[i-1].x;			pos[pos.length] = xyArr[i-1].y;
					pos[pos.length] = 0;					pos[pos.length] = 0;
				}
			}
			
			this.draw(new Float32Array(pos), this.textures[img.src]);
		}	
	},
	
	
	self.RendererGL=RendererGL;
	
})();
