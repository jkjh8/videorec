import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
import os from 'node:os'
import path from 'node:path'
import fs from 'node:fs'
import moment from 'moment'
import disk from 'check-disk-space'
import db from '../db'

import './recorder'
const homePath = app.getPath('home')

let diskUseageInterval = setInterval(async () => {
  getDiskUseage()
}, 60000)

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
  getDiskUseage()
  return await db.setup.find({})
})

ipcMain.handle('status:getdisk', async (e, path) => {
  if (path) {
    return await disk(path)
  }
  return await disk(homePath)
})

async function getDiskUseage() {
  try {
    let diskUseage
    const d = await db.setup.findOne({ key: 'folder' })
    if (d && d.value) {
      diskUseage = await disk(d.value)
    } else {
      diskUseage = await disk(homePath)
    }
    BrowserWindow.fromId(1).webContents.send('status:state', {
      key: 'disk',
      value: await disk(homePath)
    })
  } catch (err) {
    console.error(err)
  }
}

ipcMain.handle('status:selFolder', async () => {
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

export { homePath }
