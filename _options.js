const debug = require('debug')('chinese_whispers:config')

module.exports = function(config = require('./config')) {
    const host = config.HOST;
    const isbase = config.SENECA_MESH_ISBASE
    const pins = config.SENECA_MESH_PINS
    const bases = config.SENECA_MESH_BASES
    const broadcast = config.SENECA_MESH_BROADCAST
    const registry = config.SENECA_MESH_REGISTRY
    debug('host:', host)
    debug('isbase:', isbase)
    debug('pins:', pins)
    debug('bases:', bases)
    debug('broadcast:', broadcast)
    debug('registry:', registry)

    const options = {
        isbase: isbase,
        pins: pins
    }
    if (host) options.host = host
    if (bases) options.bases = bases
    if (broadcast) {
        options.discover = options.discover || {}
        options.discover.multicast = options.discover.multicast || {}
        options.discover.multicast.address = broadcast
    }
    if (registry) {
        options.discover = options.discover || {}
        options.discover.registry = registry
    }
    debug('options:', options)
    return options;
}
