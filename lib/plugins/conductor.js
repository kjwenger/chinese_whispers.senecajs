const debug = require('debug')('chinese_whispers:conductor')
const _ = require('underscore')
const async = require('async')
const seneca = require('seneca')()
    .use('mesh')

/*
"res": {
  "list": [
    {
      "pin": [
        "from:en,role:translator,to:de",
        "from:de,role:translator,to:fr",
        "role:conductor"
      ],
      "port": 53496,
      "host": "0.0.0.0",
      "type": "web",
      "model": "consume",
      "instance": "sdo1uzmpsdcd/1508432143021/18481/3.4.3/chinese_whispers"
    },
    {
      "pin": [
        "null:true"
      ],
      "port": 57891,
      "host": "0.0.0.0",
      "type": "web",
      "model": "consume",
      "instance": "43pazvtu8cfy/1508432147334/18499/3.4.3/chinese_whispers"
    }
  ]
}
 */
function _extract(list) {
    return _.reduce(list, (outer, listen) =>
        _.reduce(listen.pin, (inner, pin) => {
            if (pin.match(/.*from:.*,.*role:translator,.*to:.*/)) inner.push(pin)
            return inner
        }, outer), [])
}

function _routes(pins, root) {
    debug('_routes() root:', root)
    return _.reduce(pins, (memo, pin) => {
        let match = pin.match(new RegExp(`.*from:${memo.from},.*role:translator,.*to:(\\w+).*`))
        if (match) {
            const node = {pin: pin, nodes: [], from: memo.from, to: match[1]}
            memo.nodes.push(node)
            _routes(pins, {from: match[1], to: root.to, nodes: node.nodes})
        }
        return memo
    }, root)
}

function _route(roots, from, to, pins) {
    debug('_route() roots:', roots)
    debug('_route() from:', from, 'to:', to)
    return _.reduce(roots, (memo, node) => {
        debug('_route() node:', node)
        const match = node.pin.match(new RegExp(`.*from:${from},.*role:translator,.*to:(\\w+).*`))
        debug('_route() match:', match)
        if (match) {
            pins.push(node)
            debug('_route() pins:', pins)
            debug('_route() (node.to === to):', (node.to === to))
            if (node.to === to) return true
            else return _route(node.nodes, node.to, to, pins)
        }
        return false
    }, pins)
}

function _convey(route, msg, response, respond) {
    const that = this
    let text = msg.text
    async.eachSeries(route,
        function (node, next) {
            debug('_convey() text:', text)
            debug('_convey() node:', node)
            const data = {
                cmd: 'translate',
                text: text
            };
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
            if (err) return respond(err)
            respond(response)
        });
}

module.exports = function (options) {
    debug('options:', options)
    this.add('role:conductor,cmd:convey', function (msg, respond) {
        debug('role:conductor,cmd:convey')
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
                in: msg.text,
                from: msg.from,
                to: msg.to,
                trace: []
            }
            if (routed) {
                _convey.call(this, route, msg, response, respond)
            } else {
                respond(response)
            }
        })
    })
}
