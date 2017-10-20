/* global process */
const debug = require('debug')('chinese_whispers:server')
const _ = require('underscore')
const chairo = require('chairo')
const hapi = require('hapi')
const config = require('./config')
const routes = require('./lib/routes')

const server = new hapi.Server()

server.connection({
    port: config.PORT
})

server.register({register: chairo}, function (err) {
    if (err) {
        console.error(err)
        return process.exit(1)
    }

    server.seneca
        .ready(err => debug('seneca.ready() err:', err))
        .use('./lib/plugins/liar', {provider: 'yandex', lie: `It's YUGE!`})
        .use('./lib/plugins/google')
        .use('./lib/plugins/yandex', {key: config.YANDEX_TRANSLATE_API_KEY})
        .use('./lib/plugins/translator')
        .use('./lib/plugins/conductor')
        .use('mesh', {
            isbase: true,
            pins: [
                {role: 'translator', from: 'en', to: 'de'},
                {role: 'translator', from: 'de', to: 'fr', provider: 'liar'},
                {role: 'conductor'}
            ]
        })
})

server.route(routes)

server.start(err => {
    debug('server.start() err:', err)
    if (err) throw err

    debug('server.start() server.info.uri:', server.info.uri)
})