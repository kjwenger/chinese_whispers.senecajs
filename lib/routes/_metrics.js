const debug = require('debug')('chinese_whispers:metrics')
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
    return counters[path].inc()
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

module.exports = {_count, _duration}