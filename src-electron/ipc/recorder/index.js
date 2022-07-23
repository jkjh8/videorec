import { app, BrowserWindow, ipcMain } from 'electron'
import fs from 'node:fs'
import path from 'node:path'
import moment from 'moment'
import db from '../../db'
import { homePath, currentPath, checkFolder } from '../index'
import { setTagFile } from './ebml'

let writeFileStream
let file
let fileName

function makeFileName(format) {
  const name = moment().format('YYYY-MM-DD_HH:mm:ss_a')
  let ext

  switch (format) {
    case 'video/ogg':
      ext = 'ogg'
      break
    case 'video/mkv':
      ext = 'mkv'
      break
    case 'video/mp4':
      ext = 'mp4'
      break
    case 'video/quicktime':
      ext = 'mov'
      break
    default:
      ext = 'webm'
      break
  }
  return `${name}.${ext}`
}

ipcMain.handle('rec:start', async (e, args) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { format } = args
      file = makeFileName(format)
      fileName = path.join(await checkFolder(), file)
      writeFileStream = fs.createWriteStream(fileName)
      writeFileStream.on('open', () => {
        console.log(fs.existsSync(fileName))
        resolve()
      })
      writeFileStream.on('finish', () =>
        console.log('finish: ' + file)
      )

      console.log('start filestream: ' + fileName)
    } catch (err) {
      reject(err)
    }
  })
})

ipcMain.handle('rec:stop', async () => {
  writeFileStream.end()
  setTagFile(fileName)
  console.log('stop filestream: ' + fileName)
  // filesize = fs.statSync(file).size
  // console.log(filesize / streamPerSecond)
})

ipcMain.handle('rec:data', (e, buffer) => {
  writeFileStream.write(Buffer.from(buffer))
})
