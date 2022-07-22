import { app, BrowserWindow, ipcMain } from 'electron'
import fs, { write } from 'node:fs'
import path from 'node:path'
import moment from 'moment'
import db from '../../db'
import { homePath, currentPath, checkFolder } from '../index'
import { setTagFile } from './ebml'

let writeFileStream
let file

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
    const { format } = args
    file = makeFileName(format)
    const fileName = path.join(await checkFolder(), file)

    writeFileStream = fs.createWriteStream(fileName, {
      metadata: { contentType: format }
    })

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
  setTagFile(file)
  console.log('stop filestream: ' + file)
  // filesize = fs.statSync(file).size
  // console.log(filesize / streamPerSecond)
})

ipcMain.handle('rec:data', (e, buffer) => {
  writeFileStream.write(Buffer.from(buffer))
})
