#!/bin/bash
cat src/Scaffold.js src/Sprite.js src/Button.js src/Camera.js src/Group.js src/ItemMap.js src/Loader.js src/ParticleEmitter.js src/Platform.js src/PlatformMap.js src/Platform.js src/ProgressBar.js src/QuadTree.js src/Renderer.js src/RendererCanvas.js src/State.js src/TileMap.js src/Timer.js > dist/Scaffold.cat.js
java -jar yuicompressor-2.4.8.jar --type js --line-break 200 --nomunge dist/Scaffold.cat.js -o dist/Scaffold.min.js
rm dist/Scaffold.cat.js
buildNumber=`git rev-list HEAD --count`
echo "Version: 1.0.$buildNumber"
sed -i "" "s/%buildNumber%/$buildNumber/g" dist/Scaffold.min.js



