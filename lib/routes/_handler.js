const debug = require('debug')('chinese_whispers:routes')
const _compose = require('./_compose')

function _handler(request, reply, role, cmd) {
    debug(`server.route('${request.path}').handler() request:`, request)
    const pattern = _compose(request)
    pattern.role = role
    pattern.cmd = cmd
    debug(`server.route('${request.path}').handler() pattern:`, pattern)
    request.seneca.act(pattern, function (err, result) {
        debug(`server.route('${request.path}').handler() request.seneca.act() err:`, err)
        debug(`server.route('${request.path}').handler() request.seneca.act() result:`, result)
        if (err) return reply(err)

        return reply(result)
    })
}

module.exports = _handler
