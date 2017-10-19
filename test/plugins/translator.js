const debug = require('debug')('chinese_whispers:translator-test')
const _ = require('underscore')
const Seneca = require('seneca')
const expect = require('chai').expect
const config = require('../../config')
const variants = require('./variants.json')
const _act = require('./_act')

describe('translator', function () {
    describe('with role: translator, cmd: translate', function () {
        let seneca

        beforeEach(function () {
            seneca = Seneca()
                .use('../../lib/plugins/google')
                .use('../../lib/plugins/yandex', {key: config.YANDEX_TRANSLATE_API_KEY})
                .use('../../lib/plugins/translator')
                .listen()
        })

        afterEach(function (done) {
            seneca.close(done)
        })

        _.each(variants, variant => {
            const title = `should do`
                + ` from: "${variant.from}", in: "${variant.in}"`
                + ` to: "${variant.to}", out: "${variant.out}"`
            it(title, function (done) {
                const seneca = Seneca({log: 'test'})
                    .client()
                debug(`${this.test.title} seneca.has('provider:google'): `, seneca.has('provider:google'))
                debug(`${this.test.title} seneca.has('provider:yandex'): `, seneca.has('provider:yandex'))
                debug(`${this.test.title} seneca.has('role:translator'): `, seneca.has('role:translator'))
                _act.call(this, seneca, variant, done, debug)
            })
        })

        const provider = 'yandex'
        _.each(variants, variant => {
            const title = `should do`
                + ` from: "${variant.from}", in: "${variant.in}"`
                + ` to: "${variant.to}", out: "${variant.out}"`
                + ` using provider: "${provider}"`
            it(title, function (done) {
                const seneca = Seneca({log: 'test'})
                    .client()
                debug(`${this.test.title} seneca.has('provider:google'): `, seneca.has('provider:google'))
                debug(`${this.test.title} seneca.has('provider:yandex'): `, seneca.has('provider:yandex'))
                debug(`${this.test.title} seneca.has('role:translator'): `, seneca.has('role:translator'))
                _act.call(this, seneca, _.extend(variant, {provider: provider}), done, debug)
            })
        })
    })
})