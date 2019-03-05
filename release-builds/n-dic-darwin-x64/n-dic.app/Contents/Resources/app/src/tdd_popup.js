const electron = require('electron')
const path = require('path')
const remote = electron.remote
const ipc_renderer = electron.ipcRenderer
 
const btn_pop01 = document.getElementById('btn_pop01')
btn_pop01.addEventListener('click', function (event) {
  console.log('btn_pop01 clicked')
  ipc_renderer.send('ipc-to-main', 'message from popup')
})
 
const btn_pop02 = document.getElementById('btn_pop02')
btn_pop02.addEventListener('click', function (event) {
  console.log('btn_pop02 clicked')
    var window = remote.getCurrentWindow();
    window.close();
})
 
