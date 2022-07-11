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

ipcMain.handle('setup:update', async (e, items) => {
  for (let i = 0; i < items.length; i++) {
    console.log(items[i])
    await db.setup.update(
      { key: items[i].key },
      { $set: { value: items[i].value } },
      { upsert: true }
    )
  }
  return items
})

ipcMain.handle('setup:get', async (e) => {
  return await db.setup.find({})
})
