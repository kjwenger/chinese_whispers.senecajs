const debug = require('debug')('chinese_whispers:service')
const config = require('./config')
const _options = require('./_options')
const options = _options(config);
const seneca = require('seneca')({tag: 'service', log: 'silent', timeout: 10000})
// seneca.test('print')
if (options.discover.registry.active) seneca.use('consul-registry', config.SENECA_CONSUL_REGISTRY)
seneca
    .use('./lib/plugins/yandex', {key: config.YANDEX_TRANSLATE_API_KEY})
    .use('mesh', options)
    .ready(err => debug('seneca.ready() err:', err))
