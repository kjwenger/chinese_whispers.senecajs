const nconf = require('nconf')
const joi = require('joi')
const pkg = require('./package.json')

nconf.argv().env().file('config.json')

const config = {
    NAME: pkg.name,
    VERSION: pkg.version,

    YANDEX_TRANSLATE_API_KEY: nconf.get('YANDEX_TRANSLATE_API_KEY')
}

const schema = joi.object().keys({
    NAME: joi.string().required(),
    VERSION: joi.string().required(),

    YANDEX_TRANSLATE_API_KEY: joi.string().required()
})

function validate(obj) {
    const validation = joi.validate(obj, schema, {abortEarly: false})
    if (validation.error !== null) {
        console.log('invalid or missing config settings:')
        const details = validation.error.details || []
        details.forEach(detail => console.log('-', detail.message, '--> please set', detail.path))
        process.exit(1)
    }
}

validate(config)

module.exports = config
