const express = require('express')
const app = express();
const tmp = require('tmp');
var ffmpeg = require('fluent-ffmpeg');

app.get('/image', (req, resp) => {
    var file = './files/img/999.png';
    const snapshot = ffmpeg('rtmp://62.113.210.250/medienasa-live/ok-merseburg_high')
        .on('end', function (files) {
            const json = JSON.stringify({
                file: file,
                msg: 'success'
            });
            resp.send(json)
        })
        .on('error', function (err) {
            res.json({
                status: 'error',
                error: err.message
            });
        })
        .outputOptions(['-f image2', '-vframes 1', '-vcodec png', '-f rawvideo', '-s 320x240', '-ss 00:00:01'])
        .output(file)
        .run();
})

app.get('/video', (req, resp) => {
    const video = ffmpeg('rtmp://62.113.210.250/medienasa-live/ok-merseburg_high')
        .videoBitrate(1024)
        .fps(30)
        .videoBitrate('3000k')
        .videoCodec('libx264')
        .size('1280x720')
        .audioCodec('aac')
        .audioBitrate('128k')
        .on('progress', (progress) => console.log(progress.timemark))
        .format('mp4')
        .audioChannels(2)
        .duration(10)
        .addOption('-hls_list_size', 0)
        .addOption('-hls_time', 10)
        .on('end', function () {
            console.log('file has been converted succesfully');
            const json = JSON.stringify({
                video: '',
                duration: "10s",
                msg: 'success'
            });
            resp.send(json)
        })
        .on('error', function (err) {
            console.log('an error happened: ' + err.message);
            const json = JSON.stringify({
                video: '',
                duration: "10s",
                msg: 'error',
                note: err.message
            });
        })
        .save('./files/6.mp4');
})
app.listen(5555, () => {
    console.log('Server running 5555')
})