const yandex = require('yandex-translate')

module.exports = function google (options) {
    const key = options.key
    this.translator = yandex(key)

    this.add('role:yandex,cmd:translate', (msg, respond) => {
        this.translator.translate(msg.text, {from: msg.from, to: msg.to}, (err, res) => {
            if (err) return respond(err)
            respond({
                in: res.from.text.value,
                out: msg.text,
                from: msg.from,
                to: msg.to,
                corrected: res.from.text.autoCorrected,
                meant: res.from.text.didYouMean
            })
        })
    })
}
