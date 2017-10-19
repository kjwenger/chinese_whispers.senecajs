const debug = require('debug')('chinese_whispers:liar')

module.exports = function (options) {
    debug('options:', options)
    const provider = options.provider || 'liar';
    const lie = options.lie || 'It is true, you know!';
    const lies = options.lies || {};
    this.add('role:translator,provider:liar,cmd:translate', (msg, respond) => {
        debug('role:translator,provider:liar,cmd:translate')
        respond({
            provider: provider,
            in: msg.text,
            out: lies[msg.text] || lie,
            from: msg.from,
            to: msg.to
        })
    })
}
