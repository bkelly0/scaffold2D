(function() {
	
	function Hud() {
		Scaffold.data.numShells = 5;
	} 
	
	Hud.prototype = {
		
		render:function() {
			var x=20;
			
			var posArr = [];
			for(var i=0; i<Scaffold.data.life; i++) {
				//Scaffold.context.drawImage(Scaffold.loader.assets['images/heart.png'],x, 20);
				posArr[posArr.length] = {x: x, y:20};
				x+=45;
			}
			Scaffold.renderer.drawImage(Scaffold.loader.assets["images/heart.png"], posArr);
			
			x=20;
			posArr = [];
			for (var i=0; i<Scaffold.data.numShells; i++) {
				posArr[posArr.length] = {x:x, y:65};
				x+=30;
			}
			Scaffold.renderer.drawImage(Scaffold.loader.assets['images/shell.png'],posArr);
		}
	};
	
	window.Hud = Hud;
	
})();
