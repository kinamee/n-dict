const electron = require('electron')
const path = require('path')
const remote = electron.remote
const BrowserWindow = electron.remote.BrowserWindow
const ipc_renderer = electron.ipcRenderer

let $ = require('jquery')
const webview = document.getElementById('webview')

webview.addEventListener('dom-ready', () => {
  //webview.openDevTools()
  //webview.insertCSS('body { overflow-y: hidden; }')

  webview.focus()
  webview.setZoomLevel(-1);
  webview.executeJavaScript('document.getElementById("main_input").focus();')
})

/*
 * document ready
 */
$(document).ready(function() {
    console.log('document ready')
})
