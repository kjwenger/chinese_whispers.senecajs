const debug = require('debug')('chinese_whispers:conductor')
const _ = require('underscore')
const async = require('async')
const seneca = require('seneca')()
    .use('mesh')
const {_count, _duration} = require('./_metrics')
const {_extract, _routes, _route} = require('./_pins')

function _convey(route, msg, response, respond, measure) {
    const that = this
    let text = msg.text
    async.eachSeries(route,
        function (node, next) {
            debug('_convey() text:', text)
            debug('_convey() node:', node)
            const data = {
                cmd: 'translate',
                text: text
            }
            debug('_convey() data:', data)
            that.act(node.pin, data, function (err, res) {
                debug('_convey() err:', err)
                debug('_convey() res:', res)
                if (err) return next(err)
                response.trace.push(res)
                response.out = res.out
                text = res.in
                return next()
            })
        },
        function (err) {
            debug('_convey() err:', err)
            measure()
            if (err) return respond(err)
            respond(response)
        })
}

module.exports = function (options) {
    debug('options:', options)
    const pattern = 'role:conductor,cmd:convey'
    this.add(pattern, function (msg, respond) {
        debug(`${pattern} msg:`, _.omit(msg, 'req$', 'tx$'))
        _count(pattern)
        const measure = _duration(pattern)
        return seneca.act({
            role: 'mesh',
            get: 'members'
        }, function (err, res) {
            debug('role:mesh,get:members -> res:', JSON.stringify(res, null, 2))
            if (err) return respond(err)
            const pins = _extract(res.list)
            debug('role:mesh,get:members -> pins:', pins)
            const roots = _routes(pins, {from: msg.from, to: msg.to, nodes: []}).nodes
            debug('role:mesh,get:members -> roots:', JSON.stringify(roots, null, 2))
            const route = []
            const routed = _route(roots, msg.from, msg.to, route)
            debug('role:mesh,get:members -> routed:', routed)
            debug('role:mesh,get:members -> route:', route)
            const response = {
                trace: [],
                from: msg.from,
                to: msg.to,
                in: msg.text
            }
            if (routed) {
                _convey.call(this, route, msg, response, respond, measure)
            } else {
                respond(response)
            }
        })
    })
}
