const debug = require('debug')('chinese_whispers:routes')
const _compose = require('./_compose')

function _handler(request, reply, role, cmd) {
    debug(`server.route('${request.path}').handler() request:`, request)
    const pattern = _compose(request)
    pattern.role = role
    pattern.cmd = cmd
    debug(`server.route('${request.path}').handler() pattern:`, pattern)
    return reply.act(pattern)
}

module.exports = _handler
