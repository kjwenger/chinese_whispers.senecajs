const debug = require('debug')('chinese_whispers:client')

const seneca = require('seneca')({tag: 'chinese_whispers', log: 'test', timeout: 10000});
const options = _options(config);
if (options.discover.registry.active) seneca.use('consul-registry', config.SENECA_CONSUL_REGISTRY)
seneca
    .use('mesh', options)
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
    .client()
