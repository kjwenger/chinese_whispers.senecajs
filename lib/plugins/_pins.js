const debug = require('debug')('chinese_whispers:pins')
const _ = require('underscore')

/*
"res": {
  "list": [
    {
      "pin": [
        "from:en,role:translator,to:de",
        "from:de,provider:yandex,role:translator,to:fr",
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

module.exports = {_extract, _routes, _route}