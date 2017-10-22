/* global process */
const _ = require('underscore')
const nconf = require('nconf')
const joi = require('joi')
const pkg = require('./package.json')

nconf.argv().env().file('config.json').defaults({
    PORT: 8910,

    SENECA_MESH_ISBASE: true,
    SENECA_MESH_PINS: [
        {role: 'translator', from: 'en', to: 'de'},
        {role: 'translator', from: 'de', to: 'fr', provider: 'liar'},
        {role: 'conductor'}
    ]
})

function _boolean(value) {
    switch (value) {
        case 'true': return true
        case 'false': return false
        case 0: return false
        default: return !!value
    }
}

function _parsed(source) {
    return source
        ? _.isString(source)
            ? JSON.parse(source)
            : source
        : source
}

const config = {
    NAME: pkg.name,
    VERSION: pkg.version,

    HOST: nconf.get('HOST'),
    PORT: nconf.get('PORT'),

    SENECA_MESH_ISBASE: _boolean(nconf.get('SENECA_MESH_ISBASE')),
    SENECA_MESH_PINS: _parsed(nconf.get('SENECA_MESH_PINS')),
    SENECA_MESH_BASES: _parsed(nconf.get('SENECA_MESH_BASES')),
    SENECA_MESH_BROADCAST: nconf.get('SENECA_MESH_BROADCAST'),
    SENECA_MESH_REGISTRY: _parsed(nconf.get('SENECA_MESH_REGISTRY')),

    YANDEX_TRANSLATE_API_KEY: nconf.get('YANDEX_TRANSLATE_API_KEY')
}

const hostSchema = joi.string()
const portSchema = joi.number().integer()
const baseSchema = joi.string().regex(/^.*:.*$/)
const basesSchema = joi.array().items(baseSchema)
const pinSchema = joi.object().keys({
    role: joi.string().required(),
    cmd: joi.string().optional(),
    from: joi.string().optional(),
    to: joi.string().optional(),
    provider: joi.string().optional()
})
const pinsSchema = joi.array().items(pinSchema)
const registrySchema = joi.object().keys({
    host: hostSchema,
    port: portSchema.required()
})
const schema = joi.object().keys({
    NAME: joi.string().required(),
    VERSION: joi.string().required(),

    HOST: hostSchema.optional(),
    PORT: portSchema.required(),

    SENECA_MESH_ISBASE: joi.boolean().optional(),
    SENECA_MESH_PINS: pinsSchema.optional(),
    SENECA_MESH_BASES: basesSchema.optional(),
    SENECA_MESH_BROADCAST: hostSchema.optional(),
    SENECA_MESH_REGISTRY: registrySchema.optional(),

    YANDEX_TRANSLATE_API_KEY: joi.string().optional()
})

function _validate(obj) {
    const validation = joi.validate(obj, schema, {abortEarly: false})
    if (validation.error !== null) {
        console.log('invalid or missing config settings:')
        const details = validation.error.details || []
        _.each(details, detail => console.log('-', obj[detail.path], ':', detail.message, '--> please set', detail.path))
        process.exit(1)
    }
}

_validate(config)

module.exports = config
