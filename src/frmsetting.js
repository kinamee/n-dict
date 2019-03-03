
const electron = require('electron')
const path = require('path')
const remote = electron.remote
const ipc_renderer = electron.ipcRenderer
const globalShortcut = require('electron')

const mousetrap = require(path.resolve('src/js/mousetrap-master/mousetrap.js'));
require(path.resolve('src/js/mousetrap-master/plugins/bind-dictionary/mousetrap-bind-dictionary.js'))
require(path.resolve('src/js/mousetrap-master/plugins/global-bind/mousetrap-global-bind.js'))
require(path.resolve('src/js/mousetrap-master/plugins/pause/mousetrap-pause.js'))
require(path.resolve('src/js/mousetrap-master/plugins/record/mousetrap-record.js'))

let $ = require('jquery')

/* storage setting */
const config_file_path = path.join(__dirname, 'config')
const storage = require('electron-json-storage');
storage.setDataPath(config_file_path);

/* global key bind */
mousetrap.bindGlobal('ctrl+shift', function() {
    console.log('ctrl+shift')
});

/* document ready */
$(document).ready(function() {
    /* design init */
    design_init()

    /* check config file */
    config_file_exist()
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
        shortcut = sequence.join('+')
        shortcut = shortcut.toUpperCase().replace(/META/g, 'CMD')

        $('.txtshortcut').text(shortcut)
        console.log(shortcut)
    });
})

/* check and create config file */
function config_file_exist() {
    storage.has('shortcut', function(error, hasKey) {
        if (error) throw error
        if (hasKey) {
            console.log('exist')
        } else {
            console.log('does not exist')
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
    const ret = globalShortcut.register(pstr_shortcut, () => {
        console.log('CommandOrControl+Shift+Option+P is pressed')
        return true
    })

    if (!ret) {
        console.log('registration failed')
        return false
    }
}

