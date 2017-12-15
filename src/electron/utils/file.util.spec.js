'use strict'

const path = require('path')
const rewire = require('rewire')

describe('File Util', () => {
  let fileUtil
  let rewires

  beforeEach(() => {
    rewires = {
      app: jasmine.createSpyObj('app', ['getPath']),
      console: jasmine.createSpyObj('console', ['error']),
      fs: jasmine.createSpyObj('fs', ['copy', 'ensureDir']),
      path
    }
    rewires.app.getPath.and.returnValue('/mock/user/data/path')
    spyOn(path, 'join').and.callThrough()
    spyOn(path, 'extname').and.callThrough()
    spyOn(path, 'basename').and.callThrough()

    fileUtil = rewire('./file.util')
    fileUtil.__set__(rewires)
  })

  describe('copyFile', () => {
    it('should copy a file to server directory', done => {
      const serverId = 'mock_server_id'
      const fileId = 'mock_file_id'
      const filePath = 'mock/file/path.txt'
      fileUtil.copyFile(serverId, fileId, filePath, () => {
        done()
      })
      expect(rewires.path.join).toHaveBeenCalledWith('/mock/user/data/path', 'pseudo', serverId)
      expect(rewires.path.extname).toHaveBeenCalledWith(filePath)
      expect(rewires.path.basename).toHaveBeenCalledWith(filePath)
      expect(rewires.fs.ensureDir).toHaveBeenCalledWith('/mock/user/data/path/pseudo/mock_server_id', jasmine.any(Function))
      rewires.fs.ensureDir.calls.mostRecent().args[1]()
      expect(rewires.path.join).toHaveBeenCalledWith('/mock/user/data/path/pseudo/mock_server_id', 'mock_file_id.txt')
      expect(rewires.fs.copy).toHaveBeenCalledWith(filePath, '/mock/user/data/path/pseudo/mock_server_id/mock_file_id.txt', jasmine.any(Function))
      rewires.fs.copy.calls.mostRecent().args[2]()
    })

    it('should log and return error when fs.ensureDir fails', done => {
      const error = new Error('mock error')
      fileUtil.copyFile('', '', '', err => {
        expect(rewires.console.error).toHaveBeenCalledWith('Error creating directory', error)
        expect(error, err)
        done()
      })
      rewires.fs.ensureDir.calls.mostRecent().args[1](error)
    })
  })

  describe('deleteFile', () => {
    xit('should remove a file', done => {
      const serverId = 'mock_server_id'
      const fileId = 'mock_file_id'
      const extension = 'ext'
      fileUtil.deleteFile(serverId, fileId, extension, () => {
        done()
      })
      expect(rewires.path.join).toHaveBeenCalledWith('path_join', 'pseudo', serverId, fileId + '.' + extension)
      expect(rewires.fs.remove).toHaveBeenCalledWith('path_join')
    })
  })

  describe('getPath', () => {

  })

  describe('viewFiles', () => {

  })

  describe('openFile', () => {

  })

  describe('readFile', () => {

  })

  describe('ensureDirectory', () => {

  })
})
