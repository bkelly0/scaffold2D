#!/bin/bash
cat src/Scaffold.js src/Sprite.js src/Button.js src/AnimatedTile.js src/Camera.js src/Group.js src/ItemMap.js src/Loader.js src/ParticleEmitter.js src/Platform.js src/PlatformMap.js src/ProgressBar.js src/QuadTree.js src/Renderer.js src/RendererCanvas.js src/State.js src/TileMap.js src/Timer.js src/Sound.js src/AStarPathFind.js src/PathFindingProblem.js src/PriorityQueue.js > dist/Scaffold.cat.js
java -jar yuicompressor-2.4.8.jar --type js --line-break 200 --nomunge dist/Scaffold.cat.js -o dist/Scaffold2d.min.js
rm dist/Scaffold.cat.js
buildNumber=`git rev-list HEAD --count`
echo "Version: 1.0.$buildNumber"
sed -i "" "s/%buildNumber%/$buildNumber/g" dist/Scaffold2d.min.js
cp dist/Scaffold2d.min.js demos/quadTree/js/
cp dist/Scaffold2d.min.js demos/parallax/js/
cp dist/Scaffold2d.min.js demos/platforms/js/
cp dist/Scaffold2d.min.js demos/particles/js/
cp dist/Scaffold2d.min.js demos/animatedTiles/js/
cp dist/Scaffold2d.min.js demos/pathfinding/js/


