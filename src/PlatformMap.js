(function() {
	
	function PlatformMap() {
		ItemMap.call(this);
	}
	
	self.PlatformMap = PlatformMap;
	PlatformMap.prototype = new ItemMap();
	
	PlatformMap.prototype.init = function(json, layer) {
		var that;
		PlatformMap.prototype.initWithCallback.call(this, json, layer, function(e) {
			
		});
	}
	
	//adds all the items at once
	PlatformMap.prototype.addAll = function() {
		var i=this.group.members.length;
		while(i--) {
			
		}
	}
	
})();
