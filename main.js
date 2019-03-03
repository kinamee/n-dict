require('electron-reload')(__dirname, { electron: require('/Users/admin/Script/electron/n-dic/node_modules/electron') })
const { app, globalShortcut, BrowserWindow, Tray, Menu } = require('electron')
const ipc_main = require('electron').ipcMain
const path = require('path')
const url = require('url')
const fs = require('fs');

const log = require('electron-log')
log.transports.file.format = '{h}:{i}:{s}:{ms} {text}'
log.transports.file.maxSize = 5 * 1024 * 1024
log.transports.file.level = 'info'
log.transports.file.file = __dirname + '/nadict.log'
log.transports.file.streamConfig = { flags: 'w' };
log.transports.file.stream = fs.createWriteStream('log.txt')
log.appName = 'nadict'
log.info('electron-log is on')

let win_dict
let win_setting

function createWindow() {

    /* create dictionary window */
    win_dict = new BrowserWindow({
        webPreferences: {
            devTools: true
        },
        frame: false,
        width: 420,
        height: 610
    })
    win_dict.setResizable(false)
    // win.webContents.openDevTools()
    // app.dock.hide();

    // and load the tdd_main.html of the app.
    win_dict.loadURL(url.format({
        pathname: path.join(__dirname, 'src/frmmain.html'),
        protocol: 'file:',
        slashes: true
    }))
    win_dict.hide()
    // open the DevTools.
    // win.webContents.openDevTools()
    // emitted when the window is closed.
    win_dict.on('closed', () => {
        // dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win_dict = null
    })

    /* create dictionary window */
    const modalPath = path.join('file://', __dirname, 'src/frmsetting.html')
    win_setting = new BrowserWindow({
        frame: false,
        width: 260,
        height: 180,
        'web-preferences': { 'web-security': false }
    })
    win_setting.on('close', function() { win_setting = null })
    win_setting.loadURL(modalPath)
    win_setting.hide()

    win_setting.on('closed', () => {
        win_setting = null
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
        {
            label: 'Show Dictionary',
            click() {
                /* open dictionary */
                win_dict.show()
            }
        },
        {
            label: 'Settings',
            click() {
                /* open settings */
                win_setting.show()
           }
        },
        {
            label: 'About',
            click() {
                /* open about dialog */
            }
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click() {
                app.quit()
            },
            accelerator: 'CmdOrCtrl+Q'
        }
    ])
    tray.setToolTip('Nadict')
    tray.setContextMenu(contextMenu)

    /* hide main window */
    /* win.mainWindow.hide(); */

    /* register shortcut */
    const ret = globalShortcut.register('Cmd+Shift+Alt+P', () => {
        log.info('Cmd+Shift+Alt+P is pressed')
    })
    if (ret) {
        log.info('globalshortcut setting completed: ' + ret)
    } else {
        log.info('Shortcut registration failed')
    }
})

app.on('will-quit', () => {
  // Unregister a shortcut.
  globalShortcut.unregister('Cmd+Shift+Alt+P')
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

ipc_main.on('ipc-to-main', function(event, arg) {
    // delever ipc message to binding page tdd.js
    win.webContents.send('ipc-to-tdd', arg)
})