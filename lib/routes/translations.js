const hoek = require('hoek')
const httpMethods = require('../utilities/http/methods')
const {_validateQuery, _validatePayload} = require('./_validate')
const _hapiSwagger = require('./_hapiSwagger')
const _handler = require('./_handler')

const _translateHandler = function (request, reply) {
    return _handler(request, reply, 'translator', 'translate')
}

const route = {
    path: '/api/whispers/translations',
    config: {
        description: 'Return the translation from one locale to another locale of a posted chinese whisper',
        tags: ['api', 'chinese whispers', 'translations'],
        validate: {
            query: _validateQuery
        },
        plugins: {
            'hapi-swagger': _hapiSwagger
        }
    },
    handler: _translateHandler
};
module.exports = [
    hoek.applyToDefaults(route, {
        method: httpMethods.GET,
    }),
    hoek.applyToDefaults(route, {
        method: httpMethods.POST,
        config: {
            validate: {
                query: _validateQuery,
                payload: _validatePayload
            }
        }
    })
]