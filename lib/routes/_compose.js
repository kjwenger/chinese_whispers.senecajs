const debug = require('debug')('chinese_whispers:routes')

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

module.exports = _compose