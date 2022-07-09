import { app, BrowserWindow, ipcMain } from 'electron'
import os from 'node:os'
import path from 'node:path'
import fs from 'node:fs'
import moment from 'moment'
import db from '../db'

let writeFileStream
const homePath = app.getPath('home')
console.log(homePath)

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
