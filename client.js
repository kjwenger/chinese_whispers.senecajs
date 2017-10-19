require('seneca')({tag: 'chinese_whispers', log: 'test'})
    .use('mesh')
    .ready(function (err) {
        if (err) return console.error(err)
        this.act({
            role: 'translator',
            cmd: 'translate',
            text: 'Hi, neighbor!',
            from: 'en',
            to: 'de'
        }, function (err, res) {
            if (err) return console.error(err)
            console.log(JSON.stringify(res, null, 2))
            this.close(function (err) {

            })
        })
    })
    .client()
