/* eslint @typescript-eslint/no-namespace: "off" */

export {}

declare global {
  namespace Cypress {
    interface Chainable {
      loadAndWaitForWidget(): Chainable
      widgetIframe(selector?: string): Chainable
    }
  }
}

Cypress.Commands.add("loadAndWaitForWidget", () => {
  return cy.visit(Cypress.config("baseUrl"))
  // cy.intercept("/raja/data*").as("rajaDataRequest")
  // return cy.wait("@rajaDataRequest")
})

Cypress.Commands.add("widgetIframe", () => {
  return cy
    .get("[data-test-id=mx-widget-iframe]")
    .its("0.contentDocument")
    .its("body")
    .should("not.be.undefined")
    .then(cy.wrap)
})
