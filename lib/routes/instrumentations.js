const debug = require('debug')('chinese_whispers:routes')
const prometheus = require('prom-client')
const httpMethods = require('../utilities/http/methods')

prometheus.collectDefaultMetrics({timeout: 5000})

module.exports = [
    {
        method: httpMethods.GET,
        path: '/ami/metrics',
        config: {
            description: 'Returns metrics of the underlying node instance of the server',
            tags: ['ami', 'chinese whispers', 'metrics']
        },
        handler: function (request, reply) {
            debug(`server.route('${request.path}').handler() request:`, request)
            return reply(prometheus.register.metrics())
        }
    }
]