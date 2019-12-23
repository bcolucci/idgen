module.exports = () => {
  let internalCounter = Math.trunc(Math.random() * 999)
  return ns => {
    internalCounter++
    if (internalCounter === 1000) {
      internalCounter = 0
    }
    const idParts = []
    idParts.push(new Date().getTime().toString(36))
    idParts.push(process.pid.toString(36))
    idParts.push(internalCounter.toString(36))
    idParts.push(
      Math.random()
        .toString(36)
        .substring(2, 8)
    )
    return [ns, idParts.join('')].join('-')
  }
}
