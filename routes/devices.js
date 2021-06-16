var express = require('express');
var router = express.Router();
var v4l2camera = require("../node_modules/v4l2camera");


router.get('/', function(req, res, next) {
    var cam = new v4l2camera.Camera("/dev/video0");
    const formats = cam.formats;
    res.send(cam.formats.filter(format => format.formatName === "H264"));
});

router.get('/controls', function(req, res, next) {
    var cam = new v4l2camera.Camera("/dev/video0");
    const controls = cam.controls || [];
    res.send(controls);
});

module.exports = router;
