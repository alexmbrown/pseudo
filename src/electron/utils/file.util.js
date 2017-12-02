const path = require('path')
const {app, remote, shell} = require('electron')
const userDataPath = (app || remote.app).getPath('userData')
const fs = require('fs-extra')

module.exports = {

  copy: (serverId, id, file, cb) => {
    const dir = path.join(userDataPath, 'pseudo', serverId)
    const ext = path.extname(file)
    const fileName = path.basename(file)
    fs.ensureDir(dir, err => {
      if (err) {
        console.error('Error creating directory', err)
        cb(err);
      } else {
        fs.copy(file, path.join(dir, id + ext), err => cb(err, fileName))
      }
    })
  },

  deleteFile: (serverId, fileId, extension, cb) => {
    const filePath = path.join(userDataPath, 'pseudo', serverId, fileId + '.' + extension)
    fs.remove(filePath, cb)
  },

  getPath: serverId => path.join(userDataPath, 'pseudo', serverId),

  viewFiles: serverId => {
    const dir = path.join(userDataPath, 'pseudo', serverId)
    fs.ensureDir(dir, err => {
      if (err) {
        console.error('Error creating directory', err)
        cb(err);
      } else {
        shell.showItemInFolder(dir)
      }
    })
  },

  openFile: (serverId, fileId, extension) => {
    shell.openItem(path.join(userDataPath, 'pseudo', serverId, fileId + '.' + extension))
  }

}
