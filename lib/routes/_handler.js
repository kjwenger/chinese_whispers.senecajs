const debug = require('debug')('chinese_whispers:routes')
const _compose = require('./_compose')

const prometheus = require('prom-client')
const counters = {}
const histograms = {}

function _counter(path) {
    const infix = path.replace(/\//g, '_')
    debug('_counter() infix:', infix)
    return new prometheus.Counter({
        name: `chinese_whispers_requests${infix}_count`,
        help: `Count of the number of requests to route ${path}`
    })
}
function _count(path) {
    debug('_count() path:', path)
    if (!counters[path]) counters[path] = _counter(path)
    counters[path].inc()
}

function _histogram(path) {
    const infix = path.replace(/\//g, '_')
    debug('_histogram() infix:', infix)
    return new prometheus.Histogram({
        name: `chinese_whispers_requests${infix}_duration`,
        help: `Duration of the requests to route ${path}`
    })
}
function _duration(path) {
    debug('_duration() path:', path)
    if (!histograms[path]) histograms[path] = _histogram(path)
    return histograms[path].startTimer()
}

function _handler(request, reply, role, cmd, seneca = request.seneca) {
    debug(`server.route('${request.path}').handler()`)

    _count(request.path)
    const measure = _duration(request.path)

    const data = _compose(request)
    const pattern = `cmd:${cmd},from:${data.from},role:${role},to:${data.to}`
    debug(`server.route('${request.path}').handler() pattern:`, pattern)
    debug(`server.route('${request.path}').handler() data:`, data)
    seneca.act(pattern, data, function (err, result) {
        debug(`server.route('${request.path}').handler() request.seneca.act() err:`, err)
        debug(`server.route('${request.path}').handler() request.seneca.act() result:`, result)

        measure()

        if (err) return reply(err)

        return reply(result)
    })
}

module.exports = _handler
