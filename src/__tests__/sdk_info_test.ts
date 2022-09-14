import { ConnectWidget } from "../../src"
import { sdkVersion } from "../../src/version"
import { waitFor } from "../../jest/utils"

const url = "https://widgets.moneydesktop.com/md/..."

let container = document.createElement("div")
let widget: ConnectWidget
let loaded: boolean

beforeAll(() => {
  container = document.createElement("div")
  document.body.appendChild(container)
})

afterAll(() => {
  document.body.removeChild(container)
})

describe("Widget SDK info", () => {
  beforeEach(() => {
    loaded = false
    widget = new ConnectWidget({
      url,
      container,
      onLoad: () => {
        loaded = true
      },
    })
  })

  afterEach(() => {
    widget.unmount()
  })

  test("should send SDK info to the widget after the widget loads", async () => {
    await waitFor(() => !!container?.getElementsByTagName("iframe")[0]?.src)

    const iframeElement = container?.getElementsByTagName("iframe")[0]?.contentWindow

    if (!iframeElement) {
      throw new Error("Unable to find widget iframe")
    }

    const postMessageSpy = jest.spyOn(iframeElement, "postMessage")
    const expectedPayload = JSON.stringify({
      type: "mx/sdk/info",
      metadata: {
        sdk: "web",
        version: sdkVersion,
      },
    })

    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          mx: true,
          type: "mx/load",
          metadata: {},
        },
      }),
    )

    await waitFor(() => loaded)
    expect(postMessageSpy).toHaveBeenCalledWith(expectedPayload, widget.targetOrigin)

    postMessageSpy.mockRestore()
  })
})
