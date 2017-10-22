const debug = require('debug')('chinese_whispers:base')
const config = require('./config')
const _options = require('./_options')

require('seneca')({tag: 'chinese_whispers', log: 'silent', timeout: 10000})
    .ready(err => debug('seneca.ready() err:', err))
    .use('consul-registry', config.SENECA_MESH_REGISTRY || {})
    .use('mesh', _options(config))
