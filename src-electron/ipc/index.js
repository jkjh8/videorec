import { ipcMain, BrowserWindow } from 'electron'
import os from 'node:os'
import path from 'node:path'
import fs, { write } from 'node:fs'
import { Blob } from 'node:buffer'
import { Duplex, pipeline, Readable } from 'node:stream'
import moment from 'moment'

let writeFileStream

function bufferToStream(buffer) {
  let stream = new Readable()
  stream.push(buffer)
  // stream.push(null);
  return stream
}

ipcMain.handle('rec:start', async (e, args) => {
  const filePath = path.join(`${moment().format('YYYY-MM-DD_hh:mm:ss_a')}.mp4`)
  writeFileStream = fs.createWriteStream(filePath)
  writeFileStream.on('finish', () => {
    console.log('end rec')
  })
  console.log('start rec', filePath)
})

ipcMain.handle('rec:data', async (e, buffer) => {
  writeFileStream.write(Buffer.from(buffer))
})

ipcMain.handle('rec:stop', async (e, args) => {
  writeFileStream.end()
})
