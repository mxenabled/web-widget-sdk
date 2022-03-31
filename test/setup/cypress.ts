/* eslint @typescript-eslint/no-namespace: "off" */

export {}

declare global {
  namespace Cypress {
    interface Chainable {
      loadAndWaitForExampleApplication(): Chainable
      iframe(selector?: string): Chainable
    }
  }
}

Cypress.Commands.add("loadAndWaitForExampleApplication", () => {
  cy.visit("example/index.html")
  cy.intercept("/raja/data*").as("rajaDataRequest")
  return cy.wait("@rajaDataRequest")
})

Cypress.Commands.add("iframe", (selector = "iframe") => {
  return cy
    .get(selector)
    .its("0.contentDocument")
    .its("body")
    .should("not.be.undefined")
    .then(cy.wrap)
})
