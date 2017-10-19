const debug = require('debug')('chinese_whispers:translator')

module.exports = function (options) {
    debug('options:', options)
    this.add('role:translator,cmd:translate', (msg, respond) => {
        debug('role:translator,cmd:translate')
        const provider = msg.provider || 'google'
        return this.act({
            provider: provider,
            role: 'translator',
            cmd: 'translate',
            text: msg.text,
            from: msg.from,
            to: msg.to}, (err, res) => {
            if (err) return respond(err)
            respond({
                in: res.in,
                out: msg.out,
                from: msg.from,
                to: msg.to,
                corrected: msg.corrected,
                meant: msg.meant
            })
        })
    })
}
