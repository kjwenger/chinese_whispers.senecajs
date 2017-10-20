const debug = require('debug')('chinese_whispers:translator')
const _ = require('underscore')
const {_count, _duration} = require('./_metrics')

module.exports = function (options) {
    debug('options:', options)
    const pattern = 'role:translator,cmd:translate'
    this.add(pattern, (msg, respond) => {
        debug(`${pattern} msg:`, _.omit(msg, 'req$', 'tx$'))
        _count(pattern)
        const measure = _duration(pattern)
        const provider = msg.provider || 'google'
        return this.act({
                provider: provider,
                role: 'translator',
                cmd: 'translate',
                text: msg.text,
                from: msg.from,
                to: msg.to
            },
            (err, res) => {
                debug(`${pattern} this.act(...) (err, res) -> res:`, res)
                measure()
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
