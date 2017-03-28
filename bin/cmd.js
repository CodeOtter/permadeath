#!/usr/bin/env node
'use strict'

var argv = require('minimist')(process.argv.slice(2), {
  boolean: ['file', 'dry-run'],
  alias: {
    'dry-run': ['d', 'dry'],
    'file': 'f'
  }
})

var files = argv._
delete argv._

require('../index')(files, argv)
