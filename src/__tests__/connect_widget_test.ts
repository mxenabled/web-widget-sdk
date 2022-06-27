import { ConnectWidget } from "../../src"
import { waitFor } from "../../jest/utils"

const url = "https://widgets.moneydesktop.com/md/..."

let container = document.createElement("div")
let widget: ConnectWidget

beforeAll(() => {
  container = document.createElement("div")
  document.body.appendChild(container)
})

afterAll(() => {
  document.body.removeChild(container)
})

describe("ConnectWidget", () => {
  beforeEach(() => {
    widget = new ConnectWidget({ url, container })
  })

  afterEach(() => {
    widget.unmount()
  })

  describe("handleOAuthRedirect", () => {
    test("will work with clientRedirect URL", async () => {
      await waitFor(() => !!container?.getElementsByTagName("iframe")[0]?.src)

      const iframeElement = container?.getElementsByTagName("iframe")[0]?.contentWindow

      if (!iframeElement) {
        throw new Error("Unable to find widget iframe")
      }

      const postMessageSpy = jest.spyOn(iframeElement, "postMessage")

      window.dispatchEvent(
        new MessageEvent("message", {
          data: {
            mx: true,
            type: "mx/client/oauthComplete",
            metadata: {
              url: "https://testApp.com/some/path?status=error&member_guid=MBR-123&error_reason=CANCELLED",
            },
          },
        }),
      )

      expect(postMessageSpy).toHaveBeenCalledWith(
        {
          mx: true,
          type: "oauthComplete/error",
          metadata: {
            member_guid: "MBR-123",
            error_reason: "CANCELLED",
          },
        },
        widget.targetOrigin,
      )

      postMessageSpy.mockRestore()
    })

    test("will parse a URL and postmessage error to the widget", async () => {
      await waitFor(() => !!container?.getElementsByTagName("iframe")[0]?.src)

      const iframeElement = container?.getElementsByTagName("iframe")[0]?.contentWindow

      if (!iframeElement) {
        throw new Error("Unable to find widget iframe")
      }

      const postMessageSpy = jest.spyOn(iframeElement, "postMessage")

      window.dispatchEvent(
        new MessageEvent("message", {
          data: {
            mx: true,
            type: "mx/client/oauthComplete",
            metadata: {
              url: "com.testApp://oauth_complete?status=error&member_guid=MBR-123&error_reason=CANCELLED",
            },
          },
        }),
      )

      expect(postMessageSpy).toHaveBeenCalledWith(
        {
          mx: true,
          type: "oauthComplete/error",
          metadata: {
            member_guid: "MBR-123",
            error_reason: "CANCELLED",
          },
        },
        widget.targetOrigin,
      )

      postMessageSpy.mockRestore()
    })

    test("will parse a URL and postmessage success to the widget", async () => {
      await waitFor(() => !!container?.getElementsByTagName("iframe")[0]?.src)

      const iframeElement = container?.getElementsByTagName("iframe")[0]?.contentWindow

      if (!iframeElement) {
        throw new Error("Unable to find widget iframe")
      }

      const postMessageSpy = jest.spyOn(iframeElement, "postMessage")

      window.dispatchEvent(
        new MessageEvent("message", {
          data: {
            mx: true,
            type: "mx/client/oauthComplete",
            metadata: {
              url: "com.testApp://oauth_complete?status=success&member_guid=MBR-123",
            },
          },
        }),
      )

      expect(postMessageSpy).toHaveBeenCalledWith(
        {
          mx: true,
          type: "oauthComplete/success",
          metadata: {
            member_guid: "MBR-123",
            error_reason: null,
          },
        },
        widget.targetOrigin,
      )
      postMessageSpy.mockRestore()
    })
  })

  describe("post message dispatching", () => {
    test("message payload is included", () => {
      const onLoaded = jest.fn()
      new ConnectWidget({ url, container, onLoaded })

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
