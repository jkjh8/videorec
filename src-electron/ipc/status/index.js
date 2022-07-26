import { BrowserWindow, ipcMain, shell } from 'electron'
import fs from 'node:fs'
import db from '../../db'
import { dbSetupUpdate } from '../../db/dbFunc'
import {
  getDiskUseage,
  getFolderDialog,
  homePath,
  checkFolder,
  sendMsgWindows
} from '../index'

ipcMain.handle('setup:update', async (e, items) => {
  items.forEach(async (item) => {
    console.log(`setup update ${item}`)
    await dbSetupUpdate(item)
  })
  return items
})
ipcMain.handle('setup:get', async () => {
  return await db.setup.find({})
})
ipcMain.handle('status:diskuseage', async (e, path) => {
  return await getDiskUseage()
})
ipcMain.handle('status:selfolder', async () => {
  const cf = await getFolderDialog()
  if (cf && cf.length) {
    await dbSetupUpdate({ key: 'folder', value: cf[0] })
    console.log(`Folder Changed ${cf[0]}`)
    return cf[0]
  }
  console.log('Folder Change Failed')
  return homePath
})
ipcMain.handle('status:getfolder', async () => {
  return await checkFolder()
})
ipcMain.handle('status:openfolder', (e, path) => {
  if (fs.existsSync(path)) {
    return shell.openPath(path)
  }
  sendMsgWindows('status:folder', homePath)
  return shell.openPath(homePath)
})
ipcMain.handle('status:resize', (e, hi) => {
  const windows = BrowserWindow.getAllWindows()
  windows.forEach((win) => {
    const cs = win.getSize()
    win.setSize(cs[0], hi + 160)
  })
})
ipcMain.handle('status:setSize', (e, size) => {
  const windows = BrowserWindow.getAllWindows()
  windows.forEach((win) => {
    win.setSize(size.width + 20, size.height + 160)
  })
})
