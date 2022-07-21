import { app, BrowserWindow, ipcMain } from 'electron'
import fs from 'node:fs'
import path from 'node:path'
import { Blob } from 'buffer'
import moment from 'moment'

import db from '../../db'
import { homePath, currentPath, checkFolder } from '../index'
import pathToFfmpeg from 'ffmpeg-static'
import pathToFfprobe from 'ffprobe-static'
import ffmpeg from 'fluent-ffmpeg'

ffmpeg.setFfmpegPath(pathToFfmpeg)
ffmpeg.setFfprobePath(pathToFfprobe.path)

let file

function makeFileName(format) {
  return moment().format('YYYY-MM-DD_HH:mm:ss_a')
}

ipcMain.handle('rec:start', async (e, args) => {
  try {
    file = path.join(await checkFolder(), makeFileName())
    console.log('start filestream: ' + file)
    return null
  } catch (err) {
    console.error(err)
    return err
  }
})

ipcMain.handle('rec:stop', async () => {
  console.log('stop filestream: ' + file)
})

ipcMain.handle('rec:data', (e, buffer) => {
  const currentFile = path.join(currentPath, `temp${file}.webm`)
  fs.writeFileSync(currentFile, Buffer.from(buffer))
})
