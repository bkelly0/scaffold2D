
	function PlatformMap(img) {
		ItemMap.call(this);
		this.spriteClassName = "Platform";
		this.image = img;
	}
	
	self.PlatformMap = PlatformMap;
	PlatformMap.prototype = ItemMap.prototype;

	
	PlatformMap.prototype.init = function(json, layer, image) {
		var that = this;
		PlatformMap.prototype.initWithCallback.call(this, json, layer, function(e) {
			//that.group.add(new window[this.spriteClassName](e.bounds.x, e.bounds.y, that.image, e.bounds.width, e.bounds.height, e.properties));
		});
	}
	
	//adds all the items at once
	PlatformMap.prototype.addAll = function() {
		var i=this.map.length;
		while(i--) {
			this.group.add(new window[this.spriteClassName](this.map[i].bounds.x, this.map[i].bounds.y, this.image, this.map[i].bounds.width, this.map[i].bounds.height, this.map[i].properties));

		}
	}
