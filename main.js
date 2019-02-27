
require('electron-reload')(__dirname, { electron: require('/Users/admin/Script/electron/n-dic/node_modules/electron') })
const {app, BrowserWindow, Tray} = require('electron')
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

  tray = new Tray('/path/to/my/icon') // 현재 애플리케이션 디렉터리를 기준으로 하려면 `__dirname + '/images/tray.png'` 형식으로 입력해야 합니다.
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Item1', type: 'radio'},
    {label: 'Item2', type: 'radio'},
    {label: 'Item3', type: 'radio', checked: true},
    {label: 'Item4', type: 'radio'}
  ])
  tray.setToolTip('이것은 나의 애플리케이션 입니다!')
  tray.setContextMenu(contextMenu)
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

