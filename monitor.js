const config = require('./config')
const _options = require('./_options')
const options = _options(config)
options.monitor = true
const seneca = require('seneca')({tag: 'monitor', log: 'silent', timeout: 10000})
if (options.discover.registry.active) seneca.use('consul-registry', config.SENECA_CONSUL_REGISTRY)
seneca.use('mesh', options)