describe("Widget", () => {
  beforeEach(() => {
    cy.loadAndWaitForWidget()
  })

  it("loads the widget in an iframe", () => {
    cy.widgetIframe().should("exist")
  })

  describe("Post Message Callbacks", () => {
    it("mx/load", () => {
      cy.get("[data-log-id=onLoad]").should("exist")
    })

    it("mx/connect/loaded", () => {
      cy.get("[data-log-id=onLoaded]").should("exist")
    })
  })
})
