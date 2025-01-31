/* This file is automatically added by @npmcli/template-oss. Do not edit. */

'use strict'

const { readdirSync: readdir } = require('fs')

const localConfigs = readdir(__dirname)
  .filter((file) => file.startsWith('.eslintrc.local.'))
  .map((file) => `./${file}`)

module.exports = {
  root: true,
  extends: [
    '@npmcli',
    ...localConfigs,
  ],
  settings: {
    'import/resolver': {
      typescript: { project: './' },
      // たぶんeslintrc.jsからtsconfig.jsonがあるディレクトリへの相対パス
    },
  },
}
