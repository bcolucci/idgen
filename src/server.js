const express = require('express')
const idgen = require('./idgen')()

const app = express()
app.get('/:ns', ({ params }, res) => res.end(idgen(params.ns)))

module.exports = app
