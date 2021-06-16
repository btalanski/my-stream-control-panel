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
        // .input('hw:1,0')
        // .inputOptions([
        //     '-ar 44100',
        //     '-ac 2',
        //     '-thread_queue_size 1024'
        // ])
        .input('/dev/video0')
        .inputOptions([
            '-f v4l2',
            '-input_format h264',
            '-thread_queue_size 1024',
            '-framerate 30',
            '-async 1'
        ])
        // .videoCodec('h264_omx')
        // .audioCodec('aac')
        // .fps(30)
        .outputOptions([
            '-c:v h264_omx',
	        '-b:v 1024k',
            '-b:a 128k',
            '-c:a aac',
	        '-g 60',
            '-f mpegts',
            "-flush_packets 0"
        ])
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
        .save("srt://192.168.2.114:1936?streamid=stream/live/irl");
    res.send('test');
});

router.post('/stop', function(req, res, next){
    if(!!command){
        command.kill();
    }
    res.send('stopped');
});
module.exports = router;
