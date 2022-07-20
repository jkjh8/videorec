import { app, BrowserWindow, ipcMain } from 'electron'
import fs, { write } from 'node:fs'
import path from 'node:path'
import moment from 'moment'
import db from '../../db'
import { homePath, currentPath, checkFolder } from '../index'
import pathToFfmpeg from 'ffmpeg-static'
console.log(pathToFfmpeg)
import ffmpeg from 'fluent-ffmpeg'

ffmpeg.setFfmpegPath(pathToFfmpeg)

let writeFileStream
let file
let streamPerSecond
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
  try {
    const { format, audio, video } = args
    streamPerSecond = audio + video
    file = path.join(await checkFolder(), makeFileName(format))
    writeFileStream = fs.createWriteStream(file)

    writeFileStream.on('finish', () => console.log('finish: ' + file))

    console.log('start filestream: ' + file)
    return null
  } catch (err) {
    console.error(err)
    return err
  }
})

ipcMain.handle('rec:stop', async () => {
  writeFileStream.end()
  console.log('stop filestream: ' + file)
  filesize = fs.statSync(file).size
  console.log(filesize / streamPerSecond)
})

ipcMain.handle('rec:data', (e, buffer) => {
  return writeFileStream.write(Buffer.from(buffer))
})

// function checkPath(d) {
//   const mainWindow = BrowserWindow.fromId(1)
//   let current = fs.existsSync(d) ? d : homePath
//   mainWindow.webContents.send('status:folder', current)
//   return current
// }

// async function getPath() {
//   const mainWindow = BrowserWindow.fromId(1)
//   const r = await db.setup.findOne({ key: 'folder' })
//   if (r && r.value && fs.existsSync(r.value)) {
//     mainWindow.webContents.send('status:folder', r.value)
//     return r.value
//   }
//   await db.setup.update(
//     { key: 'folder' },
//     { $set: { value: homePath } },
//     { upsert: true }
//   )
//   mainWindow.webContents.send('status:folder', homePath)
//   return homePath
// }

// ipcMain.handle('rec:start', async (e, args) => {
//   try {
//     const { format } = args
//     const file = path.join(await getPath(), makeFileName(format))
//     writeFileStream = fs.createWriteStream(file)
//     console.log('make file stream - ', file)
//     // finish event
//     writeFileStream.on('finish', () => {
//       console.log('file write finish')
//     })
//     return null
//   } catch (err) {
//     console.error(err)
//     return err
//   }
// })

// ipcMain.handle('rec:data', async (e, buffer) => {
//   try {
//     writeFileStream.write(Buffer.from(buffer))
//   } catch (err) {
//     console.error(err)
//   }
// })

// ipcMain.handle('rec:stop', () => {
//   writeFileStream.end()
//   console.log('file write end')
// })
