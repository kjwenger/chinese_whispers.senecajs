const debug = require('debug')('chinese_whispers:translator')

module.exports = function (options) {
    debug('options:', options)
    this.add('role:translator,cmd:translate', (msg, respond) => {
        debug('role:translator,cmd:translate msg:', msg)
        const provider = msg.provider || 'google'
        return this.act({
            provider: provider,
            role: 'translator',
            cmd: 'translate',
            text: msg.text,
            from: msg.from,
            to: msg.to}, (err, res) => {
            debug('role:translator,cmd:translate this.act(...) (err, res) -> res:', res)
            if (err) return respond(err)
            respond({
                provider: res.provider,
                in: res.in,
                out: res.out,
                from: res.from,
                to: res.to,
                corrected: res.corrected,
                meant: res.meant
            })
        })
    })
}
