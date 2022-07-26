import { app, BrowserWindow, ipcMain } from 'electron'
import fs from 'node:fs'
import path from 'node:path'
import { Buffer } from 'buffer'
import moment from 'moment'
import db from '../../db'
import { logger } from '../../logger'
import {
  currentPath,
  checkFolder,
  getFileDialog,
  sendMsgWindows
} from '../index'
import { webmToMkv } from './ffmpeg'

let writeFileStream
let writeFileSream_complete

let tempFilePath
let filePath

async function makeFileNames() {
  try {
    await checkFolder()
    !fs.existsSync(path.join(currentPath, 'temp')) &&
      fs.mkdirSync(path.join(currentPath, 'temp'))
    const name = `${moment().format('YYYY-MM-DD HH_mm_ss')}`
    filePath = path.join(currentPath, `${name}.webm`)
    tempFilePath = path.join(currentPath, 'temp', `temp_${name}.webm`)
  } catch (err) {
    logger.error(`Make File Name & Folder Error: ${err}`)
  }
}

ipcMain.handle('rec:start', async () => {
  try {
    await makeFileNames()
    writeFileStream = fs.createWriteStream(tempFilePath)
    writeFileStream.on('finish', async () => {
      logger.info(`recording finish: ${tempFilePath}`)
    })
    writeFileStream.on('open', () => {
      logger.info(`recording start: ${tempFilePath}`)
    })
  } catch (err) {
    logger.error(`recording error: ${err}`)
  }
})

ipcMain.handle('rec:data', (e, args) => {
  try {
    writeFileStream.write(Buffer.from(args.buffer))
  } catch (err) {
    logger.error(`recording data error: ${err}`)
  }
})

ipcMain.handle('rec:stop', async () => {
  logger.info('recording call stream end')
  await writeFileStream.end()
})

ipcMain.handle('file:start', () => {
  try {
    writeFileSream_complete = fs.createWriteStream(filePath)
    writeFileSream_complete.on('finish', () => {
      logger.info(`File Stream Saved: ${filePath}`)
      sendMsgWindows('file:saved', filePath)
    })
    writeFileSream_complete.on('open', () => {
      logger.info(`File Stream Start: ${filePath}`)
    })
  } catch (err) {
    logger.error(`File Stream Error: ${err}`)
  }
})

ipcMain.handle('file:data', (e, data) => {
  try {
    writeFileSream_complete.write(Buffer.from(data))
  } catch (err) {
    logger.error('File Stream Data Error: ${err}')
  }
})

ipcMain.handle('file:stop', () => {
  writeFileSream_complete.end()
  logger.info('File Stream call end')
})

ipcMain.handle('file:convert', async () => {
  const f = await getFileDialog()
  if (f && f.length) {
    const temp = f[0]
    const file = temp.substring(0, temp.lastIndexOf('.')) + '.mkv'
    webmToMkv({ tempFile: temp, encodedFile: file })
  }
})
