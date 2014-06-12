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
			this.source = Sound.context.createBufferSource();
			this.source.buffer = this.buffer;
			this.source.connect(Sound.gainNode);
			Sound.gainNode.connect(Sound.context.destination); 
			this.source.start(0);
		},
		
		stop: function() {
			this.source.noteOff(0);
		},
		
		loop: function() {
			var source = Sound.context.createBufferSource();
			source.buffer = this.buffer;
			source.connect(Sound.gainNode);
			Sound.gainNode.connect(Sound.context.destination); 
			source.loop = true;
			source.start(0);
		}
	}
	
	self.Sound = Sound;

})();

Sound.context=null;
Sound.gainNode=null;
Sound.volume=1;

Sound.init = function() {
	try {
		self.AudioContext = window.AudioContext||window.webkitAudioContext;
 		Sound.context = new AudioContext();
 		Sound.gainNode = Sound.context.createGain();
 		return true;
 	} catch(e) {
 		return false;
 	}	 
}

Sound.setVolume = function(vol) {
	if (vol>=0 && vol<=1) {
		Sound.volume = vol;
		Sound.gainNode.gain.value = vol;
	}
}


