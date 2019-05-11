'use strict';

let nconf = require('nconf');

let conf = nconf.file({file: getUserHome() + '/sound-machine-config.json'});

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function saveSettings(key, value) {
    conf.set(key, value);
    conf.save();
}

function readSettings(key) {
    conf.load();
    return conf.get(key);
}

module.exports = {
    saveSettings: saveSettings,
    readSettings: readSettings
};
