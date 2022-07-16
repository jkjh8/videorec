import { BrowserWindow } from 'electron'
import disk from 'check-disk-space'
import db from '../db'
import { homePath } from './index'

export async function getDisk(path) {
  try {
    let diskValue
    if (path) {
      diskValue = await disk(path)
    } else {
      const d = await db.setup.findOne({ key: 'folder' })
      if (d && d.value) {
        diskValue = await disk(d.value)
      } else {
        diskValue = await disk(homePath)
      }
    }
    BrowserWindow.fromId(1).webContents.send('status:state', {
      key: 'disk',
      value: diskValue
    })
  } catch (err) {
    console.error(err)
  }
}
