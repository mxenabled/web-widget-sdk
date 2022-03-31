describe("Widget", () => {
  beforeEach(() => {
    cy.loadAndWaitForWidget()
  })

  it("loads the widget in an iframe", () => {
    cy.widgetIframe().should("exist")
  })
})
