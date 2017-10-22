const debug = require('debug')('chinese_whispers:routes')
const _ = require('underscore')
const httpMethods = require('../utilities/http/methods')

function _extract(list) {
    return _.reduce(list, (outer, listen) =>
        _.reduce(listen.pin, (inner, pin) => {
            inner.push(pin)
            return inner
        }, outer), [])
}

module.exports = [
    {
        method: httpMethods.GET,
        path: '/ami/services/pins',
        config: {
            description: 'Returns all pins of services in the mesh',
            tags: ['ami', 'chinese whispers', 'services', 'pins']
        },
        handler: function (request, reply) {
            debug(`server.route('${request.path}').handler()`)
            return request.seneca.act({
                role: 'mesh',
                get: 'members'
            }, function (err, res) {
                debug('role:mesh,get:members -> res:', JSON.stringify(res, null, 2))
                if (err) return respond(err)
                const pins = _extract(res.list)
                debug('role:mesh,get:members -> pins:', pins)
                return reply(pins)
            })
        }
    }
]