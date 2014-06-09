(function() {
	
	function ItemMap() {
		this.map = null;
		this.group = new Group();
		
		this.spriteClassName = null;
		this.callback=null;
	}
	
	window.ItemMap = ItemMap;
	
	ItemMap.prototype = {
		//use to add objects via a callback function. Usefull for using an object layer for  multiple sprite types
		initWithCallback: function(json, layer, listener) {
			
			if (json.layers[layer].type!="objectgroup") {
				throw "ItemMap: json layer " + layer + " is not an objectgroup"; 
			}
			
			this.map = json.layers[layer].objects;
			this.callback = listener;
			
			//setup a cache to lookup gid width/height
			if (!json.gidCache) {
				json.gidCache = {};
				
				var i = json.tilesets.length;
				var total = 0;
				var gid = 0;
				
				while(i--) {
					gid = json.tilesets[i].firstgid;
					total = gid + (json.tilesets[i].imagewidth / json.tilesets[i].tilewidth) * (json.tilesets[i].imageheight/json.tilesets[i].tileheight);
					while(gid < total) {
						json.gidCache[gid] = {height: json.tilesets[i].tileheight, width: json.tilesets[i].tilewidth};
						gid++;
					} // end gid
				} //end i
			}
			
			
			//set bounds to check
			var i = this.map.length;
			while(i--) {
				this.map[i].bounds = {x: this.map[i].x, y: this.map[i].y-json.gidCache[this.map[i].gid].height, width: json.gidCache[this.map[i].gid].width, height: json.gidCache[this.map[i].gid].height};	
			}

		},
		//use to add the same type of sprite for each object
		initWithSprite: function(json, layer, spriteClassName) {
			this.map = json.layers[layer].objects;
			this.spriteClassName = spriteClassName;
		
			if (json.layers[layer].type!="objectgroup") {
				throw "ItemMap: json layer " + layer + " is not an objectgroup"; 
			}
			
			//find the tile width/height for checking the bounds
			var gid = this.map[0].gid;
			var i = json.tilesets.length;
			var tileCount = 0;
			var spWidth = 0;
			var spHeight = 0;
			
			while(i--) {
				tileCount = (json.tilesets[i].imagewidth / json.tilesets[i].tilewidth) * (json.tilesets[i].imageheight/json.tilesets[i].tileheight);
				if (gid>=json.tilesets[i].firstgid && gid< json.tilesets[i].firstgid+tileCount) {
					spWidth = json.tilesets[i].tilewidth;
					spHeight = json.tilesets[i].tileheight;
					break;
				}
			}
			
			//include the bounds in the map layer objects
			i = this.map.length;
			while(i--) {
				this.map[i].bounds = {x:this.map[i].x, y:this.map[i].y-spHeight, width:spWidth, height:spHeight};
			}
			
		},
		
		update: function(t) {
			
			var i=this.map.length;
			var overlap = 0;
			
			while(i--) {
				//console.log(i + " " + this.map.length);
				overlap = Scaffold.getOverlap(Scaffold.camera.bounds,this.map[i].bounds);
				if (overlap>0) {
					if (!this.callback) {
						this.group.add(new window[this.spriteClassName](this.map[i].bounds.x, this.map[i].bounds.y));
					} else {
						this.callback(this.map[i]);
					}
					this.map.splice(i,1);
				}
			}
			
			this.group.update(t);
		},
		
		render: function() {
			this.group.render();
		}
		
	}
	
})();
