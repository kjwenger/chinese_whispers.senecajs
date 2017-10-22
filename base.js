const debug = require('debug')('chinese_whispers:base')
const config = require('./config')
const _options = require('./_options')

const options = _options(config)

const seneca = require('seneca')({tag: 'chinese_whispers', log: 'silent', timeout: 10000})
seneca.ready(err => debug('seneca.ready() err:', err))
if (options.discover.registry.active) seneca.use('consul-registry', config.SENECA_CONSUL_REGISTRY)
seneca.use('mesh', options)
