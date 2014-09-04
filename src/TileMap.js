	
	function TileMap(tWidth, tHeight, images, data) {
		this.tileWidth = tWidth;
		this.tileHeight = tHeight;
		this.tileImages = images;
		this.mapArray = [];
		this.debug = false;
		this.listeners = [];
		this.debugRects = [];
		this.debugHitRects = [];
		this.width=0;
		this.height=0;
		this.tileAddedListeners=[];
		if (data!=null) {
			this.setMapData(data);
		}
		this.collideIndex = 3;
		this.emptyTile = null;
		this.parallax = 1;
		
		this.framePositions = [];
		var cx=0;
		var cy=0;
		
		this.lastRenderData;
		this.prevTiles = {firstCol:0, lastCol:0, firstRow:0, lastRow:0};
		this.lastStartPoint;
		this.currRenderIndexes = []; //a lookup for row/col render indexes
		this.lastPosition;
		
		this.renderData = [];
		this.numRenderRows;
		this.numRenderCols;
		this.translation = {x:0, y:0};
		this.renderOffset = {x:0, y:0};
		this.emptyRow = [];
		
		this.drawTranslated = false; //experimental for now
		//translated drawing using caching and won't be able to support animated tiles
		
		this.animatedTiles = {};
		this.animatedTileNums = []; //for quicker looping
			
		if (Scaffold.renderMode==1) {
			//canvas positions
			while(cy<this.tileImages.height) {
				while(cx<this.tileImages.width) {
					this.framePositions.push({x: cx, y:cy});
					cx+=this.tileWidth;
				}
				cx = 0;
				cy += this.tileHeight;
			}
		} else {
			//webgl texture coords
			var pixelWidth = 1/images.width;
			var pixelHeight = 1/images.height;
			while(cy<this.tileImages.height) {
				while(cx<this.tileImages.width) {
					this.framePositions.push({tx1: cx*pixelWidth, ty1:cy*pixelHeight,tx2:(cx+this.tileWidth)*pixelWidth, ty2: (cy+this.tileHeight)*pixelHeight});
					cx+=this.tileWidth;
				}
				cx = 0;
				cy += this.tileHeight;
			}
			console.log(this.framePositions);
			this.texture = Scaffold.renderer.textures[images.src];
		}
		
		
		TileMap.test = true;
			
	}
	
	
	TileMap.instances = [];
	
	TileMap.prototype = {	
		
		
		loadMap: function(file) {
				TileMap.instances[file] = this;
			    $.ajax({
			        type: "GET",
			        url: file,
			        dataType: "text",
			        success: this.mapLoaded 
			     });
		},
		
		setMapData: function(data) {
			//sets map from csv format (flixel format)
			this.mapArray = data.split('\n');
			
			for (var i=0; i< this.mapArray.length; i++) {
				this.mapArray[i] = this.mapArray[i].split(",");
			}
			
			this.width = this.mapArray[0].length * this.tileWidth;
			this.height = this.mapArray.length * this.tileHeight-this.tileHeight;
			
			this.numRenderCols
		},
		
		setDataFromJSON: function(dat) {
			this.mapArray = [];
			var row = 0;
			this.mapArray[0] = [];
			
			for(var i=0; i<dat.length; i++) {
				this.mapArray[row].push(dat[i]-1);

				if (this.mapArray[row].length==this.numCols && i!=dat.length-1) {
					row++;
					this.mapArray[row]= [];
				}
			}
			this.width = this.mapArray[0].length * this.tileWidth;
			this.height = this.mapArray.length * this.tileHeight;
			
			this.numRenderRows = Math.ceil(Scaffold.camera.bounds.height / this.tileHeight)+1;
			this.numRenderCols = Math.ceil(Scaffold.camera.bounds.width / this.tileWidth)+1;
			this.emptyRow = new Array(24*(this.numRenderCols));
			
		
		},
		
		//only needs called if using animated tiles
		update: function(t) {
			var i = this.animatedTileNums.length;
			while(i--){
				this.animatedTiles[this.animatedTileNums[i]].update(t);
			}
		},
		
		mapLoaded: function(data) {
			//this is in jquery ajax scope
			var that = TileMap.instances[this.url];
			that.mapArray = data.split('\n');
			
			for (var i=0; i< that.mapArray.length; i++) {
				that.mapArray[i] = that.mapArray[i].split(",");
			}
			
			that.width = that.mapArray[0].length * that.tileWidth;
			that.height = that.mapArray.length * that.tileHeight;
			
			
			for (var i=0; i < that.listeners.length; i++) {
				that.listeners[i]();
			}
		},
		
		onTileAdded: function(fnc) {
			this.tileAddedListeners.push(fnc);
		},
		
		addRowData: function(rowIndex, dataRowIndex, dataColIndex, colDiff) {
			var index = rowIndex*this.numRenderCols*24-8;
			if (index<0) index=0;
						
			var tileNum, x1, y1, x2, y2, tx1, tx2, ty1, ty2;
			var positions = this.renderData;
			var lastPos = {x:0,y:0};
			
			if (rowIndex>0) {
				lastPos.x = positions[index-4];
				lastPos.y = positions[index-3];
			}
			
			//when the column is also changed
			dataColIndex += colDiff;
			var colShift = colDiff*this.tileWidth;
			
			for (var i=0; i< this.numRenderCols; i++) {
				tileNum = this.mapArray[dataRowIndex][dataColIndex + i];
				
				if (tileNum>=0 && tileNum!=this.emptyTile && tileNum < this.framePositions.length) {
					//positions
					x1 = this.tileWidth*i + this.renderOffset.x+colShift;
					y1 = this.tileHeight*rowIndex + this.renderOffset.y;
					x2 = x1+this.tileWidth;
					y2 = y1+this.tileHeight;
					//texture
					tx1 =this.framePositions[tileNum].tx1; 
					ty1 =this.framePositions[tileNum].ty1;
					tx2 =this.framePositions[tileNum].tx2; 
					ty2 = this.framePositions[tileNum].ty2;
				} else {
					x1 = y1 = x2 = y2 = tx1 = tx2 = ty1 = ty2 = 0;
				}
				

				if (rowIndex!=0 && i!=0 || i>0 || rowIndex>0) {
					positions[index++]= lastPos.x;
					positions[index++]= lastPos.y;
					positions[index++]= 0;
					positions[index++]= 0;
					positions[index++]= x1;
					positions[index++]= y1;
					positions[index++]= 0;
					positions[index++]= 0;
				} 
					
					positions[index++]=x1; 
					positions[index++]=y1;
					positions[index++]=tx1;
					positions[index++]= ty1;
							
					positions[index++]=x2; 
					positions[index++]=y1;
					positions[index++]=tx2;
					positions[index++]=ty1;
						
					positions[index++]=x1; 
					positions[index++]=y2;
					positions[index++]=tx1;
					positions[index++]=ty2;

					positions[index++]=x2; 
					positions[index++]=y2;
					positions[index++]=tx2;
					positions[index++]=ty2;
					lastPos.x = x2;
					lastPos.y = y2;
			
			}
			this.renderData = positions;
		},
		
		addColumnData: function(colIndex, dataRowIndex, dataColIndex) {
			var index, tileNum, x1, y1, x2, y2, tx1, tx2, ty1, ty2;
			var lastPos = {x:0, y:0};
			var positions = this.renderData;

			
			index = 24*colIndex-8;
			if (index<0) index = 0;
			for (var i = 0; i<this.numRenderRows; i++) {		
				if (this.mapArray[dataRowIndex+i]==undefined) {
					//console.log(dataRowIndex+i);
					//console.log(this.mapArray);
				}
				if (dataRowIndex+i<this.mapArray.length) {
					tileNum = this.mapArray[dataRowIndex+i][dataColIndex];
				} else {
					tileNum = 0;
				}
				if (dataColIndex==0 && i==0) {
					index = 0;
				} 
				if (tileNum>=0 && tileNum!=this.emptyTile && tileNum < this.framePositions.length) {
					//positions
					x1 = this.tileWidth*colIndex + this.renderOffset.x;
					y1 = this.tileHeight*i + this.renderOffset.y;
					x2 = x1+this.tileWidth;
					y2 = y1+this.tileHeight;
					//texture
					tx1 =this.framePositions[tileNum].tx1; 
					ty1 =this.framePositions[tileNum].ty1;
					tx2 =this.framePositions[tileNum].tx2; 
					ty2 = this.framePositions[tileNum].ty2;
				} else {
					x1 = y1 = x2 = y2 = tx1 = tx2 = ty1 = ty2 = 0;
				}
								
				lastPos.x = positions[index-4];
				lastPos.y = positions[index-3];
				
				if (index-4>=0) {
					positions.splice(index,0, lastPos.x, lastPos.y, 0,0,x1,y1,0,0,x1,y1,tx1,ty1,x2,y1,tx2,ty1,x1,y2,tx1,ty2,x2,y2,tx2,ty2);
					if (index+25 < positions.length) {
						positions[index+24] = x2;
						positions[index+25] = y2;
					}
				} else {
					positions.splice(index,0,
						x1,y1,tx1,ty1,
						x2,y1,tx2,ty1,
						x1,y2,tx1,ty2,
						x2,y2,tx2,ty2,
						x2,y2,0,0,x2+this.tileWidth, y2,0,0);
				
				}
				if (index==0) {
					index-=8;
				} 
				index+=24*this.numRenderCols;
			}
			this.renderData = positions;
		},
		
		//Still working on this
		renderTranslated: function() {
			var rowAdded = false;
			var colAdded = false;
			if (this.mapArray.length==0) {
				return;
			}
			
			var firstRow = Scaffold.camera.bounds.y*this.parallax / this.tileHeight >> 0; //bitwise floor
			var lastRow = Math.ceil(firstRow + Scaffold.camera.bounds.height / this.tileHeight)+1;
			if (lastRow > this.mapArray.length) {
				lastRow = this.mapArray.length;
			}
			
			var firstCol =Scaffold.camera.bounds.x*this.parallax / this.tileWidth >> 0;
			var lastCol = Math.ceil(firstCol + Scaffold.camera.bounds.width / this.tileWidth)+1;
			if (lastCol>this.mapArray[0].length) {
				lastCol = this.mapArray[0].length;
			}
			
			
			
			if (firstRow < 0) firstRow = 0;
			
			if (firstCol < 0) firstCol = 0;
			
			
			if (Scaffold.renderMode==1) {
				//Canvas
				for (var i=firstRow; i< lastRow; i++) {
					for (var j=firstCol; j<lastCol;j++) {
						tileNum = this.mapArray[i][j];
						if (this.animatedTiles[tileNum]) {
							tileNum = this.animatedTiles[tileNum].tileFrame; //animated tile
						}
						Scaffold.renderer.context.drawImage(this.tileImages, this.framePositions[tileNum].x , this.framePositions[tileNum].y,
								this.tileWidth, this.tileHeight, 
								this.tileWidth*j-(Scaffold.camera.bounds.x*this.parallax), this.tileHeight*i-(Scaffold.camera.bounds.y*this.parallax),this.tileWidth,this.tileHeight);
					}
				}
				
			} else {
				
				//GL

				if (this.renderData.length==0) {
					//all all of the tiles
					
					for (var i=0; i<this.numRenderRows;i++) {
						this.addRowData(i, firstRow+i, firstCol,0);
					}
					
				} else {
					//check for row changes
					var rowDiff = this.prevTiles.firstRow - firstRow;
					var colDiff = this.prevTiles.firstCol - firstCol;
					if (rowDiff>0) {
						this.renderOffset.y -= this.tileHeight;
					} else if (rowDiff<0) {
						this.renderOffset.y += this.tileHeight;
					}
					if (colDiff>0) {
						this.renderOffset.x -= this.tileWidth;
					} else if (colDiff<0) {
						this.renderOffset.x += this.tileWidth;
					}

					if (rowDiff>0) {
						//remove bottom row
						var index = (this.numRenderRows-1)*this.numRenderCols*24-8;
						this.renderData.splice(index,24*this.numRenderCols);
						var empty = new Array(24*(this.numRenderCols));
						this.renderData = empty.concat(this.renderData);
						this.addRowData(0, firstRow, firstCol, colDiff);
						rowAdded = true;
					} else if (rowDiff<0) {	
						//remove top row
						this.renderData.splice(0,24*this.numRenderCols); //no -8, need to take the connecting strip from the new first element
						//add new bottom row
						this.addRowData(this.numRenderRows-1, lastRow-1, firstCol, colDiff);
						rowAdded = true;
					}

					if (colDiff<0) {
						//remove first col
						var index = 0;
						var diffX = 0;
						for (var i=0; i<this.numRenderRows; i++) {
							if (i==0) {
								this.renderData.splice(index,24);
								index=i*this.numRenderCols*24-8;
							} else {
								index+= this.numRenderCols*24-24;
								this.renderData.splice(index,24);
							}
						}
						this.addColumnData(this.numRenderCols-1,firstRow, lastCol-1);
						colAdded = true;
					} else if (colDiff>0) {

						//remove last col
						var index = (this.numRenderCols-1)*24-8;
						for (var i=0; i<this.numRenderRows; i++) {
							this.renderData.splice(index,24);
							index+=this.numRenderCols*24-24;
						}
						this.addColumnData(0,firstRow, firstCol);
						colAdded = true;

					}
					
				
				}
				var diffY = 0;
				var diffX = 0;	

				diffX = this.tileWidth * (firstCol - Scaffold.camera.bounds.x*this.parallax / this.tileWidth);
				diffY = this.tileHeight * (firstRow - Scaffold.camera.bounds.y*this.parallax / this.tileHeight);
				this.translation.x = -(this.renderOffset.x-diffX)/Scaffold.camera.bounds.width;
				this.translation.y = (this.renderOffset.y-diffY)/Scaffold.camera.bounds.height;
							
				Scaffold.renderer.draw(new Float32Array(this.renderData), this.texture, this.translation);
				
				this.prevTiles.firstRow = firstRow;
				this.prevTiles.lastRow = lastRow;
				this.prevTiles.firstCol = firstCol;
				this.prevTiles.lastCol = lastCol;
			}
			

		},
		
		render: function() {

			if (this.mapArray.length==0) {
				return;
			}
			
			if (this.drawTranslated) {
				this.renderTranslated();
			}
			
			var x, y, tileNum = 0;
			var t = this;
			
			var firstRow = Scaffold.camera.bounds.y*this.parallax / this.tileHeight >> 0; //bitwise floor
			var lastRow = Math.ceil(firstRow + Scaffold.camera.bounds.height / this.tileHeight)+1;
			if (lastRow > t.mapArray.length) {
				lastRow = t.mapArray.length;
			}
			
			var firstCol =Scaffold.camera.bounds.x*this.parallax / this.tileWidth >> 0;
			var lastCol = Math.ceil(firstCol + Scaffold.camera.bounds.width / this.tileWidth)+1;
			if (lastCol>t.mapArray[0].length) {
				lastCol = t.mapArray[0].length;
			}
			
			
			if (firstRow < 0) firstRow = 0;
			
			if (firstCol < 0) firstCol = 0;
			
			var positions =[];

				
			//this.currRenderIndexes = [];
			for (var i=firstRow; i< lastRow; i++) {
				currRow = i;
				this.currRenderIndexes[currRow] = [];
				
				for (var j=firstCol; j<lastCol;j++) {
					tileNum = t.mapArray[i][j];
					
					if (this.animatedTiles[tileNum]) {
						tileNum = this.animatedTiles[tileNum].tileFrame; //animated tile
					}
					
					for(var k=0;k<this.tileAddedListeners.length;k++) {
						this.tileAddedListeners[k]({'row':i, 'col':j});
					}
					
					if (!this.lastStartPoint)
						this.lastStartPoint = {x:t.tileWidth*j-(Scaffold.camera.bounds.x*this.parallax), y: t.tileHeight*i-(Scaffold.camera.bounds.y*this.parallax) };
					
					if (tileNum>=0 && tileNum!=this.emptyTile && tileNum < this.framePositions.length) {
						if (Scaffold.renderMode==1) {
							//canvas
							Scaffold.renderer.context.drawImage(t.tileImages, this.framePositions[tileNum].x , this.framePositions[tileNum].y,
								t.tileWidth, t.tileHeight, 
								t.tileWidth*j-(Scaffold.camera.bounds.x*this.parallax), t.tileHeight*i-(Scaffold.camera.bounds.y*this.parallax),t.tileWidth,t.tileHeight);
						} else {
							//webgl
							var x1 = t.tileWidth*j-(Scaffold.camera.bounds.x*this.parallax);
							var y1 = t.tileHeight*i-(Scaffold.camera.bounds.y*this.parallax);
							var x2 = x1+this.tileWidth;
							var y2 = y1+this.tileHeight;
														
							//connecting strip
							if (this.lastPosition) {
								positions[positions.length]= this.lastPosition.x;
								positions[positions.length]= this.lastPosition.y;
								positions[positions.length]= 0;
								positions[positions.length]= 0;
								positions[positions.length]= x1;
								positions[positions.length]= y1;
								positions[positions.length]= 0;
								positions[positions.length]= 0;
							}
							
							this.currRenderIndexes[currRow][this.currRenderIndexes[currRow].length] = positions.length; //make it easier to look up indexes for rows/cols if needed
							
							positions[positions.length]=x1; 
							positions[positions.length]=y1;
							positions[positions.length]=this.framePositions[tileNum].tx1; 
							positions[positions.length]= this.framePositions[tileNum].ty1;
							
							positions[positions.length]=x2; 
							positions[positions.length]=y1;
							positions[positions.length]=this.framePositions[tileNum].tx2; 
							positions[positions.length]= this.framePositions[tileNum].ty1;
						
							positions[positions.length]=x1; 
							positions[positions.length]=y2;
							positions[positions.length]=this.framePositions[tileNum].tx1; 
							positions[positions.length]= this.framePositions[tileNum].ty2;

							positions[positions.length]=x2; 
							positions[positions.length]=y2;
							positions[positions.length]=this.framePositions[tileNum].tx2; 
							positions[positions.length]= this.framePositions[tileNum].ty2;
							
							this.lastPosition = {x: x2, y:y2};
							
						} //end else
					
					} 
				} 
				currRow ++;
			} //end outer loop
			if (Scaffold.renderMode==0) {
				Scaffold.renderer.draw(new Float32Array(positions) ,this.texture, 0);
				this.lastRenderData = positions;
			}

		},
		
		getOverlap:function(sp, tileBounds) {
			
				var xBottomRight = Math.min(sp.x+sp.spriteWidth-sp.trim.right, tileBounds.x+this.tileWidth);
				var xTopLeft = Math.max(sp.x+sp.trim.left ,tileBounds.x);
				
						
				var xOverlap = Math.max(0, xBottomRight - xTopLeft);
	
				var yBottomRight = Math.min(sp.y+sp.spriteHeight-sp.trim.bottom, tileBounds.y+this.tileHeight);
				var yTopLeft = Math.max(sp.y+sp.trim.top, tileBounds.y);
						
				var yOverlap = Math.max(0, (yBottomRight - yTopLeft));
				return overlap = xOverlap * yOverlap;
		},
		
		collideGroup: function(grp) {
			var i = grp.members.length;
			while(i--) {
				this.collide(grp.members[i]);
			}
		},
		
		collide:function(sp) {
			if (this.mapArray.length==0) {
				return null;
			}
			
			if (sp.prevPos.x!=sp.x) {
				sp.locked.right = 0;
				sp.locked.left = 0;
			} 
			if (sp.prevPos.y!=sp.y) {
				sp.locked.top = 0;
				sp.locked.bottom = 0;
			}
			//console.log(this.mapArray[0].length);
			
			//check surrounding tiles
			var t1 = this.getTileAt(sp.x, sp.y);
			var t2 = this.getTileAt(sp.x + sp.spriteWidth, sp.y); //top right corner
			var t3 = this.getTileAt(sp.x, sp.y + sp.spriteHeight); //bottomn corner
			
			//TODO: something about this
			if (t1==null || t2==null || t3==null) {
				return;
			}
			
			var startRow = t1.row;
			var startCol = t1.column;
	
			var details = [];
			var spMidX = sp.x + sp.spriteWidth/2;
			
			
			var spCenter = {x: sp.x + sp.spriteWidth, y: sp.y + sp.spriteHeight};
			
			var increment = 1;
			
			if (sp.velocity.x<0) {
				//check right to left
				increment = -1;	
				startCol = t2.column;
			}
		
		
			for (var i = startRow; i<=t3.row; i++) {
			
				var j = startCol;	
				//for (var j = startCol; j <= t2.column; j=j+increment) {
				while((increment==1 && j<=t2.column) || (increment==-1 && j>=t1.column)) {
					var currTile = this.mapArray[i][j];
					var tileBounds = {y: i*this.tileHeight, x:j*this.tileWidth, top: i*this.tileHeight, bottom: i*this.tileHeight+this.tileHeight, left: j*this.tileWidth, right: j*this.tileWidth+this.tileWidth};
					var event = {top:0, bottom:0, left:0, right:0, tileId: currTile, type: 'map', velocity:{x:sp.velocity.x, y:sp.velocity.y}};
					

					
					if (currTile>=this.collideIndex) {
						
						var oldY = sp.y;
						var oldX = sp.x;
					
						if (sp.prevPos.x!=null) {
							sp.x = sp.prevPos.x;  	//check y first.. so undo x
						}
						var overlap = this.getOverlap(sp, tileBounds);
						if (overlap>0) {
							event = this.adjustY(tileBounds, sp, event);
						}
						
					    //now try x
						sp.x = oldX; //move x into position
						
						overlap = this.getOverlap(sp, tileBounds);
						if (overlap>0) {
							event = this.adjustX(tileBounds, sp, event); //adjust x if needed
						}
						
						var wasCollision = (event.left | event.right | event.top | event.bottom);
						
						if (this.debug) {
							if (wasCollision) {
								this.debugHitRects.push(tileBounds);
							} else {
								this.debugRects.push(tileBounds);
							}
						}
						
						if (sp.onCollide!=undefined && wasCollision) {
							sp.onCollide(event);
						}
						
						
				
					} else if (this.debug) {
						this.debugRects.push(tileBounds);
					}
					j+=increment;
				}
				
		
			}
			
			
			//console.log("From: " + startRow +"," + startCol + "TO: " + t3.row +","+t2.column);
		},
		
		adjustY: function(tileBounds, sp, e) {
						
						if (sp.prevPos.y+sp.spriteHeight-sp.trim.bottom <= tileBounds.y+this.tileWidth/2 ) {
							sp.y = tileBounds.top-sp.spriteHeight+sp.trim.bottom;
							sp.velocity.y=0;
							e.bottom = 1; //bottom of sprite
							sp.locked.bottom = 1;
						} else if (sp.prevPos.y + sp.trim.top >= tileBounds.y+this.tileHeight) {
							sp.y = tileBounds.y + this.tileHeight-sp.trim.top;
							e.top = 1;
							sp.velocity.y = 0;
							sp.historyY = -1;
							sp.locked.top = 1;
						} 
						return e;
		},
		
		adjustX: function(tileBounds, sp, e) {
						if (sp.prevPos.x+sp.trim.left >= tileBounds.x+(this.tileWidth/2)) {
							sp.x = tileBounds.x + this.tileWidth-sp.trim.left;
							e.left = 1;
							sp.velocity.x = 0;
							sp.locked.left = 1;
						} else if (sp.prevPos.x+sp.spriteWidth-sp.trim.right <= tileBounds.x+(this.tileWidth/2)) {
							sp.x = tileBounds.x - sp.spriteWidth+sp.trim.right;
							e.right = 1;
							sp.velocity.x = 0;
							sp.locked.right = 1;
						} 
					
						return e;

		},	
		
		renderDebug: function() {
			if (Scaffold.renderMode==1) {
				for (var i = 0; i<this.debugRects.length; i++) {
					Scaffold.context.beginPath();
					Scaffold.context.lineWidth="1";
					Scaffold.context.strokeStyle="red";
					Scaffold.context.rect(this.debugRects[i].x-Scaffold.camera.bounds.x, this.debugRects[i].y-Scaffold.camera.bounds.y, this.tileWidth, this.tileHeight);
					Scaffold.context.stroke();
				}
				for (var i = 0; i<this.debugHitRects.length; i++) {
					Scaffold.context.beginPath();
					Scaffold.context.lineWidth="1";
					Scaffold.context.strokeStyle="yellow";
					Scaffold.context.rect(this.debugHitRects[i].x-Scaffold.camera.bounds.x, this.debugHitRects[i].y-Scaffold.camera.bounds.y, this.tileWidth, this.tileHeight);
					Scaffold.context.stroke();
				}
			} else {
				for (var i = 0; i<this.debugRects.length; i++) {
					Scaffold.renderer.drawRect(this.debugRects[i].x-Scaffold.camera.bounds.x, this.debugRects[i].y-Scaffold.camera.bounds.y, this.tileWidth, this.tileHeight,[1,1,1,1],1);
				}
				for (var i = 0; i<this.debugHitRects.length; i++) {
					Scaffold.renderer.drawRect(this.debugHitRects[i].x-Scaffold.camera.bounds.x, this.debugHitRects[i].y-Scaffold.camera.bounds.y, this.tileWidth, this.tileHeight,[255,0,0,1],4);

				}
			}
			

			this.debugRects = [];
			this.debugHitRects = [];
			this.dRects = [];
				
		},
		
		getTileAt: function(x,y) {
			if (this.mapArray.length==0) {
				return null;
			}
			var r = Math.floor(y/this.tileHeight);
			var col = Math.floor(x/this.tileWidth);
			var ret = {};
			ret.row = r;
			ret.column = col;
			if (r>=0 && r<this.mapArray.length && col < this.mapArray[r].length) {
				ret.tileId = this.mapArray[r][col];
			} else {
				ret = null;
			}
		
			return ret;
		},
		
		
		addListener: function(func) {
			this.listeners.push(func);
		},
		
		destroy: function() {
			this.listeners = null;
			this.tileAddedListeners = null;
		}
		
	}
	
	//create map object from Tiled json export
	//TODO: update the constructor to do this instead
	TileMap.newFromJSON = function(json, images, layer) {
		var map = new TileMap(json.tilewidth,json.tileheight, images, null);
		map.numCols = json.layers[layer].width;
		map.numRows = json.layers[layer].height;
		
		//look for animated tiles		
		var src = images.src;
		var i = json.tilesets.length;
		while(i--) {
			if (src.indexOf(json.tilesets[i].image)>0) {
				for(var f in json.tilesets[i].tileproperties) { //is there a faster way?
					if (json.tilesets[i].tileproperties[f].animation) {
						map.animatedTiles[f] = new AnimatedTile(json.tilesets[i].tileproperties[f].animation.split(','),json.tilesets[i].tileproperties[f].fps);
						map.animatedTileNums[map.animatedTileNums.length] = f;
					}
				}
				break;
			}
		}
		console.log(map.animatedTiles);
		console.log(map.animatedTiles);
		map.setDataFromJSON(json.layers[layer].data);
		return map;
	}
	
	self.TileMap = TileMap;

