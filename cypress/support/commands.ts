/* eslint @typescript-eslint/no-namespace: "off" */

export {}

declare global {
  namespace Cypress {
    interface Chainable {
      loadAndWaitForWidget(module: string): Chainable
      widgetIframe(selector?: string): Chainable
    }
  }
}

Cypress.Commands.add("loadAndWaitForWidget", (module) => {
  cy.visit(`${Cypress.config("baseUrl")}/static/${module}.html`)
  cy.intercept("/raja/data*").as("rajaDataRequest")
  return cy.wait("@rajaDataRequest")
})

Cypress.Commands.add("widgetIframe", () => {
  return cy
    .get("[data-test-id=mx-widget-iframe]")
    .its("0.contentDocument")
    .its("body")
    .should("not.be.undefined")
    .then(cy.wrap)
})
