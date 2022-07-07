module.exports = (on: Cypress.Actions, config: Cypress.Config) => {
  config.baseUrl = `http://localhost:${process.env["PORT"] || 8089}`

  return config
}
