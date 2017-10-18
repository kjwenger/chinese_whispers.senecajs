const seneca = require('seneca')()
const expect = require('chai').expect
const config = require('../../config')

seneca.use('../../lib/plugins/yandex', {key: config.YANDEX_TRANSLATE_API_KEY})

describe('yandex plugin', () => {
    describe('with role yandex and cmd translate', () => {
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
                        role: 'yandex',
                        cmd: 'translate',
                        text: variant.in,
                        from: variant.from,
                        to: variant.to}, (err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.property('in', variant.in)
                    expect(res).to.have.property('out', variant.out)
                })
            })
        })
    })
})