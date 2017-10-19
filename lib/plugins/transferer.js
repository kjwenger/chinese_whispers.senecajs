const debug = require('debug')('chinese_whispers:transferer')
const seneca = require('seneca')()
    .use('mesh')

module.exports = function (options) {
    debug('options:', options)
    this.add('role:transferer,cmd:convey', (msg, respond) => {
        debug('role:transferer,cmd:convey')
        return seneca.act({
            role: 'mesh',
            get: 'members'}, (err, res) => {
            debug('role:mesh,get:members -> res:', res)
            if (err) return respond(err)
            respond({
                in: res.in,
                out: msg.out,
                from: msg.from,
                to: msg.to,
                trace: []
            })
        })
    })
}
