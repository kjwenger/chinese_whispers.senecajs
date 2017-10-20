const hoek = require('hoek')
const httpMethods = require('../utilities/http/methods')
const {_validateQuery, _validatePayload} = require('./_validate')
const _hapiSwagger = require('./_hapiSwagger')
const _handler = require('./_handler')

const _description = 'Return all the chained translation from one locale to another locale of a posted chinese whisper';
const _conveyHandler = function (request, reply) {
    return _handler(request, reply, 'conductor', 'convey')
}

const _route = {
    method: httpMethods.GET,
    path: '/api/whispers',
    config: {
        description: _description,
        tags: ['api', 'chinese whispers'],
        validate: {
            query: _validateQuery
        },
        plugins: {
            'hapi-swagger': _hapiSwagger
        }
    },
    handler: _conveyHandler
}

module.exports = [
    hoek.applyToDefaults(_route, {
        method: httpMethods.GET,
    }),
    hoek.applyToDefaults(_route, {
        method: httpMethods.POST,
        config: {
            validate: {
                query: _validateQuery,
                payload: _validatePayload
            }
        }
    })
]