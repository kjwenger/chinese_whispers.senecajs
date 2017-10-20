#!/usr/bin/env node

const debug = require('debug')('chinese_whispers:post')
const request = require('request')

request.get('http://localhost:8910/api/whispers/translations?from=en&to=de&text=Hi, neighbor!',
    function (error, response, body) {
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
        url: 'http://localhost:8910/api/whispers?from=en&to=fr',
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