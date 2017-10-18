const seneca = require('seneca')()
const expect = require('chai').expect

seneca.use('../../lib/plugins/google')

describe('google plugin', () => {
    describe('with role google and cmd translate', () => {
        const variants = [
            {
                in: 'Hi, neighbor!',
                out: 'Hallo, Nachbar!',
                from: 'en',
                to: 'de'
            }
        ]
        variants.forEach(variant => {
            it(`should do from "${variant.from}" in "${variant.in}" to "${variant.to}" out "${variant.out}"`, () => {
                seneca.act({
                        role: 'google',
                        cmd: 'translate',
                        text: variant.in,
                        from: variant.from,
                        to: variant.to}, (err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.property('in', variants.in)
                    expect(res).to.have.property('out', variants.out)
                })
            })
        })
    })
})
