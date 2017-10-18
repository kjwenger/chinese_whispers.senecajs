const translate = require('google-translate-api')

module.exports = function () {
    this.add('role:google,cmd:translate', (msg, respond) => {
        translate(msg.text, {from: msg.from, to: msg.to}).then(res => {
            respond({
                in: res.from.text.value,
                out: msg.text,
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
