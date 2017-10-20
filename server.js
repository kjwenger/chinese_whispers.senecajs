/* global process */
const debug = require('debug')('chinese_whispers:server')
const _ = require('underscore')
_.mixin(require('underscore.deepclone'))
_.deepExtend = function(base, extension, clone = true) {
    // debug('_.deepExtend() base:', base)
    // debug('_.deepExtend() extension:', extension)
    const target = clone ? _.deepClone(base) : base
    // debug('_.deepExtend() target:', target)
    for (const prop in extension)
        if (prop in target)
            _.deepExtend(target[prop], extension[prop], false)
        else
            target[prop] = extension[prop]
    return target
}
const chairo = require('chairo')
const hapi = require('hapi')
const joi = require('joi')
const intl = require('intl')
const httpCodes = require('./lib/utilities/http/codes')
const httpMethods = require('./lib/utilities/http/methods')
const config = require('./config')

const locales = intl.getCanonicalLocales() || ['de', 'en', 'fr']
debug('locales:', locales)
const localeSchema = joi.string().allow(locales)
const schema = joi.object().keys({
    text: joi.string().required(),
    from: localeSchema.optional(),
    to: localeSchema.optional(),
    provider: joi.string().optional()
})

function _compose(context, query, payload) {
    debug('_compose() context:', context)
    query = query || (context && context.query) || {}
    debug('_compose() query:', query)
    payload = payload || (context && context.payload) || {}
    debug('_compose() payload:', payload)
    const from = query.from || payload.from
    const to = query.to || payload.to
    const text = query.text || payload.text
    const provider = query.provider || payload.provider
    const object = {
        from: from,
        to: to,
        text: text,
        provider: provider
    }
    debug('_compose() object:', object)
    return object
}

function _validate(val, options, query, payload, next) {
    debug('_validate() val:', val)
    debug('_validate() options:', options)
    const context = (options && options.context) || {}
    const object = _compose(context, query, payload)
    joi.validate(object, schema, {abortEarly: false}, function (err) {
        debug('_validate() joi.validate() err:', err)
        return next(err, val)
    })
}
function _validateQuery(query, options, next) {
    return _validate(query, options, query, null, next)
}
function _validatePayload(payload, options, next) {
    return _validate(payload, options, null, payload, next)
}

const server = new hapi.Server()

server.connection({
    port: config.PORT
})

server.register({register: chairo}, function (err) {
    if (err) {
        console.error(err)
        return process.exit(1)
    }

    server.seneca
        .ready(err => debug('seneca.ready() err:', err))
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
})

const _handler = function (request, reply, role, cmd) {
    debug(`server.route('${request.path}').handler() request:`, request)
    const pattern = _compose(request)
    pattern.role = role
    pattern.cmd = cmd
    debug(`server.route('${request.path}').handler() pattern:`, pattern)
    request.seneca.act(pattern, function (err, result) {
        debug(`server.route('${request.path}').handler() request.seneca.act() err:`, err)
        debug(`server.route('${request.path}').handler() request.seneca.act() result:`, result)
        if (err) return reply(err)

        return reply(result)
    })
}
const _translateHandler = function (request, reply) {
    return _handler(request, reply, 'translator', 'translate')
}
const _conveyHandler = function (request, reply) {
    return _handler(request, reply, 'conductor', 'convey')
}
const _hapiSwagger = {
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

server.route([
    {
        method: httpMethods.GET,
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
    },
    {
        method: httpMethods.POST,
        path: '/api/whispers/translations',
        config: {
            description: 'Return the translation from one locale to another locale of a posted chinese whisper',
            tags: ['api', 'chinese whispers', 'translations'],
            validate: {
                query: _validateQuery,
                payload: _validatePayload
            },
            plugins: {
                'hapi-swagger': _hapiSwagger
            }
        },
        handler: _translateHandler
    },
    {
        method: httpMethods.GET,
        path: '/api/whispers',
        config: {
            description: 'Return all the chained translation from one locale to another locale of a posted chinese whisper',
            tags: ['api', 'chinese whispers'],
            validate: {
                query: _validateQuery
            },
            plugins: {
                'hapi-swagger': _hapiSwagger
            }
        },
        handler: _conveyHandler
    },
    {
        method: httpMethods.POST,
        path: '/api/whispers',
        config: {
            description: 'Return all the chained translation from one locale to another locale of a posted chinese whisper',
            tags: ['api', 'chinese whispers'],
            validate: {
                query: _validateQuery,
                payload: _validatePayload
            },
            plugins: {
                'hapi-swagger': _hapiSwagger
            }
        },
        handler: _conveyHandler
    }
])

server.start(err => {
    debug('server.start() err:', err)
    if (err) throw err

    debug('server.start() server.info.uri:', server.info.uri)
})