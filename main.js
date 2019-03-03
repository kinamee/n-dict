
require('electron-reload')(__dirname, { electron: require('/Users/admin/Script/electron/n-dic/node_modules/electron') })
const {app, BrowserWindow, Tray, Menu} = require('electron')
const ipc_main = require('electron').ipcMain
const path = require('path')
const url = require('url')

let win

function createWindow () {

  // create the browser window.
  win = new BrowserWindow({
    webPreferences: {
    devTools: false
    },
    frame: false,
    width: 420, height: 610
  })
  win.setResizable(false)
  // app.dock.hide();

  // and load the tdd_main.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'src/frmmain.html'),
    protocol: 'file:',
    slashes: true
  }))

  // open the DevTools.
  // win.webContents.openDevTools()

  // emitted when the window is closed.
  win.on('closed', () => {
    // dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

app.on('ready', () => {
  createWindow()

  /* create menu icon */
  const trayIcon = path.join(__dirname, '/icon/ndic_ico.png')
  const nativeImage = require('electron').nativeImage
  const nimage = nativeImage.createFromPath(trayIcon)

  /* create menu */
  tray = new Tray(nimage)
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Settings', click() {
        /* open settings */
        const modalPath = path.join('file://', __dirname, 'src/frmsetting.html')
        let win_setting = new BrowserWindow({
          frame: false,
          width: 260, height: 180,
          'web-preferences': {'web-security': false}
        })
        win_setting.on('close', function () { win_setting = null })
        win_setting.loadURL(modalPath)
        win_setting.show()
        // Open the DevTools.
        win_setting.webContents.openDevTools()
      }
    },
    {label: 'About', click() {
        /* open about dialog */
      }
    },
    {type: 'separator'},
    {label: 'Quit', click() {
        app.quit()
      },
      accelerator: 'CmdOrCtrl+Q'
    }
  ])
  tray.setToolTip('Nadict')
  tray.setContextMenu(contextMenu)

  /* hide main window */
  /* win.mainWindow.hide(); */
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

ipc_main.on('ipc-to-main', function (event, arg) {
  // delever ipc message to binding page tdd.js
  win.webContents.send('ipc-to-tdd', arg)
})

