'use strict';

const { ipcRenderer } = require('electron');

let configuration = require('../configuration');

let close = document.querySelector('.close');
close.addEventListener('click', () => ipcRenderer.send('close-settings-window'));

let shortcutCheckboxes = document.querySelectorAll('.global-shortcut');
let shortcutKeys = configuration.readSettings('shortcutKeys');
for (let i = 0; i < shortcutCheckboxes.length; i++) {
    let shortcutKey = shortcutCheckboxes[i].attributes['data-modifier-key'].value;
    shortcutCheckboxes[i].checked = shortcutKeys.indexOf(shortcutKey) !== -1;

    shortcutCheckboxes[i].addEventListener('click', (e) => {
        bindShortcutCheckbox(e);
    });
}

function bindShortcutCheckbox(e) {
    let shortcutKey = e.target.attributes['data-modifier-key'].value;
    let shortcutIdx = shortcutKeys.indexOf(shortcutKey);
    if (shortcutIdx !== -1) {
        shortcutKeys.splice(shortcutIdx, 1);
    }
    else {
        shortcutKeys.push(shortcutKey);
    }

    configuration.saveSettings('shortcutKeys', shortcutKeys);
    ipcRenderer.send('set-global-shortcuts');
}

