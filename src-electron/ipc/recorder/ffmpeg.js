import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'
// import ffmpegPath from 'ffmpeg-static'
import { sendMsgWindows } from '../index.js'
const FfmpegPath = require('ffmpeg-static').replace(
  'app.asar',
  'app.asar.unpacked'
)
ffmpeg.setFfmpegPath(FfmpegPath)

export function webmToMkv(args) {
  ffmpeg(fs.createReadStream(args.tempFile))
    .clone()
    .on('start', () => {
      console.log(`Converting start: ${args.tempFile}`)
      sendMsgWindows('file:convert', {
        comm: 'start',
        file: args.tempFile
      })
    })
    .on('progress', (progress) => {
      console.log(progress)
    })
    .on('error', (err) => {
      console.error(`Converting error: ${err}`)
      sendMsgWindows('file:convert', {
        comm: 'error',
        file: args.tempFile
      })
    })
    .on('end', () => {
      console.log(`Converting end: ${args.encodedFile}`)
      sendMsgWindows('file:convert', {
        comm: 'end',
        file: args.tempFile
      })
    })
    .output(args.encodedFile)
    .run()
}
