/* global process */
const debug = require('debug')('chinese_whispers:config')
const _ = require('underscore')
const nconf = require('nconf')
const joi = require('joi')
const pkg = require('./package.json')

nconf.argv().env().file('config.json').defaults({
    HOST: 'localhost',
    PORT: 8910,

    SENECA_MESH_ISBASE: false,
    SENECA_MESH_PINS: []
})

function _boolean(value, key) {
    if (key) debug('_boolean() key:', key)
    debug('_boolean() value:', value)
    let result
    switch (value) {
        case 'true':
            result = true
            break
        case 'false':
            result = false
            break
        case 0:
            result = false
            break
        case '0':
            result = false
            break
        default:
            result = !!value
            break
    }
    debug('_boolean() result:', result)
    return result
}

function _parse(value, key) {
    if (key) debug('_parse() key:', key)
    debug('_parse() value:', value)
    return value
        ? _.isString(value)
            ? JSON.parse(value)
            : value
        : value
}

const config = {
    NAME: pkg.name,
    VERSION: pkg.version,

    HOST: nconf.get('HOST'),
    PORT: nconf.get('PORT'),

    SENECA_MESH_ISBASE: _boolean(nconf.get('SENECA_MESH_ISBASE'), 'SENECA_MESH_ISBASE'),
    SENECA_MESH_HOST: nconf.get('SENECA_MESH_HOST'),
    SENECA_MESH_PORT: nconf.get('SENECA_MESH_PORT'),
    SENECA_MESH_PIN: nconf.get('SENECA_MESH_PIN'),
    SENECA_MESH_PINS: _parse(nconf.get('SENECA_MESH_PINS'), 'SENECA_MESH_PINS'),
    SENECA_MESH_BASES: _parse(nconf.get('SENECA_MESH_BASES'), 'SENECA_MESH_BASES'),
    SENECA_MESH_BROADCAST: nconf.get('SENECA_MESH_BROADCAST'),
    SENECA_MESH_OPTIONS: _parse(nconf.get('SENECA_MESH_OPTIONS'), 'SENECA_MESH_OPTIONS'),

    SENECA_CONSUL_REGISTRY: _parse(nconf.get('SENECA_CONSUL_REGISTRY'), 'SENECA_CONSUL_REGISTRY'),

    YANDEX_TRANSLATE_API_KEY: nconf.get('YANDEX_TRANSLATE_API_KEY')
}

const hostSchema = joi.string() //.hostname()
const portSchema = joi.number().integer()
const baseSchema = joi.string().regex(/^.*:.*$/)
const basesSchema = joi.array().items(joi.string())
const pinSchema = joi.object().keys({
    role: joi.string().required(),
    cmd: joi.string().optional(),
    from: joi.string().optional(),
    to: joi.string().optional(),
    provider: joi.string().optional()
})
const pinsSchema = joi.array().items(pinSchema)
const registrySchema = joi.object().keys({
    host: hostSchema.optional(),
    port: portSchema.optional()
})
const schema = joi.object().keys({
    NAME: joi.string().required(),
    VERSION: joi.string().required(),

    HOST: hostSchema.optional(),
    PORT: portSchema.required(),

    SENECA_MESH_ISBASE: joi.boolean().optional(),
    SENECA_MESH_HOST: hostSchema.optional(),
    SENECA_MESH_PORT: portSchema.optional(),
    SENECA_MESH_PIN: joi.string().optional(),
    SENECA_MESH_PINS: pinsSchema.optional(),
    SENECA_MESH_BASES: basesSchema.optional(),
    SENECA_MESH_BROADCAST: hostSchema.optional(),
    SENECA_MESH_OPTIONS: joi.object().optional(),

    SENECA_CONSUL_REGISTRY: registrySchema.optional(),

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
