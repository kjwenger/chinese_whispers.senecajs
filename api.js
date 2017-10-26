const debug = require('debug')('chinese_whispers:api')
const _ = require('underscore')
const hapi = require('hapi')
const config = require('./config')
const _options = require('./_options')

const options = _options(config)
const seneca = require('seneca')({tag: 'chinese_whispers', log: 'silent', timeout: 10000});
if (options.discover.registry.active) seneca.use('consul-registry', config.SENECA_CONSUL_REGISTRY)
seneca
    .test('print')
    .use('mesh', options)
    .ready(function () {
        const server = new hapi.Server()

        server.connection({
            port: config.PORT
        })

        server.route({
            method: 'GET',
            path: '/ami/services/pins',
            handler: function (req, reply) {
                return request.seneca.act({
                    role: 'mesh',
                    get: 'members'
                }, function (err, res) {
                    debug('role:mesh,get:members -> res:', JSON.stringify(res, null, 2))
                    if (err) return respond(err)
                    const pins = _.reduce(list, (outer, listen) =>
                        _.reduce(listen.pin, (inner, pin) => {
                            inner.push(pin)
                            return inner
                        }, outer), [])(res.list)
                    debug('role:mesh,get:members -> pins:', pins)
                    return reply(pins)
                })
            }
        })

        server.start(function () {
            console.log('api', server.info.host, server.info.port)
        })
    })
