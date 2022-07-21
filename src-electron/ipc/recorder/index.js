import { app, BrowserWindow, ipcMain } from 'electron'
import fs, { write } from 'node:fs'
import path from 'node:path'
import { Blob } from 'buffer'
import moment from 'moment'
import fixWebmDuration from 'webm-duration-fix'
// import { EbmlStreamDecoder } from 'ebml-stream'

import db from '../../db'
import { homePath, currentPath, checkFolder } from '../index'
import pathToFfmpeg from 'ffmpeg-static'
import pathToFfprobe from 'ffprobe-static'
import ffmpeg from 'fluent-ffmpeg'

ffmpeg.setFfmpegPath(pathToFfmpeg)
ffmpeg.setFfprobePath(pathToFfprobe.path)

let writeFileStream
let file
let fileNum = 1
let files = []
let blobSlice = []

function makeFileName(format) {
  return moment().format('YYYY-MM-DD_HH:mm:ss_a')
}

ipcMain.handle('rec:start', async (e, args) => {
  try {
    fileNum = 1
    files = []
    // streamPerSecond = audio + video
    file = path.join(await checkFolder(), makeFileName())

    // writeFileStream = fs.createWriteStream(file, {
    //   metadata: { contentType: format }
    // })

    // writeFileStream.on('finish', () => console.log('finish: ' + file))

    console.log('start filestream: ' + file)
    return null
  } catch (err) {
    console.error(err)
    return err
  }
})

ipcMain.handle('rec:stop', async () => {
  // writeFileStream.end()
  console.log('stop filestream: ' + file)
  // const fixBlob = await fixWebmDuration(
  //   new Blob([...blobSlice], { type: 'video/webm' })
  // )
  // console.log(fixBlob)
  // const fileWriteStream = fs.createWriteStream(
  //   path.join(currentPath, `${file}.webm`)
  // )
  // const blobReadstream = fixBlob.stream()
  // const blobReader = blobReadstream.getReader()

  // while (true) {
  //   let { done, value } = await blobReader.read()
  //   if (done) {
  //     console.log('write done.')
  //     fileWriteStream.close()
  //     break
  //   }
  //   fileWriteStream.write(value)
  //   value = null
  // }
  // blobSlice = []
  // let mergedVideo = ffmpeg()
  // console.log(files)
  // files.forEach((f) => {
  //   mergedVideo.mergeAdd(f)
  // })

  // mergedVideo
  //   .on('progress', (progress) => {
  //     console.log('update: ', progress)
  //   })
  //   .on('error', (err) => {
  //     console.log(err)
  //   })
  //   .on('end', function () {
  //     console.log('done')
  //   })
  //   .save(path.join(currentPath, `${file}.webm'`))
  // ffmpeg(file).ffprobe((err, data) => {
  //   console.log(err, data)
  // })
  // filesize = fs.statSync(file).size
  // console.log(filesize / streamPerSecond)
  // ffmpeg(file)
  //   .on('progress', (progress) => {
  //     console.log('update: ', progress)
  //   })
  //   .on('error', (err) => {
  //     console.log(err)
  //   })
  //   .on('end', function () {
  //     console.log('done')
  //   })
  //   .save(path.join(currentPath, 'test.mp4'))
})

ipcMain.handle('rec:data', (e, buffer) => {
  // console.log('update', JSON.parse(buffer))
  // writeFileStream.write(Buffer.from(buffer))
  const currentFile = path.join(currentPath, `temp${file}.webm`)
  // files.push(currentFile)
  fs.writeFileSync(currentFile, Buffer.from(buffer))
  // fileNum++
})
