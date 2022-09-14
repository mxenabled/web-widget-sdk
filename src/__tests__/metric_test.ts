import { ConnectWidget } from "../../src"
import { sdkVersion } from "../../src/version"
import { wait, waitFor } from "../../jest/utils"

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

describe("Widget SDK metrics", () => {
  beforeEach(() => {
    widget = new ConnectWidget({ url, container })
  })

  afterEach(() => {
    widget.unmount()
  })

  test("should send metrics to the widget after the widget loads", async () => {
    await waitFor(() => !!container?.getElementsByTagName("iframe")[0]?.src)

    const iframeElement = container?.getElementsByTagName("iframe")[0]?.contentWindow

    if (!iframeElement) {
      throw new Error("Unable to find widget iframe")
    }

    const postMessageSpy = jest.spyOn(iframeElement, "postMessage")
    const expectedPayload = JSON.stringify({
      type: "mx/sdk/metrics",
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

    await wait(100)
    expect(postMessageSpy).toHaveBeenCalledWith(expectedPayload, widget.targetOrigin)

    postMessageSpy.mockRestore()
  })
})
