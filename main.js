'use strict';

const { app, BrowserWindow, ipcMain, globalShortcut, Menu, Tray } = require('electron');

let configuration = require('./configuration');
let path = require('path');


let mainWindow = null;

app.on('ready', function() {
    if (!configuration.readSettings('shortcutKeys')) {
        configuration.saveSettings('shortcutKeys', ['ctrl', 'shift']);
    }

    mainWindow = new BrowserWindow({
        height: 600,
        width: 800
    });

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');

    setGlobalShortcuts();
    createTray();
});

function setGlobalShortcuts() {
    globalShortcut.unregisterAll();

    let shortcutKeySetting = configuration.readSettings('shortcutKeys');
    let shortcutPrefix = shortcutKeySetting.length === 0 ? '' : shortcutKeySetting.join('+') + '+';

    globalShortcut.register(shortcutPrefix + '1', () => mainWindow.webContents.send('global-shortcut', 0));
    globalShortcut.register(shortcutPrefix + '2', () => mainWindow.webContents.send('global-shortcut', 1));
}

ipcMain.on('close-main-window', () => app.quit());

let settingsWindow = null;
function createSettingWindow() {
    if (settingsWindow) {
        return;
    }

    settingsWindow = new BrowserWindow({
        frame: false,
        height: 200,
        resizable: false,
        width: 200
    });

    // settingsWindow.webContents.openDevTools();

    settingsWindow.loadURL('file://' + __dirname + '/app/settings.html');

    settingsWindow.on('closed', () => settingsWindow = null);
}

ipcMain.on('open-settings-window', createSettingWindow);

ipcMain.on('close-settings-window', () => {
    if (settingsWindow) {
        settingsWindow.close();
    }
});

ipcMain.on('set-global-shortcuts', () => {
    setGlobalShortcuts();
})

// 系统托盘和托盘菜单
function createTray() {
    let trayIcon = null;
    if (process.platform === 'darwin') {
        trayIcon = new Tray(path.join(__dirname, 'app/img/tray-iconTemplate.png'));
    }
    else {
        trayIcon = new Tray(path.join(__dirname, 'app/img/tray-icon-alt.png'));
    }
    
    let trayMenuTemplate = [
        {
            label: 'Sound Machine',
            enable: false
        },
        {
            label: 'Settings',
            click: createSettingWindow
        },
        {
            label: 'Close',
            click: () => app.quit()
        }
    ]
    let trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
    trayIcon.setContextMenu(trayMenu);    
}
