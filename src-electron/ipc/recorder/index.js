import { app, BrowserWindow, ipcMain } from 'electron'
import fs from 'node:fs'
import path from 'node:path'
import moment from 'moment'
import db from '../../db'
import { currentPath, checkFolder } from '../index'
import { makeSeekable } from './ebml'

let writeFileStream
let duration

function makeFileName() {
  return `${moment().format('YYYY-MM-DD HH_mm_ss')}.webm`
}

ipcMain.handle('rec:start', async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkFolder()
      const fileName = makeFileName()
      const fileFullPath = path.join(currentPath, fileName)
      const tempFile = path.join(currentPath, 'recorder_temp.webm')

      writeFileStream = fs.createWriteStream(tempFile)
      writeFileStream.on('finish', async () => {
        await makeSeekable({
          fileName,
          fileFullPath,
          tempFile,
          duration
        })
        console.log('stop rec: ' + fileFullPath)
      })
      writeFileStream.on('open', () => {
        resolve(console.log('start rec: ' + fileName))
      })
    } catch (err) {
      reject(err)
    }
  })
})

ipcMain.handle('rec:stop', async () => {
  await writeFileStream.end()
})

ipcMain.handle('rec:data', (e, args) => {
  duration = args.time
  writeFileStream.write(Buffer.from(args.buffer))
})
