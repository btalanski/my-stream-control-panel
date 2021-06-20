var express = require('express');
var router = express.Router();
var spawn = require('child_process').spawn;
var kill = require('tree-kill');
var axios = require('axios');

let ffmpeg;
let streamStatusInterval;

/* GET home page. */
router.post('/start', function (req, res, next) {
  const {
    serverUrl,
    serverMonitorUrl,
    audioDevice = 'hw:1,0',
    inputFormat = 'h264',
    inputVideoSize = '1280x720',
    inputFrameRate = 30,
    inputVideoDevice = '/dev/video0',
    outputPixFormat = 'yuv420p',
    outputVideoBitRate = 1024,
    outputAudioBitRate = 128
  } = req.body;
  console.log(req.body);
  if (!serverUrl) {
    res.status(401).send('Missing streaming server url.');
  }
  const args = [
    '-hide_banner',
    '-ar',
    '44100',
    '-ac',
    '2',
    '-f',
    'alsa',
    '-thread_queue_size',
    '1024',
    '-i',
    `${audioDevice}`,
    '-f',
    'v4l2',
    '-input_format',
    `${inputFormat}`,
    '-video_size',
    `${inputVideoSize}`,
    '-thread_queue_size',
    '1024',
    '-framerate',
    `${inputFrameRate}`,
    '-async',
    '1',
    '-i',
    `${inputVideoDevice}`,
    '-map_metadata',
    '-1',
    '-threads',
    '0',
    '-sn',
    '-pix_fmt',
    `${outputPixFormat}`,
    '-c:v',
    'h264_omx',
    '-b:v',
    `${outputVideoBitRate}k`,
    '-maxrate',
    `${outputVideoBitRate * 2}k`,
    '-bufsize',
    `${outputVideoBitRate * 4}k`,
    '-vsync',
    'vfr',
    '-level',
    '41',
    '-sc_threshold',
    '0',
    '-b:a',
    `${outputAudioBitRate}k`,
    '-c:a',
    'aac',
    '-g',
    `${inputFrameRate * 2}`,
    '-f',
    'mpegts',
    '-flush_packets',
    '0',
    `${serverUrl}`
  ];

  if (ffmpeg && ffmpeg.pid) {
    kill(ffmpeg.pid);
  }

  ffmpeg = spawn('ffmpeg', args);

  if (streamStatusInterval) {
    clearInterval(streamStatusInterval);
  }

  if (!!serverMonitorUrl) {
    streamStatusInterval = setInterval(() => {
      axios
        .get(serverMonitorUrl)
        .then((response) => {
          console.log(response.data);
          const { data } = response;
          const status =
            (data && data.publishers[Object.keys(data.publishers)[0]]) || null;
          res.io.emit('streaming_monitor_status', status);
        })
        .catch((error) => {
          // handle error
          console.log(error);
          clearInterval(streamStatusInterval);
        });
    }, 1000);
  }

  ffmpeg.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ffmpeg.stderr.on('data', (data) => {
    let msg = data.toString('utf-8') || '';
    if (msg.includes('frame=')) {
      // frame= 6213 fps= 30 q=-0.0 size= 27474kB time=00:03:27.04 bitrate=1087.1kbits/s dup=0 drop=5 speed=0.999x
      const parts = msg
        .replace(/\s+/g, ' ')
        .trim()
        .match(/[a-z=?[\s]*]*([\d\.:\-a-zA-Z\/]+)/gim);

      if (parts.length > 0) {
        const log = parts.reduce((entry, part) => {
          const [key, value] = part.replace(/\s+/g, '').trim().split('=');
          return {
            ...entry,
            [key]: value
          };
        }, {});
        // console.log(log);

        const { frame, fps, size, time, bitrate, speed } = log;
        res.io.emit('streaming_status', {
          isStreaming: true,
          status: { frame, fps, size, time, bitrate, speed }
        });
      }
    } else if (
      msg.match(
        /non-monotonous|h264_omx|lavfi|output #0|swscaler|avoption|stream #|input #|tbn|tbr/gi
      )
    ) {
      res.io.emit('streaming_status', {
        isStreaming: true,
        infoMsg: msg
      });
    } else {
      console.error(`stderr: ${data}`);
      res.io.emit('streaming_status', {
        isStreaming: false,
        error: true,
        errorMsg: `${data}`
      });
      clearInterval(streamStatusInterval);
    }
  });

  ffmpeg.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    res.io.emit('streaming_status', {
      isStreaming: false,
      error: true,
      errorMsg: `child process exited with code ${code}`
    });
    clearInterval(streamStatusInterval);
  });

  ffmpeg.on('exit', function (code, signal) {
    console.log(
      'child process exited with ' + `code ${code} and signal ${signal}`
    );
    res.io.emit('streaming_status', {
      isStreaming: false,
      error: true,
      errorMsg:
        'child process exited with ' + `code ${code} and signal ${signal}`
    });
    clearInterval(streamStatusInterval);
  });

  res.send('started');
});

router.post('/stop', function (req, res, next) {
  kill(ffmpeg.pid);
  res.send('stopped');
});

module.exports = router;
