const debug = require('debug')('chinese_whispers:yandex')
const yandex = require('yandex-translate')

module.exports = function (options) {
    debug('options:', options)
    const key = options.key
    this.translator = yandex(key)

    this.add({
        role: 'translator',
        cmd: 'translate',
        provider: {default$: 'yandex', required$: false, string$: true}
    }, (msg, respond) => {
        debug('role:translator,provider:yandex,cmd:translate')
        return this.translator.translate(msg.text, {from: msg.from, to: msg.to}, (err, res) => {
            debug('role:yandex,cmd:translate this.translator.translate() -> res: ', res)
            if (err) return respond(err)
            respond({
                provider: 'yandex',
                in: msg.text,
                out: res.text[0] || res.text,
                from: msg.from,
                to: msg.to
            })
        })
    })
}
