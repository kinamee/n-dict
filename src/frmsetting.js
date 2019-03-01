const electron = require('electron')
const path = require('path')
const remote = electron.remote
const ipc_renderer = electron.ipcRenderer

/* storage setting */
const schedule_file_path = path.join(__dirname, 'schedule.json')
const storage = require('electron-json-storage');
storage.setDataPath(schedule_file_path);


/* document ready */
$(document).ready(function() {
    /* check config file */
    config_file_exist()
 })

/* check and create config file */
function config_file_exist() {
    storage.has('shortcut', function(error, hasKey) {
        if (error) throw error
        if (hasKey) {
            console.log('exist')
        } else {
            console.log('does not exist, create default schedule.json')
            storage.set('shortcut', 'SHIFT+CMD+OPT+P', function(error) {
                if (error) throw error;
                console.log('created for shortcut')
            })
        }
    })
}

/* save shortcut to config file */
function save_config_file() {

}

