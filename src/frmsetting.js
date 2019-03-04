
const electron = require('electron')
const path = require('path')
const remote = electron.remote
const ipc_renderer = electron.ipcRenderer
const log = require('electron-log')
log.info('electron-log is on, frmsetting')

/* jquery and jquery-ui */
let $ = require('jquery')

/* mousetrap for shortcut recording */
const mousetrap = require(path.resolve('src/js/mousetrap-master/mousetrap.js'))
require(path.resolve('src/js/mousetrap-master/plugins/bind-dictionary/mousetrap-bind-dictionary.js'))
require(path.resolve('src/js/mousetrap-master/plugins/global-bind/mousetrap-global-bind.js'))
require(path.resolve('src/js/mousetrap-master/plugins/pause/mousetrap-pause.js'))
require(path.resolve('src/js/mousetrap-master/plugins/record/mousetrap-record.js'))

/* storage setting */
const store = require('electron-store');
const storage = new store();

/* document ready */
$(document).ready(function() {
    /* design init */
    design_init()

    /* load shortcut from config */
    shortcut_from_config = storage.get('shortcut')
    $('.txtshortcut').text(shortcut_from_config)
})

/* design init */
function design_init() {
  /* mouse pointer to default */
  $('.grpbtnconfirm').css({ 'cursor': 'default' })
  $('.txtshortcut').css({ 'cursor': 'default' })
}

/* shortcut recording */
$('.txtshortcut').click(function(){
    //console.log('key recording..')
    $(this).text('Press any shortcut')
    $('.txtmessage').css({ 'font-size': '14.0px' })
    $('.txtmessage').text('I\'m recording your key press..')

    mousetrap.record(function(sequence) {
        $('.txtmessage').css({ 'font-size': '15.0px' })
        $('.txtmessage').text('Shortcut to open nadict')

        // sequence is an array like ['ctrl+k', 'c']
        shortcut_from_user = sequence.join('+')
        shortcut_from_user = shortcut_from_user.toUpperCase().replace(/META/g, 'CMD')

        $('.txtshortcut').text(shortcut_from_user)
        log.info(shortcut_from_user)

        /* send main.js to register a new shortcut */
        ipc_renderer.send('setting-to-main', shortcut_from_user)
    })
})

function return_back_to_original_message() {
    $('.txtmessage').css({ 'font-size': '15.0px' })
    $('.txtmessage').text('Shortcut to open nadict')
}

/* verify shortcut */
function verify_shortcut(pstr_shortcut) {
    console.log('message to main "re-register shortcut and let me know if its completed"')
}

ipc_renderer.on('main-to-setting', function (event, arg) {
  console.log('ipc-to-tdd message received: ' + arg)
})
