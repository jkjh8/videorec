import { app, Menu, BrowserWindow } from 'electron'
const template = []
if (process.platform === 'win32') {
  template.unshift(
    {
      label: 'File',
      submenu: [
        {
          label: 'Close',
          accelerator: 'alt+F4',
          role: 'close'
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          accelerator: 'F1',
          click: () => {
            return BrowserWindow.fromId(1).webContents.send(
              'menu:about'
            )
          }
        }
      ]
    }
  )
}

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })
}

export default Menu.buildFromTemplate(template)
