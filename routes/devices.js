var express = require('express');
var router = express.Router();
var v4l2camera = require("../node_modules/v4l2camera");

/* GET home page. */
router.get('/', function(req, res, next) {
    var cam = new v4l2camera.Camera("/dev/video0");
    const formats = cam.formats;
    res.send(formats);
});

module.exports = router;
