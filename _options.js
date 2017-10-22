const debug = require('debug')('chinese_whispers:config')

module.exports = function(config = require('./config')) {
    let options = config.SENECA_MESH_OPTIONS
    if (options) {
        debug('options:', options)
        return options
    }

    const host = config.SENECA_MESH_HOST
    const port = config.SENECA_MESH_PORT
    const isbase = config.SENECA_MESH_ISBASE
    const pins = config.SENECA_MESH_PINS
    const bases = config.SENECA_MESH_BASES
    const broadcast = config.SENECA_MESH_BROADCAST
    const registry = config.SENECA_CONSUL_REGISTRY
    debug('isbase:', isbase)
    if (host) debug('host:', host)
    if (port) debug('port:', port)
    if (pins) debug('pins:', pins)
    if (bases) debug('bases:', bases)
    if (broadcast) debug('broadcast:', broadcast)
    if (registry) debug('registry:', registry)

    options = {
        isbase: isbase,
        dumpnet: false,
        sneeze: {
            silent: false
        }
    }
    if (host) options.host = host
    if (pins && pins.length) options.pins = pins
    if (bases) options.bases = bases
    options.discover = options.discover || {}
    options.discover.registry = options.discover.registry || {}
    options.discover.registry.active = false
    options.discover.multicast = options.discover.multicast || {}
    options.discover.multicast.active = true
    if (registry) {
        options.discover.registry.active = true
        options.discover.multicast.active = false
    } else if (broadcast) {
        options.discover.multicast.address = broadcast
    }
    debug('options:', options)
    return options
}
