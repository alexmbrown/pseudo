'use strict'

const {app, remote, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

// require('electron-reload')(__dirname, {
//   electron: path.join(__dirname, '/../../node_modules/.bin/electron')
// })

// boot strap server
global.bootstrapServer = require('./bootstrap-server')

// open file dialog
const { dialog } = require('electron')
global.openFileDialog =  dialog.showOpenDialog

// copy file
const fileUtils = require('./utils/file.util')
global.copy = fileUtils.copy
global.viewFiles = fileUtils.viewFiles
global.deleteFile = fileUtils.deleteFile
global.openFile = fileUtils.openFile

let win

const createWindow = () => {
  setTimeout(() => {
    win = new BrowserWindow({
      width: 800,
      height: 600,
      icon: './src/favicon.ico',
      // webPreferences: {
      //   devTools: false
      // }
    })

    win.loadURL(url.format({
      pathname: 'localhost:4200',
      protocol: 'http:',
      slashes: true
    }))

    win.webContents.openDevTools()
    win.maximize()

    win.on('closed', () => {
      win = null
    })
  }, 10000)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
