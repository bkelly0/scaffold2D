(function() {
	/*
	 * Loads image, maps, and audio assets
	 * 
	 * Sound.js is required for audio assets: http://www.createjs.com/
	 * 
	 */
	function Loader(assetList, onComplete) {
		this.assets = [];
		this.assetList = assetList;
		this.assetList.that = this;
		
		this.count=0;
		this.onComplete = onComplete;
		
		var imageFormats = ['jpg','jpeg','png'];
		var textFormats = ['txt','csv'];
		
		
		var that = this;
		
		if (createjs!=undefined) {
			
			createjs.Sound.alternateExtensions = ["mp3"];
 			createjs.Sound.addEventListener("fileload", function(e) {
 				that.itemLoaded(e);
 			});
		}
	
		
		for (var i = 0; i< assetList.length; i++) {
			var asset = assetList[i];
			var ext = asset.substr(asset.indexOf(".")+1).toLowerCase();
			if (imageFormats.indexOf(ext)>=0) {
				//image
				this.assets[asset] = new Image();
				this.assets[asset].that = this;
				this.assets[asset].key = asset;
			
				this.assets[asset].onload = function(e) {
					console.log("Image Loaded: " + this.src);
					if (Scaffold.renderMode==0) {
						Scaffold.renderer.addTexture(this);
					}
					this.that.itemLoaded();

				}
			

				this.assets[asset].onloadprogress = function(e) {
					console.log(e);
				}
				this.assets[asset].src = asset;
			} else if (ext=="mp3") {
				createjs.Sound.registerSound(asset,asset);
			} else {
				this.assets[asset] = "";
				var type="text";
				if (ext=="json") {
					type = "json";	
				}
				(function(index, context) {
					$.ajax({
				        type: "GET",
				        url: asset,
				        dataType: type,
				        success: function(data) {
							context.count++;
							context.assets[index] = data;
							if (context.count==context.assetList.length) {
								context.onComplete();
							}
						} 
				     });
				})(asset, this);
			}
		}
	}

	Loader.prototype = {
		itemLoaded: function(e) {
			this.count++;
 			if (this.assetList.length==this.count) {
				this.onComplete();
			}
			
			if(e!=undefined && e.type=="fileload") {
				//audio asset
				this.assets[e.src] = e.src;
				createjs.Sound.setVolume(.5);
			}
		
		}
	}
	window.Loader = Loader;
	
})();
