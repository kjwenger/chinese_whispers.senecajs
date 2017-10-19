require('seneca')({tag: 'chinese_whispers', log: 'silent'})
    .use('mesh', {
        monitor: true
    })