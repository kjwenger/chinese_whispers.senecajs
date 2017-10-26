/* global process */
const debug = require('debug')('chinese_whispers:server')
const _ = require('underscore')
const chairo = require('chairo')
const hapi = require('hapi')
const routes = require('./lib/routes')
const config = require('./config')
const _options = require('./_options')

const server = new hapi.Server()

const options = {
    port: config.PORT
}
if (config.HOST) options.host = config.HOST
server.connection(options)

server.register({register: chairo}, function (err) {
    if (err) {
        console.error(err)
        return process.exit(1)
    }

    const seneca = server.seneca
    const options = _options(config)
    if (options.discover.registry.active) seneca.use('consul-registry', config.SENECA_CONSUL_REGISTRY)
    seneca
        .use('mesh', options)
        .ready(err => {
            debug('server.register({register: chairo}) seneca.ready() err:', err)
            if (err) throw err
        })
        .use('./lib/plugins/liar', {provider: 'yandex', lie: `It's YUGE!`})
        .use('./lib/plugins/google')
        .use('./lib/plugins/yandex', {key: config.YANDEX_TRANSLATE_API_KEY})
        .use('./lib/plugins/translator')
        .use('./lib/plugins/conductor')
})

server.route(routes)

server.start(err => {
    debug('server.start() err:', err)
    if (err) throw err

    debug('server.start() server.info.uri:', server.info.uri)
})