import { app, BrowserWindow, dialog } from 'electron'
import os from 'node:os'
import path from 'node:path'
import moment from 'moment'
import disk from 'check-disk-space'
import { dbSetupFindOne } from '../db/dbFunc'

import './recorder'
import './status'

let currentPath
const homePath = app.getPath('home')

let diskUseageInterval = setInterval(async () => {
  return sendMsgWindows('status:state', {
    key: 'disk',
    value: await getDiskUseage()
  })
}, 60000)

async function checkFolder(cf) {
  if (cf) {
    currentPath = cf
  } else {
    const r = await dbSetupFindOne('folder')
    if (r && r.value) {
      currentPath = r.value
      return currentPath
    }
  }
  return homePath
}

async function getDiskUseage(cf) {
  const p = await checkFolder(cf)
  return await disk(p)
}

async function getFolderDialog() {
  return dialog.showOpenDialogSync({
    title: 'Seletct Folder',
    defaultPath: currentPath ? currentPath : homePath,
    properties: ['openDirectory']
  })
}

async function getFileDialog() {
  return dialog.showOpenDialogSync({
    title: 'Select File',
    defaultPath: currentPath ? currentPath : homePath,
    properties: ['openFile']
  })
}

async function sendMsgWindows(address, msg) {
  const windows = BrowserWindow.getAllWindows()
  windows.forEach((win) => {
    win.webContents.send(address, msg)
  })
}

export {
  homePath,
  currentPath,
  checkFolder,
  getFolderDialog,
  getFileDialog,
  getDiskUseage,
  sendMsgWindows
}
