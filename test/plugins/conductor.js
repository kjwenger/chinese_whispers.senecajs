const debug = require('debug')('chinese_whispers:conductor-test')
const _ = require('underscore')
const Seneca = require('seneca')
const config = require('../../config')
const variants = require('./variants.json')
const _act = require('./_act')

describe.only('conductor', function () {
    describe('with role: conductor, cmd convey', function () {
        this.timeout(10000)

        let seneca

        beforeEach(function (done) {
            seneca = Seneca()
                .ready((err) => {
                    debug('beforeEach() seneca.ready() err: ', err)
                    done(err)
                })
                .use('../../lib/plugins/google')
                .use('../../lib/plugins/yandex', {key: config.YANDEX_TRANSLATE_API_KEY})
                .use('../../lib/plugins/translator')
                .use('../../lib/plugins/conductor')
                // .use('mesh', {
                //     isbase: true,
                //     listen: [
                //         {pin: 'role:translator,cmd:translate'},
                //         {pin: 'role:conductor,cmd:convey'}
                //     ]
                // })
                .listen()
        })

        afterEach(function (done) {
            seneca.close(done)
        })

        _.each(variants, variant => {
            const title = `should do`
                + `  from: "${variant.from}", in: "${variant.in}"`
                + `  to: "${variant.to}", out: "${variant.out}"`
            it(title, function (done) {
                const seneca = Seneca({log: 'test'})
                    .use('mesh')
                _act.call(this, seneca, _.extend(variant, {role: 'conductor', cmd: 'convey'}), done, debug)
            })
        })
    })
})