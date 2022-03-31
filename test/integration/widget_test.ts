describe("Widget", () => {
  beforeEach(() => {
    cy.loadAndWaitWidget()
  })

  it("loads the widget in an iframe", () => {
    cy.widgetIframe().should("exist")
  })
})
