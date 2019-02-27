 
require('electron-reload')(__dirname, { electron: require('/Users/admin/Script/electron/n-dic/node_modules/electron') })
const {app, BrowserWindow} = require('electron')
const ipc_main = require('electron').ipcMain
const path = require('path')
const url = require('url')
 
let win
 
function createWindow () {
  // create the browser window.
  win = new BrowserWindow({width: 800, height: 600})
 
  // and load the tdd_main.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'src/tdd_main.html'),
    protocol: 'file:',
    slashes: true
  }))
 
  // open the DevTools.
  win.webContents.openDevTools()
 
  // emitted when the window is closed.
  win.on('closed', () => {
    // dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}
 
app.on('ready', createWindow)
 
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
 
