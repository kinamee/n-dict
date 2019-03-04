const electron = require('electron')
const path = require('path')
const remote = electron.remote
const BrowserWindow = electron.remote.BrowserWindow
const ipc_renderer = electron.ipcRenderer
const log = require('electron-log')

/* jquery and jquery-ui */
let $ = require('jquery')

/* document load completed */
const webview = document.getElementById('webview')
webview.addEventListener('dom-ready', () => {
  //webview.openDevTools()

  webview.focus()
  webview.insertCSS('body::-webkit-scrollbar { display: none; }')
  webview.setZoomLevel(0);
  webview.executeJavaScript('document.getElementById("main_input").focus();')

})

/* document ready */
$(document).ready(function() {
    console.log('document ready')
})
