'use strict';

const { ipcRenderer } = require('electron');

let soundButtons = document.querySelectorAll('.button-sound');

for (let i = 0; i < soundButtons.length; i++) {
    let soundButton = soundButtons[i];
    let soundName = soundButton.attributes['data-sound'].value;

    prepareButton(soundButton, soundName);
}

function prepareButton(soundButton, soundName) {
    soundButton.querySelector('span').style.backgroundImage = 'url("img/icons/' + soundName + '.png")';

    let audio = new Audio(__dirname + '/wav/' + soundName + '.wav');
    soundButton.addEventListener('click', () => {
        audio.currentTime = 0;
        audio.play();
    });
}


let mainClose = document.querySelector('.close');
mainClose.addEventListener('click', () => ipcRenderer.send('close-main-window'));

ipcRenderer.on('global-shortcut', (event, arg) => {
    var e = new MouseEvent('click');
    soundButtons[arg].dispatchEvent(e);
});

let mainSettings = document.querySelector('.settings');
mainSettings.addEventListener('click', () => ipcRenderer.send('open-settings-window'));
