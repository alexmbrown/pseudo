let console = require('console')
let path = require('path')
let {app, remote, shell} = require('electron')
let fs = require('fs-extra')

function getUserDataPath () {
  return (app || remote.app).getPath('userData')
}

module.exports = {

  copy: function fileUtilCopyFile (serverId, id, file, cb) {
    const dir = path.join(getUserDataPath(), 'pseudo', serverId)
    const ext = path.extname(file)
    const fileName = path.basename(file)
    fs.ensureDir(dir, err => {
      if (err) {
        console.error('Error creating directory', err)
        cb(err)
      } else {
        fs.copy(file, path.join(dir, id + ext), err => cb(err, fileName))
      }
    })
  },

  deleteFile: function fileUtilDeleteFile (serverId, fileId, extension, cb) {
    const filePath = path.join(getUserDataPath(), 'pseudo', serverId, fileId + '.' + extension)
    fs.remove(filePath, cb)
  },

  deleteDir: function fileUtilDeleteFile (serverId, cb) {
    const filePath = path.join(getUserDataPath(), 'pseudo', serverId)
    fs.remove(filePath, cb)
  },

  getPath: (serverId, ...path) => {
    if (path) {
      return [getUserDataPath(), 'pseudo', serverId, ...path].join('/')
    } else {
      return path.join(getUserDataPath(), 'pseudo', serverId)
    }
  },

  view: function fileUtilViewFiles (serverId, cb) {
    const dir = path.join(getUserDataPath(), 'pseudo', serverId)
    fs.ensureDir(dir, err => {
      if (err) {
        console.error('Error creating directory', err)
        cb(err)
      } else {
        shell.showItemInFolder(dir)
      }
    })
  },

  open: function fileUtilOpenFile (serverId, fileId, extension) {
    shell.openItem(path.join(getUserDataPath(), 'pseudo', serverId, fileId + '.' + extension))
  },

  read: function fileUtilReadFile (path) {
    fs.readFileSync(path, 'utf8')
  },

  ensureDirectory: function fileUtilEnsureDirectory (serverId, cb) {
    const dir = path.join(getUserDataPath(), 'pseudo', serverId)
    fs.ensureDir(dir, cb)
  }

}
