let tests: Record<string, string> = {
  "amd (local)": "Widget SDK loaded via local AMD module",
  "cjs (local)": "Widget SDK loaded via local CommonJs module",
  "esm (local)": "Widget SDK loaded via local ES module",
  "umd (local)": "Widget SDK loaded via local UMD module",
}

if (Cypress.env("ENVIRONMENT") !== "staging") {
  tests = {
    ...tests,
    "umd (remote)": "Widget SDK loaded via remote UMD module",
  }
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
        cy.widgetIframe().find("button[data-test]").its("0").click()
        cy.get("[data-log-id=onSelectedInstitution]").should("exist")
      })
    })
  })
})
