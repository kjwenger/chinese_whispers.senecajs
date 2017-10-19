const expect = require('chai').expect

module.exports = function (seneca, variant, done, debug = require('debug')('chinese_whispers:_act-test')) {
    if (variant.provider) {
        debug(`${this.test.title} seneca.has({provider: '${variant.provider}'): `,
            seneca.has({provider: variant.provider}))
    }
    debug(`${this.test.title} variant: `, variant)
    seneca
        .test(done)
        .gate()
        .act(variant, (err, res) => {
            debug(`${this.test.title} err: `, err)
            debug(`${this.test.title} res: `, res)
            expect(err).to.be.null
            expect(res).to.have.property('in', variant.in)
            expect(res).to.have.property('out', variant.out)
            expect(res).to.have.property('from', variant.from)
            expect(res).to.have.property('to', variant.to)
        })
        .ready(done)
    return seneca
}