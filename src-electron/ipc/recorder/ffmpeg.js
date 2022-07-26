import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'
import { sendMsgWindows } from '../index.js'

ffmpeg.setFfmpegPath(ffmpegPath)

export function webmToMkv(args) {
  ffmpeg(fs.createReadStream(args.tempFile))
    .clone()
    .on('start', () => {
      sendMsgWindows('file:convert', {
        comm: 'start',
        file: args.tempFile
      })
    })
    .on('progress', (progress) => {
      console.log(progress)
    })
    .on('error', (err) => {
      sendMsgWindows('file:convert', {
        comm: 'error',
        file: args.tempFile
      })
      console.log('error: ' + err)
    })
    .on('end', () => {
      sendMsgWindows('file:convert', {
        comm: 'end',
        file: args.tempFile
      })
      console.log('processing finished')
    })
    .output(args.encodedFile)
    .run()
}
