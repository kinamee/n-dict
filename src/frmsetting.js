
const electron = require('electron')
const path = require('path')
const remote = electron.remote
const ipc_renderer = electron.ipcRenderer
const globalShortcut = require('electron')

let $ = require('jquery')

/* storage setting */
const schedule_file_path = path.join(__dirname, 'schedule.json')
const storage = require('electron-json-storage');
storage.setDataPath(schedule_file_path);

/* document ready */
$(document).ready(function() {
    /* design init */
    design_init()

    /* check config file */
    config_file_exist()
 })

/* design init */
function design_init() {
  $('.grpbtnconfirm').css({ 'cursor': 'default' })
}

/* check and create config file */
function config_file_exist() {
    storage.has('shortcut', function(error, hasKey) {
        if (error) throw error
        if (hasKey) {
            console.log('exist')
        } else {
            console.log('does not exist, create default schedule.json')
            storage.set('shortcut', 'CMD+SHIFT+OPT+P', function(error) {
                if (error) throw error;
                console.log('created for shortcut')
            })
        }
    })
}

/* save shortcut to config file */
function save_shortcut_to_storage(pstr_shortcut) {
    /* storage.set('shortcut', 'CMD+SHIFT+OPT+P', function(error) { */
    storage.set('shortcut', pstr_shortcut, function(error) {
        if (error) throw error;
        console.log('created for shortcut')
    })
}

/* verify shortcut */
function verify_shortcut(pstr_shortcut) {
    /* example */
    /* CommandOrControl+A */
    /* Command+Shift+Z */
    /* const ret = globalShortcut.register('CommandOrControl+Shift+Option+P', () => { */
    const ret = globalShortcut.register('pstr_shortcut', () => {
        console.log('CommandOrControl+Shift+Option+P is pressed')
        return true
    })

    if (!ret) {
        console.log('registration failed')
        return false
    }
}

/* input shortcut config */
var inp_shortcut = document.getElementsByClassName("textshiftcmdaltp")[0];
inp_shortcut.addEventListener ('keydown',  reportKeyEvent);
function reportKeyEvent (event) {
    var reportStr   =
        "The " +
        ( event.ctrlKey  ? "Control " : "" ) +
        ( event.shiftKey ? "Shift "   : "" ) +
        ( event.altKey   ? "Alt "     : "" ) +
        ( event.metaKey  ? "Meta "    : "" ) +
        event.code + " " +
        "key was pressed."

    $(".textshiftcmdaltp").text (reportStr)

    /* was a ctrl-llt-E combo pressed?
    if (event.ctrlKey  &&  event.altKey  &&  event.code === "KeyE") {
        this.hitCnt = ( this.hitCnt || 0 ) + 1;
        $("#statusReport").after (
            '<p>Bingo! cnt: ' + this.hitCnt + '</p>'
        );
    }
    */
    event.stopPropagation ()
    event.preventDefault ()
}

