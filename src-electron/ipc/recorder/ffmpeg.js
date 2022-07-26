import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'
import { sendMsgWindows } from '../index.js'
import { logger } from '../../logger'

ffmpeg.setFfmpegPath(ffmpegPath)

export function webmToMkv(args) {
  ffmpeg(fs.createReadStream(args.tempFile))
    .clone()
    .on('start', () => {
      logger.info(`Converting start: ${args.tempFile}`)
      sendMsgWindows('file:convert', {
        comm: 'start',
        file: args.tempFile
      })
    })
    .on('progress', (progress) => {
      console.log(progress)
    })
    .on('error', (err) => {
      logger.error(`Converting error: ${err}`)
      sendMsgWindows('file:convert', {
        comm: 'error',
        file: args.tempFile
      })
    })
    .on('end', () => {
      logger.info(`Converting end: ${args.encodedFile}`)
      sendMsgWindows('file:convert', {
        comm: 'end',
        file: args.tempFile
      })
    })
    .output(args.encodedFile)
    .run()
}
