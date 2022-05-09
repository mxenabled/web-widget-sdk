const tests = {
  "amd (local)": "Widget SDK loaded via local AMD module",
  "cjs (local)": "Widget SDK loaded via local CommonJs module",
  "es (local)": "Widget SDK loaded via local ES module",
  // "umd (cdn)": "Widget SDK loaded via UMD module from CDN",
  "umd (local)": "Widget SDK loaded via local UMD module",
}

Object.keys(tests).forEach((testFile) => {
  describe(tests[testFile], () => {
    beforeEach(() => {
      cy.loadAndWaitForWidget(testFile)
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
