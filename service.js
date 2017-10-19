const config = require('./config')

require('seneca')({tag: 'chinese_whispers', log: 'silent', timeout: 10000})
    .test(console.log)
    .ready(console.log)
    .use('./lib/plugins/liar', {provider: 'yandex', lie: `It's YUGE!`})
    .use('./lib/plugins/google')
    .use('./lib/plugins/yandex', {key: config.YANDEX_TRANSLATE_API_KEY})
    .use('./lib/plugins/translator')
    .use('./lib/plugins/conductor')
    .use('mesh', {
        isbase: true,
        pins: [
            {role: 'translator', from: 'en', to: 'de'},
            {role: 'translator', from: 'de', to: 'fr', provider: 'liar'},
            {role: 'conductor'}
        ]
    })
