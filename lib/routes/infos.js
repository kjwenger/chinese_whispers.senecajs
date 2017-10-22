const debug = require('debug')('chinese_whispers:routes')
const httpMethods = require('../utilities/http/methods')
const config = require('../../config')

module.exports = [
    {
        method: httpMethods.GET,
        path: '/api',
        config: {
            description: 'Returns information of this API',
            tags: ['api', 'chinese whispers', 'infos']
        },
        handler: function (request, reply) {
            debug(`server.route('${request.path}').handler()`)
            return reply({name: config.NAME, version: config.VERSION})
        }
    }
]