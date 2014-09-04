<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Scaffold2D Animated Tile Demo</title>
	<style type="text/css">
	 #glwarning {
	            background-color:#FF0000;
	            padding:10px 10px 10px 10px;
	            text-align:center;
	            display:none;
	            height:auto;
	        }
	</style>

  
  
    <script type="text/javascript" src="js/Scaffold2D.min.js"></script> 
    <script src="https://code.jquery.com/jquery-1.11.0.min.js?c=1" type="text/javascript"></script>
      <script src="js/DemoState.js?c=<?php print time(); ?>" type="text/javascript"></script> 



       <script src="js/Player.js?c=<?php print time(); ?>" type="text/javascript"></script> 


    <script>

            $(document).ready(function() {
                Scaffold.init(document.getElementById("canvasElement"));
                if (Scaffold.renderMode == RenderModes.CANVAS) {
                	$('#glwarning').css('display','block');
                }
                //load all assets here
                var assets = [
                    'images/tiles.png',
                    'map.json'
                ];
                Scaffold.loader = new Loader(assets, assetsLoaded);
            });
            
            function assetsLoaded() {
                //create state
                Scaffold.state = new DemoState();
                Scaffold.run();
            }
            
    </script>
</head>


<body>
	<div id="glwarning">Your browser does not support WebGL or it is disabled. ScaffoldJS is falling back to canvas render mode. Please enable WebGL for best performance. <a href="http://get.webgl.org/troubleshooting" target="_blank">http://get.webgl.org/troubleshooting</a></div>

    <canvas id="canvasElement" width="600" height="400" style="background-color:#333333;"></canvas>
    <p>To animate tiles, add these properties to the tile in the Tiled editor:<br/>
    	<img src="images/properties.jpg" alt="Tiled properties" /><br/>
    	For the "animation" property, provide a comma seperated list of the tile indexes making up the animation.</br>
    	For the "fps" property, provide a frames per second value.
    </p>
    
</body>
</html>
