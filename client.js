require('seneca')({tag: 'chinese_whispers', log: 'test', timeout: 10000})
    .use('mesh')
    .ready(function (err) {
        if (err) return console.error(err)
        this.act({
            role: 'conductor',
            cmd: 'convey',
            text: 'Hi, neighbor!',
            from: 'en',
            to: 'fr'
        }, function (err1, res) {
            if (err1) console.error(err1)
            else console.log(JSON.stringify(res, null, 2))
            this.close(function (err2) {
                if (err2) return console.error(err2)
            })
        })
    })
    .client()
