const infos = require('./infos')

const members = require('./members')

const instrumentations = require('./instrumentations')

const translations = require('./translations')
const whispers = require('./whispers')

module.exports = [].concat(infos, members, instrumentations, translations, whispers)
