# my-stream-control-panel

## Requirements
- FFMpeg installed and available on your PATH
- v4l-utils installed

### Installing v4l2camera
```
mkdir -p node_modules
cd node_modules
git clone git@github.com:sebakerckhof/node-v4l2camera.git v4l2camera
cd v4l2camera
git checkout fix/node12
npm install
cd ../..
```