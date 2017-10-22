/* global process */
const debug = require('debug')('chinese_whispers:server')
const _ = require('underscore')
const chairo = require('chairo')
const hapi = require('hapi')
const config = require('./config')
const routes = require('./lib/routes')
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

    server.seneca
        .ready(err => debug('server.register({register: chairo}) seneca.ready() err:', err))
        .use('./lib/plugins/liar', {provider: 'yandex', lie: `It's YUGE!`})
        .use('./lib/plugins/google')
        .use('./lib/plugins/yandex', {key: config.YANDEX_TRANSLATE_API_KEY})
        .use('./lib/plugins/translator')
        .use('./lib/plugins/conductor')
        .use('mesh', _options(config))
})

server.route(routes)

server.start(err => {
    debug('server.start() err:', err)
    if (err) throw err

    debug('server.start() server.info.uri:', server.info.uri)
})