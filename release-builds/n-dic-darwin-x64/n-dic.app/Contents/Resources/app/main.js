
const { app, globalShortcut, BrowserWindow, Tray, Menu } = require('electron')
const ipc_main = require('electron').ipcMain
const path = require('path')
const url = require('url')

/* logger setting */
//const log = require('electron-log')
//log.info('electron-log is on')
/*
const fs = require('fs');
log.transports.file.format = '{h}:{i}:{s}:{ms} {text}'
log.transports.file.maxSize = 5 * 1024 * 1024
log.transports.file.level = 'info'
log.transports.file.file = __dirname + '/app-log.txt'
log.transports.file.streamConfig = { flags: 'w' };
log.transports.file.stream = fs.createWriteStream('app-log.txt')
log.appName = 'nadict'
*/

/* storage setting */
const store = require('electron-store');
const storage = new store();
let shortcut_from_config

/* windows references */
let win_dict
let win_setting

/* create windows */
function createWindow() {

    /* [01] create dictionary window */
    win_dict = new BrowserWindow({
        frame: false,
        width: 420,
        height: 610
    })
    win_dict.setResizable(false)
    // win.webContents.openDevTools()
    app.dock.hide();

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

    win_dict.on('focus', () => {
        //log.info('win_dict.unfocused')
        const ret = globalShortcut.register('ESC', () => {
            /* show dictionary on shortcut pressed*/
            win_dict.hide()
        })
    });

    win_dict.on('blur', () => {
        //log.info('win_dict.unfocused')
        globalShortcut.unregister('ESC')
        win_dict.hide()
    })


    /* [02] create dictionary window */
    const modalPath = path.join('file://', __dirname, 'src/frmsetting.html')
    win_setting = new BrowserWindow({
        frame: false,
        width: 260,
        height: 180,
        'web-preferences': { 'web-security': false }
    })
    win_setting.on('close', function() { win_setting = null })
    win_setting.loadURL(modalPath)
    //win_setting.webContents.openDevTools()
    win_setting.hide()

    win_setting.on('closed', () => {
        win_setting = null
    })
}

/* entry point */
app.on('ready', () => {

    shortcut_from_config = config_file_exist()
    //console.log('app.on shortcut from config: ' + shortcut_from_config)
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
                open_dict()
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
                const { dialog } = require('electron')
                let options  = {
                    buttons: ["Close"],
                    message: "About",
                    detail : "Nadict ver 1.029 beta"
                    //icon : "icon/ndic_ico.png"
                }
                const response = dialog.showMessageBox(options);
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

    /* register shortcut */
    //console.log(shortcut_from_config + ' from config')
    const ret = globalShortcut.register(shortcut_from_config, () => {
        //console.log(shortcut_from_config + ' is pressed on main')
        /* show dictionary on shortcut pressed*/
        open_dict()
    })
    if (ret) {
        //console.log('globalshortcut setting completed: ' + ret)
    } else {
        //console.log('Shortcut registration failed')
    }
})

app.on('will-quit', () => {
  // Unregister a shortcut.
  shortcut_from_config = storage.get('shortcut')
  globalShortcut.unregister(shortcut_from_config)
  //console.log(shortcut_from_config + ' is unregistered')
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win_dict === null) {
        createWindow()

    }
})

ipc_main.on('setting-to-main', function(event, arg) {

    /* message is received from seeting view */
    //console.log('here, main.js - <setting-to-main>: ' + arg)
    shortcut_from_config = storage.get('shortcut')
    globalShortcut.unregister(shortcut_from_config)
    //console.log('unregistered: ' + shortcut_from_config)

    /* registeration for new shortcut */
    storage.set('shortcut', arg)
    const ret = globalShortcut.register(arg, () => {
        /* show dictionary on shortcut pressed*/
        open_dict()

        storage.set('shortcut', arg)
        shortcut_from_config = arg
    })
    if (ret) {
        //console.log('globalshortcut setting completed: ' + ret)
    } else {
        /* send a message to setting view */
        win_setting.webContents.send('setting-to-main', 'shortcut registration failed')

        //console.log('Shortcut registration failed')
        /* return back to original shortcut */
        storage.set('shortcut', shortcut_from_config)
        const ret = globalShortcut.register(shortcut_from_config, () => {
            /* show dictionary on shortcut pressed*/
            open_dict()
        })
    }

})

/* if not exist, create config json with shortcut whose default value is CMD+SHIFT+ALT+P */
function config_file_exist() {
    shortcut = storage.get('shortcut')
    if (!shortcut) {
        //console.log('shortcut is not found')
        storage.set('shortcut', 'CMD+SHIFT+ALT+P')
        return 'CMD+SHIFT+ALT+P'
    }
    return shortcut
}

function open_dict() {

    /* display screen */
    var screenElectron = require('electron').screen;
    var mainScreen = screenElectron.getPrimaryDisplay();
    screen_height = mainScreen.workArea.height

    var win_size = win_dict.getSize()
    window_height = win_size[1]
    win_dict.setPosition(0, screen_height-window_height);

    /* show and hide toggle */
    if (win_dict.isVisible())
        win_dict.hide()
    else {
        search = ''
        const { clipboard } = require('electron')
        copied = clipboard.readText()
        if (copied.length < 21)
            search = copied
        win_dict.webContents.send('main-to-dict', search)
        win_dict.show()
    }
}


