const modules = ["amd", "es", "cjs"]

for (let i = 0; i < modules.length; i++) {
  describe(`Widget ${modules[i]}`, () => {
    beforeEach(() => {
      cy.loadAndWaitForWidget(modules[i])
    })

    it("loads the widget in an iframe", () => {
      cy.widgetIframe().should("exist")
    })

    describe("Post Message Callbacks", () => {
      it("dispatches mx/load", () => {
        cy.get("[data-log-id=onLoad]").should("exist")
      })

      it("dispatches mx/connect/loaded", () => {
        cy.get("[data-log-id=onLoaded]").should("exist")
      })
    })
  })
}
