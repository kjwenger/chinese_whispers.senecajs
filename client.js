const debug = require('debug')('chinese_whispers:client')
const config = require('./config')
const _options = require('./_options')
const options = _options(config);
const seneca = require('seneca')({tag: 'client', log: 'silent', timeout: 10000});
// seneca.test('print')
if (options.discover.registry.active) seneca.use('consul-registry', config.SENECA_CONSUL_REGISTRY)
seneca
    .use('mesh', options)
    .client()
    .ready(function (err0) {
        debug('seneca.ready() err0:', err0)
        if (err0) {
            console.error(err0)
            this.close(function (err2) {
                if (err2) return console.error(err2)
            })
        }
        const pattern = {
            role: 'conductor',
            cmd: 'convey',
            text: 'Hi, neighbor!',
            from: 'en',
            to: 'fr'
        };
        debug('seneca.ready() pattern:', pattern)
        this.act(pattern, function (err1, res) {
            if (err1) console.error(err1)
            else console.log(JSON.stringify(res, null, 2))
            this.close(function (err2) {
                if (err2) return console.error(err2)
            })
        })
    })
