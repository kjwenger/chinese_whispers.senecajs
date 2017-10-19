const debug = require('debug')('chinese_whispers:google')
const translate = require('google-translate-api')

module.exports = function (options) {
    debug('options:', options)
    this.add('role:translator,provider:google,cmd:translate', (msg, respond) => {
        debug('role:translator,provider:google,cmd:translate')
        return translate(msg.text, {from: msg.from, to: msg.to}).then(res => {
            debug('role:translator,provider:google,cmd:translate (res) -> res:', res)
            respond({
                provider: 'google',
                in: res.from.text.value || msg.text,
                out: res.text,
                from: msg.from,
                to: msg.to,
                corrected: res.from.text.autoCorrected,
                meant: res.from.text.didYouMean
            })
        }).catch(err => {
            respond(err)
        })
    })
}
