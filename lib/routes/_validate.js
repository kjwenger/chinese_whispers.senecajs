const debug = require('debug')('chinese_whispers:routes')
const joi = require('joi')
const intl = require('intl')
const _compose = require('./_compose')

const locales = intl.getCanonicalLocales() || ['de', 'en', 'fr']
debug('locales:', locales)
const localeSchema = joi.string().allow(locales)
const schema = joi.object().keys({
    text: joi.string().required(),
    from: localeSchema.optional(),
    to: localeSchema.optional(),
    provider: joi.string().optional()
})

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

module.exports = {_validateQuery, _validatePayload}
