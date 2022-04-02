module.exports = (on, config) => {
  config.baseUrl = `http://localhost:${process.env["PORT"] || 8090}`

  return config
}
