const config = require('./config')
const _options = require('./_options')

const seneca = require('seneca')({tag: 'chinese_whispers', log: 'silent'})
const options = _options(config)
if (options.discover.registry.active) seneca.use('consul-registry', config.SENECA_CONSUL_REGISTRY)
options.monitor = true
seneca.use('mesh', options)