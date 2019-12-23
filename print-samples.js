const idgen = require('./src/idgen')

const ns = 'SRT'

const generateAnId = () => new Promise(resolve => resolve(idgen(ns)))

Promise.all(new Array(10).fill(0).map(generateAnId)).then(
  console.log.bind(console)
)
