const modules = ["amd", "es", "cjs"]

modules.forEach((module) => {
  describe(`Widget SDK loaded via ${module} bundle`, () => {
    beforeEach(() => {
      cy.loadAndWaitForWidget(module)
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

      it("dispatches mx/connect/selectedInstitution", () => {
        cy.widgetIframe().find("[data-test=disclosure-continue]").click()
        cy.widgetIframe().find("[data-test=institution-tile]").its("0").click()
        cy.get("[data-log-id=onSelectedInstitution]").should("exist")
      })
    })
  })
})
