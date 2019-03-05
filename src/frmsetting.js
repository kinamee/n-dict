
const electron = require('electron')
const path = require('path')
const remote = electron.remote
const ipc_renderer = electron.ipcRenderer
//const log = require('electron-log')
//log.info('electron-log is on, frmsetting')

/* jquery and jquery-ui */
let $ = require('jquery')

/* mousetrap for shortcut recording */
const mousetrap = require(path.join(path.dirname(__dirname), 'extraResources','mousetrap.js'))
require(path.join(path.dirname(__dirname), 'extraResources','mousetrap-record.js'))

/* storage setting */
const store = require('electron-store');
const storage = new store();

/* document ready */
$(document).ready(function() {
    /* design init */
    mouse_pointer_init()

    /* load shortcut from config */
    shortcut_from_config = storage.get('shortcut')
    $('.txtshortcut').text(shortcut_from_config)
})

/* design init */
function mouse_pointer_init() {
  /* mouse pointer to default */
  $('.grpbtnconfirm').css({ 'cursor': 'default' })
  $('.txtshortcut').css({ 'cursor': 'default' })
}

/* shortcut recording */
$('.txtshortcut').click(function(){
    //console.log('key recording..')
    $(this).text('Press any shortcut')
    $('.txtconfirm').text('CANCEL')
    $('.txtmessage').css({ 'font-size': '14.0px' })
    $('.txtmessage').text('I\'m recording your key press..')

    mouse_pointer_init()

    mousetrap.record(function(sequence) {
        $('.txtmessage').css({ 'font-size': '15.0px' })
        $('.txtmessage').text('Shortcut to open nadict')
        $('.txtconfirm').text('CLOSE')
        mouse_pointer_init()

        // sequence is an array like ['ctrl+k', 'c']
        shortcut_from_user = sequence.join('+')
        shortcut_from_user = shortcut_from_user.toUpperCase().replace(/META/g, 'CMD')

        shortcut_from_config = storage.get('shortcut')
        if (shortcut_from_config == shortcut_from_user) {
            return
        }

        $('.txtshortcut').text(shortcut_from_user)
        //log.info(shortcut_from_user)

        /* send main.js to register a new shortcut */
        ipc_renderer.send('setting-to-main', shortcut_from_user)
    })
})

/* cancle or close */
$('.grpbtnconfirm').click(function(){

    txt_on_button = $('.txtconfirm').text()
    if (txt_on_button == 'CANCEL') {
        shortcut_from_config = storage.get('shortcut')
        $('.txtconfirm').text('CLOSE')
        $('.txtshortcut').text(shortcut_from_config)
        mouse_pointer_init()
        return
    }

    var window = remote.getCurrentWindow();
    window.hide();
})

ipc_renderer.on('main-to-setting', function (event, arg) {
  //console.log('ipc-to-tdd message received: ' + arg)
})
