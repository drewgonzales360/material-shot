/****************************************************************
FileName: main.js
Kenneth Drew Gonzales

Description:
This is a videogame using a tile sized map
and you play one character that moves through the map. The
player is always shown in the center of the screen.

Last Edited: 8/29/16
****************************************************************/

// Module to control application life.
const electron = require('electron')

// Module to create native browser window.
const app             = electron.app
const BrowserWindow   = electron.BrowserWindow
const ipcMain         = electron.ipcMain;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let backgroundProcess

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    center: true,
    // resizable: false,
    // fullscreen: true,
    frame: false
    })

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/app/menu.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    app.quit();
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

/****************************************************************
Main functions
summary
  In this file you can include the rest of your app's specific main process
  code. You can also put them in separate files and require them here.
****************************************************************/
var shrinkFactor    = 150;
var targetSpawnRate = 2000;
ipcMain.on('game-settings', function(event, difficulty, type){
    console.log("Difficult: " + difficulty + ", Type: " + type);
    switch (difficulty) {
        case "easy":
            shrinkFactor    = 150;
            targetSpawnRate = 2000;
            break;
        case "medium":
            shrinkFactor    = 100;
            targetSpawnRate = 1000;
            break;
        case "hard":
            shrinkFactor    = 75;
            targetSpawnRate = 750;
            break;
        case "harder":
            shrinkFactor    = 50;
            targetSpawnRate = 300;
            break;
        default:
            shrinkFactor = 150;
            targetSpawnRate = 2000;
    }
    
    switch (type) {
        case "accuracy":
            shrinkFactor    = shrinkFactor / 2;
            break;
        case "reflex":
            shrinkFactor    = shrinkFactor * 2;
            break;
        default:
    }
})

ipcMain.on('get-difficulty', function(event){
    event.returnValue = { shrinkFactor: shrinkFactor, targetSpawnRate: targetSpawnRate};
})

ipcMain.on('quit', function(event){
    app.quit();
})