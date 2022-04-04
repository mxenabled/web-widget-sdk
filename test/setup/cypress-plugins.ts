module.exports = (on, config) => {
  config.baseUrl = `http://localhost:${process.env["PORT"] || 8089}`

  return config
}
