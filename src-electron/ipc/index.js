import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
import os from 'node:os'
import path from 'node:path'
import fs from 'node:fs'
import moment from 'moment'
import disk from 'check-disk-space'
import db from '../db'

let writeFileStream
const homePath = app.getPath('home')

ipcMain.handle('rec:start', async (e, args) => {
  let filePath
  const r = await db.setup.findOne({ key: 'folder' })
  if (r && r.value && fs.existsSync(r.value)) {
    filePath = path.join(
      r.value,
      `${moment().format('YYYY-MM-DD_hh:mm:ss_a')}.webm`
    )
  } else {
    BrowserWindow.fromId(1).send('status:folder', homePath)
    filePath = path.join(
      homePath,
      `${moment().format('YYYY-MM-DD_hh:mm:ss_a')}.webm`
    )
  }
  writeFileStream = fs.createWriteStream(filePath)
  writeFileStream.on('finish', () => {})
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

ipcMain.handle('setup:get', async () => {
  return await db.setup.find({})
})

ipcMain.handle('status:getdisk', async (e, path) => {
  if (path) {
    return await disk(path)
  }
  return await disk(homePath)
})

ipcMain.handle('status:selfolder', async () => {
  const path = dialog.showOpenDialogSync({
    title: 'Select Folder',
    defaultPath: app.getPath('home'),
    properties: ['openDirectory']
  })
  if (path && path.length) {
    db.setup.update(
      { key: 'folder' },
      { $set: { value: path[0] } },
      { upsert: true }
    )
    return path[0]
  }
  return null
})

ipcMain.handle('status:getfolder', async () => {
  const r = await db.setup.findOne({ key: 'folder' })
  if (r && r.value) {
    if (fs.existsSync(r.value)) {
      return r.value
    }
  }
  BrowserWindow.fromId(1).send('status:folder', homePath)
  return homePath
})

ipcMain.handle('status:openFolder', (e, path) => {
  if (fs.existsSync(path)) {
    return shell.openPath(path)
  }
  BrowserWindow.fromId(1).send('status:folder', homePath)
  return shell.openPath(homePath)
})

ipcMain.handle('status:resize', (e, hi) => {
  const currentSize = BrowserWindow.fromId(1).getSize()
  BrowserWindow.fromId(1).setSize(currentSize[0], hi + 160)
})
