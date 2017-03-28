/* eslint-env jest */
var FILE = '../lib/utils'

jest.unmock(FILE)
jest.unmock('async')
jest.setMock('rimraf', jest.fn(function (file, opts, cb) { cb() }))

describe('#delete', function () {
  test('should delete an array of files', function (done) {
    var files = ['file1', 'file2', 'file3']
    var del = require(FILE).del
    var rimraf = require('rimraf')
    del(files, function (err) {
      expect(err).toBe(null)
      expect(rimraf.mock.calls.length).toBe(3)
      for (var i = 0; i < files.length; ++i) {
        expect(rimraf.mock.calls[i][0])
          .toBe(files[i])
      }
      done()
    })
  })
})
