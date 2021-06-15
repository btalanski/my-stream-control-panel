var express = require('express');
var router = express.Router();
var ffmpeg = require('fluent-ffmpeg');
var fs  = require('fs');
var path = require('path');

/* Store global ref so it can be killed later */ 
let command;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/control', function(req, res, next){
    command = ffmpeg()
        .input(path.resolve('test.mp4'))
        .inputOptions(['-re'])
        .videoCodec('libx264')
        .audioCodec('copy')
        .fps(30)
        .format('flv')
        .on('start', function() {
			console.log("Started!");
		})
        .on('progress', function(progress) {
            console.log(progress);
        })
		.on('error', function(err) {
			console.log("Error!");
			console.log(err);
		})
		.on('end', function() {
			console.log("Finished!");
		})
        .save("rtmp://server");
    res.send('test');
});

router.post('/stop', function(req, res, next){
    if(!!command){
        command.kill();
    }
    res.send('stopped');
});
module.exports = router;
