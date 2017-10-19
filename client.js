require('seneca')({log: 'test'})
    .use('mesh')
    .act({format: 'hex', color: 'blue'}, (err, res) => {
        console.log('color:', res.color)
    })
//    .act({
//        role: 'translator',
//        cmd: 'translate',
//        text: 'Hi, neighbor!',
//        from: 'en',
//        to: 'fr'}, console.log)