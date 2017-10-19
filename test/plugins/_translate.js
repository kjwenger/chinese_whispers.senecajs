const _ = require('underscore')
const Seneca = require('seneca')
const expect = require('chai').expect
const variants = require('./variants.json')
const _act = require('./_act')

module.exports = function(provider, options) {
    const debug = require('debug')(`chinese_whispers:${provider}-test`)

    describe(provider, function () {
        describe('as plugin', function () {
            describe(`with provider: ${provider}, cmd: translate`, function () {
                _.each(variants, variant => {
                    const title = `should do`
                        + `  from: "${variant.from}", in: "${variant.in}"`
                        + `  to: "${variant.to}", out: "${variant.out}"`
                    it(title,  function (done) {
                        const seneca = Seneca({log: 'test'})
                        seneca.use(`../../lib/plugins/${provider}`, options)
                        _act.call(this, seneca, _.extend(variant, {provider: provider}), done, debug)
                    })
                })
            })
        })

        describe('as service', function () {
            describe(`with provider: ${provider}, cmd: translate`, function () {
                let seneca

                beforeEach(function () {
                    seneca = Seneca({log: 'test'})
                        .use(`../../lib/plugins/${provider}`, options)
                        .listen()
                })

                afterEach(function (done) {
                    seneca.close(done)
                })

                _.each(variants, variant => {
                    const title = `should do`
                        + `  from: "${variant.from}", in: "${variant.in}"`
                        + `  to: "${variant.to}", out: "${variant.out}"`
                    it(title,  function (done) {
                        const seneca = Seneca({log: 'test'})
                            .client()
                        expect(seneca.has({provider: provider})).to.be.true
                        _act.call(this, seneca, _.extend(variant, {provider: provider}), done, debug)
                    })
                })
            })
        })
    })
}
