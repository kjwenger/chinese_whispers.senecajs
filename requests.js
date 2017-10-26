#!/usr/bin/env node

const debug = require('debug')('chinese_whispers:post')
const request = require('request')
const config = require('./config')

function requests() {
    request.get(`http://${config.HOST}:${config.PORT}/api/whispers/translations`
            + `?from=en`
            + `&to=de`
            + `&text=Hi, neighbor!`
            + `&provider=yandex`
        , function (error, response, body) {
            debug('request.get() error:', error)
            debug('request.get() response:', response)
            debug('request.get() body:', body)
            if (error) console.error('error:', error)
            console.log('status code:', response && response.statusCode)
            console.log('body:', body)
        }
    )
    request.post(
        {
            url: `http://${config.HOST}:${config.PORT}/api/whispers?from=en&to=fr`,
            form: {text: 'Hi, neighbor!'}
        },
        function (error, response, body) {
            debug('request.post() error:', error)
            debug('request.post() response:', response)
            debug('request.post() body:', body)
            if (error) console.error('error:', error)
            console.log('status code:', response && response.statusCode)
            console.log('body:', body)
        }
    )

    setTimeout(requests, 2000)
}

requests()