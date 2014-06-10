(function() {
	
	function Sound(path, onComplete) {
		this.source = null;
		this.buffer = null;
		this.onComplete = onComplete; //todo:: change this
		
		var that = this;
		var req = new XMLHttpRequest();
		req.onload = function() {
			Sound.context.decodeAudioData(req.response, function(buffer) {
				//success
				that.buffer = buffer;
				that.onComplete(that);
			},
			function() {
				//error
				//TODO:: handle error
			});
		}
		req.open('GET', path, true);
		req.responseType = 'arraybuffer';

		req.send();
		
	}
	
	Sound.prototype = {
		play: function() {
			var source = Sound.context.createBufferSource();
			source.buffer = this.buffer;
			source.connect(Sound.context.destination); 
			source.start(0);
		}
	}
	
	self.Sound = Sound;

})();

Sound.context=null;

Sound.init = function() {
	try {
		self.AudioContext = window.AudioContext||window.webkitAudioContext;
 		Sound.context = new AudioContext();
 		return true;
 	} catch(e) {
 		return false;
 	}	 
}
