const debug = require('debug')('chinese_whispers:metrics')
const prometheus = require('prom-client')
const counters = {}
const histograms = {}

function _counter(pattern) {
    const infix = pattern.replace(/:/g, '_').replace(/,/g, '_');
    debug('_counter() infix:', infix)
    return new prometheus.Counter({
        name: `chinese_whispers_acts_${infix}_count`,
        help: `Count of the number of acts to pattern ${pattern}`
    })
}
function _count(pattern) {
    debug('_count() pattern:', pattern)
    if (!counters[pattern]) counters[pattern] = _counter(pattern)
    return counters[pattern].inc()
}
function _histogram(pattern) {
    const infix = pattern.replace(/:/g, '_').replace(/,/g, '_');
    debug('_histogram() infix:', infix)
    return new prometheus.Histogram({
        name: `chinese_whispers_acts_${infix}_duration`,
        help: `Duration of the acts to pattern ${pattern}`
    })
}
function _duration(pattern) {
    debug('_duration() pattern:', pattern)
    if (!histograms[pattern]) histograms[pattern] = _histogram(pattern)
    return histograms[pattern].startTimer()
}

module.exports = {_count, _duration}