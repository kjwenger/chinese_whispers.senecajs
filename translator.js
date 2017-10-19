const config = require('./config')

require('seneca')()
    // .ready(console.log)
    .use('./lib/plugins/google')
    .use('./lib/plugins/yandex', {key: config.YANDEX_TRANSLATE_API_KEY})
    .use('./lib/plugins/translator')
    .add('format:hex', function (msg, respond) {
        const color = 'red' === msg.color ? '#FF0000' : '#FFFFFF'
        respond({color: color})
    })
    .use('mesh', {
        monitor: true,
        isbase: true,
        listen: [
            // {pin: 'role:translator'},
            {pin: 'format:hex'}
        ]
    })
    // .use('mesh', {
    //     monitor: true,
    //     isbase: true,
    //     pin: 'role:translator'
    // })