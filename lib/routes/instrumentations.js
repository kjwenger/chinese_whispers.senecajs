const debug = require('debug')('chinese_whispers:routes')
const httpMethods = require('../utilities/http/methods')

const prometheus = require('prom-client')
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
            debug(`server.route('${request.path}').handler()`)
            return reply(prometheus.register.metrics())
        }
    }
]