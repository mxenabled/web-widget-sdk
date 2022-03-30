describe("Example Application", () => {
  beforeEach(() => {
    cy.loadAndWaitForExampleApplication()
  })

  it("renders a container for the widget", () => {
    cy.get("#widget").should("exist")
  })

  it("renders a container for the logs", () => {
    cy.get("#logs").should("exist")
  })

  it("loads the widget in an iframe", () => {
    cy.iframe().should("exist")
  })
})
