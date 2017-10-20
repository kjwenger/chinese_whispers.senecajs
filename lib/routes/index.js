const instrumentations = require('./instrumentations')

const translations = require('./translations')
const whispers = require('./whispers')

module.exports = [].concat(instrumentations, translations, whispers)
