(function() {
	
	function PlatformMap(tWidth, tHeight,images, data, listener) {
		this.platforms = new Group();
		this.listener = listener;
		
		this.mapArray = data.split('\n');
			
		for (var i=0; i< this.mapArray.length; i++) {
				this.mapArray[i] = this.mapArray[i].split(",");
		}
	
		//find grouped tiles
		var currTiles = [];
		var row = 0;
		var col = 0;
		var startCol =-1;
		var startRow = -1;
		var endCol = -1;
		var x,y;
		for (var r=0; r<this.mapArray.length; r++) {
			for (var c=0;c<this.mapArray[r].length; c++) {
				
				if(this.mapArray[r][c]>0) {
					if (startCol==-1) {
						startCol=c;
						startRow = r;
						x = tWidth*startCol;
						y = tHeight*startRow;
					}
					if (currTiles[row]==undefined) {
						currTiles[row] = [];
					}
					currTiles[row].push(this.mapArray[r][c]);
					col++;
					this.mapArray[r][c] = 0;
					//console.log("first: " + r + " " + c);
				} else if (startCol>=0) {
					endCol = c;
					grouploop: if (r+1<this.mapArray.length) {
						for(var rr=r+1; rr<this.mapArray.length; rr++) {
							row++;
							for(var cc=startCol; cc<endCol;cc++) {
								if (this.mapArray[rr][cc]>0) {
									//console.log(rr + " " + cc);
									if (currTiles[row]==undefined) {
										currTiles[row]=[];
									}
									currTiles[row].push(this.mapArray[rr][cc]);
			
									this.mapArray[rr][cc]=0;
								} else {
									var p = new Platform(x,y,tWidth,tHeight,images,currTiles);
									p.id = this.platforms.members.length;
									if (listener!=null && listener.onPlatformAdded!=null) {
										listener.onPlatformAdded(p);
									}
									this.platforms.add(p);
									currTiles=[];
									startCol=-1;
									startRow=-1;
									endCol = -1;
									row = 0;
									break grouploop;
								}
							}
						}
					
					}
				}
			}
		}
	}
	
	PlatformMap.prototype = {
		render: function() {
			this.platforms.render();
		},
		
		update: function(t) {
			this.platforms.update(t);
		},
		
		collide: function(sp) {
			this.platforms.collide(sp);
		}
	}
	
	
	
	window.PlatformMap = PlatformMap;
	
})();
