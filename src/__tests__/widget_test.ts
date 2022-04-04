import { ConnectWidget } from "../../src"

describe("ConnectWidget", () => {
  let widgetContainer: HTMLDivElement | undefined

  beforeEach(() => {
    widgetContainer = document.createElement("div")
    widgetContainer.id = "widget"
    document.body.appendChild(widgetContainer)
  })

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild)
    }
  })

  describe("initialization", () => {
    test("an error is thrown when the container element is not found", () => {
      expect(() => {
        new ConnectWidget({
          widgetContainer: "#notfound",
          url: "https://test.com",
        })
      }).toThrow("Unable to find widget container: #notfound")
    })

    test("it appends the iframe to the widget container element", () => {
      new ConnectWidget({
        widgetContainer: "#widget",
        url: "https://test.com",
      })

      expect(widgetContainer?.children.length).toBe(1)
      expect(widgetContainer?.children[0].tagName).toBe("IFRAME")
    })
  })

  describe("unmount", () => {
    test("it removes the iframe from the container element", () => {
      const widget = new ConnectWidget({
        widgetContainer: "#widget",
        url: "https://test.com",
      })

      widget.unmount()

      expect(widgetContainer?.children?.length).toBe(0)
    })
  })
})
