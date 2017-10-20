const httpCodes = require('../utilities/http/codes')

module.exports = {
    responses: {
        [httpCodes.OK]: {
            from: 'en',
            to: 'de',
            in: 'Hi, neighbor!',
            out: 'Hallo, Nachbar!',
            provider: 'yandex'
        }
    }
}