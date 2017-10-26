const debug = require('debug')('chinese_whispers:api')
const _ = require('underscore')
const hapi = require('hapi')
const httpMethods = require('./lib/utilities/http/methods')
const {_validateQuery} = require('./lib/routes/_validate')
const _hapiSwagger = require('./lib/routes/_hapiSwagger')
const _handler = require('./lib/routes/_handler')
const config = require('./config')
const _options = require('./_options')
const options = _options(config)
const seneca = require('seneca')({tag: 'api', log: 'silent', timeout: 10000});
// seneca.test('print')
if (options.discover.registry.active) seneca.use('consul-registry', config.SENECA_CONSUL_REGISTRY)
seneca
    .use('mesh', options)
    .ready(function () {
        const server = new hapi.Server()

        server.connection({
            port: config.PORT
        })

        server.route({
            method: httpMethods.GET,
            path: '/ami/services/pins',
            handler: function (request, reply) {
                return seneca.act({
                    role: 'mesh',
                    get: 'members'
                }, function (err, res) {
                    debug('role:mesh,get:members -> res:', JSON.stringify(res, null, 2))
                    if (err) return respond(err)
                    const pins = []
                    res.list.forEach(listen => listen.pin.forEach(pin => pins.push(pin)))
                    debug('role:mesh,get:members -> pins:', pins)
                    return reply(pins)
                })
            }
        })
        const _translateHandler = function (request, reply) {
            return _handler(request, reply, 'translator', 'translate', seneca)
        }
        server.route({
            method: httpMethods.GET,
            path: '/api/whispers/translations',
            config: {
                description: 'Return the translation from one locale to another locale of a posted chinese whisper',
                tags: ['api', 'chinese whispers', 'translations'],
                validate: {
                    query: _validateQuery
                },
                plugins: {
                    'hapi-swagger': _hapiSwagger
                }
            },
            handler: _translateHandler
        })
        const _conveyHandler = function (request, reply) {
            return _handler(request, reply, 'conductor', 'convey', seneca)
        }
        const _description = 'Return all the chained translation from one locale to another locale of a posted chinese whisper'
        server.route({
            method: httpMethods.GET,
            path: '/api/whispers',
            config: {
                description: _description,
                tags: ['api', 'chinese whispers'],
                validate: {
                    query: _validateQuery
                },
                plugins: {
                    'hapi-swagger': _hapiSwagger
                }
            },
            handler: _conveyHandler
        })

        server.start(function () {
            console.log('api', server.info.host, server.info.port)
        })
    })
