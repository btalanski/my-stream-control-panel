var express = require('express');
var router = express.Router();
var v4l2camera = require('../node_modules/v4l2camera');

router.get('/', function (req, res, next) {
  var cam = new v4l2camera.Camera('/dev/video0');
  const formats = (cam.formats || [])
    .filter((format) => format.formatName === 'H264')
    .filter((format) => format.interval.denominator >= 24);
  const controls = cam.controls || [];
  res.send({ formats, controls });
});

module.exports = router;
