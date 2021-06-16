var express = require('express');
var router = express.Router();
const spawn = require('child_process').spawn
var kill = require('tree-kill');

let ffmpeg;

/* GET home page. */
router.post('/start', function(req, res, next) {

    const args = [
        '-hide_banner',
        '-ar', '44100',
        '-ac', '2',
        '-f', 'alsa',
        '-thread_queue_size', '1024',
        '-i', 'hw:1,0',
        '-f', 'v4l2',
        '-input_format', 'h264',
        '-video_size', '1280x720',
        '-thread_queue_size', '1024',
        '-framerate', '30',
        '-async', '1',
        '-i', '/dev/video0',
        '-map_metadata', '-1',
        '-threads', '0',
        '-sn',
        '-pix_fmt', 'yuv420p',
        '-c:v', 'h264_omx',
        '-b:v', '1024k',
        '-maxrate', '2048k',
        '-bufsize', '4096k',
        '-vsync', 'vfr',
        '-level', '41',
        '-sc_threshold', '0',
        '-b:a', '128k',
        '-c:a', 'aac',
        '-g', '60',
        '-f', 'mpegts',
        '-flush_packets', '0', 'srt://<host>:<port>?streamid=stream/live/irl'
    ];

    ffmpeg = spawn('ffmpeg', args)
 
    ffmpeg.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    
    ffmpeg.stderr.on('data', (data) => {
        let msg = data.toString('utf-8');
        if(msg.includes('frame=')){
            // frame= 6213 fps= 30 q=-0.0 size= 27474kB time=00:03:27.04 bitrate=1087.1kbits/s dup=0 drop=5 speed=0.999x
            const parts = msg.replace(/\s+/g, ' ').trim().match(/[a-z=?[\s]*]*([\d\.:\-a-zA-Z\/]+)/gmi);

            if(parts.length > 0){
                const log = parts.reduce((entry, part) => {
                    const [key, value] = part.replace(/\s+/g, '').trim().split('=');
                    return {
                        ...entry,
                        [key]: value
                    };
                }, {});
                console.log(log);
            }
        } else {
            console.error(`stderr: ${data}`);
        }
    });
    
    ffmpeg.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

    ffmpeg.on('exit', function (code, signal) {
        console.log(
            'child process exited with ' + `code ${code} and signal ${signal}`
        );
    });

    res.send('started');
});

router.post('/stop', function(req, res, next) {
    kill(ffmpeg.pid);
    res.send('stopped');
});

module.exports = router;
