import { BudgetsWidget, ConnectWidget, PulseWidget } from "../../src"

const widgetClassses = [BudgetsWidget, ConnectWidget, PulseWidget]
const url = "https://widgets.moneydesktop.com/md/..."

let widgetContainer = document.createElement("div")
beforeEach(() => {
  widgetContainer = document.createElement("div")
  document.body.appendChild(widgetContainer)
})

afterEach(() => {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild)
  }
})

widgetClassses.forEach((widgetClass) => {
  describe(widgetClass.name, () => {
    describe("initialization", () => {
      test("an error is thrown when the container element is not found", () => {
        expect(() => {
          new widgetClass({ url, widgetContainer: "#notfound" })
        }).toThrow("Unable to find widget container: #notfound")
      })

      test("it appends the iframe to the widget container element", () => {
        new widgetClass({ url, widgetContainer })

        expect(widgetContainer?.children.length).toBe(1)
        expect(widgetContainer?.children[0].tagName).toBe("IFRAME")
      })

      test("post message event listener is added", () => {
        const spy = jest.spyOn(window, "addEventListener").mockImplementation(() => ({
          addEventListener: jest.fn(),
        }))

        new widgetClass({ url, widgetContainer })

        expect(window.addEventListener).toHaveBeenCalledWith("message", expect.anything(), false)
        spy.mockRestore()
      })
    })

    describe("unmount", () => {
      test("it removes the iframe from the container element", () => {
        const widget = new widgetClass({ url, widgetContainer })
        widget.unmount()

        expect(widgetContainer?.children.length).toBe(0)
      })

      test("post message event listener is removed", () => {
        const spy = jest.spyOn(window, "removeEventListener").mockImplementation(() => ({
          removeEventListener: jest.fn(),
        }))

        const widget = new widgetClass({ url, widgetContainer })
        widget.unmount()

        expect(window.removeEventListener).toHaveBeenCalledWith("message", expect.anything(), false)
        spy.mockRestore()
      })
    })

    describe("post message dispatching", () => {
      test("message is dispatched to the appropriate callback", () => {
        const onLoad = jest.fn()
        new widgetClass({ url, widgetContainer, onLoad })

        window.dispatchEvent(
          new MessageEvent("message", {
            data: {
              mx: true,
              type: "mx/load",
              metadata: {},
            },
          }),
        )

        expect(onLoad).toHaveBeenCalledWith({ type: "mx/load" })
      })

      test("message payload is included", () => {
        const onPing = jest.fn()
        new widgetClass({ url, widgetContainer, onPing })

        window.dispatchEvent(
          new MessageEvent("message", {
            data: {
              mx: true,
              type: "mx/ping",
              metadata: {
                user_guid: "USR-123",
                session_guid: "SES-123",
              },
            },
          }),
        )

        expect(onPing).toHaveBeenCalledWith({
          session_guid: "SES-123",
          type: "mx/ping",
          user_guid: "USR-123",
        })
      })
    })
  })
})

describe("ConnectWidget", () => {
  describe("post message dispatching", () => {
    test("message payload is included", () => {
      const onLoaded = jest.fn()
      new ConnectWidget({ url, widgetContainer, onLoaded })

      window.dispatchEvent(
        new MessageEvent("message", {
          data: {
            mx: true,
            type: "mx/connect/loaded",
            metadata: {
              user_guid: "USR-123",
              session_guid: "SES-123",
              initial_step: "mfa",
            },
          },
        }),
      )

      expect(onLoaded).toHaveBeenCalledWith({
        initial_step: "mfa",
        session_guid: "SES-123",
        type: "mx/connect/loaded",
        user_guid: "USR-123",
      })
    })
  })
})
