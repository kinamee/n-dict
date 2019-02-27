const electron = require('electron')
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow
const ipc_renderer = electron.ipcRenderer
let $ = require('jquery')
 
ipc_renderer.on('ipc-to-tdd', function (event, arg) {
  console.log('ipc-to-tdd message received')
})
 
const btn_tdd01 = document.getElementById('btn_tdd01')
btn_tdd01.addEventListener('click', function (event) {
  console.log('btn_tdd01 clicked')
})
 
const btn_tdd02 = document.getElementById('btn_tdd02')
btn_tdd02.addEventListener('click', function (event) {
  console.log('btn_tdd02 clicked')
})
 
const btn_popup = document.getElementById('btn_popup')
btn_popup.addEventListener('click', function (event) {
  console.log('btn_popup clicked')
  const modalPath = path.join('file://', __dirname, 'tdd_popup.html')
  let win = new BrowserWindow({ frame: false, width: 400, height: 200 })
  win.on('close', function () { win = null })
  win.loadURL(modalPath)
  win.show()
})
 
$(document).ready(function(){
 $('#id_jqry').text('Hello JQuery + Electron')
});
 
