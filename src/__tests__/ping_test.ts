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

describe("Widget ping test", () => {
  beforeEach(() => {
    widget = new ConnectWidget({ url, container })
  })

  afterEach(() => {
    widget.unmount()
  })

  test("should ping to the widget when called", async () => {
    await waitFor(() => !!container?.getElementsByTagName("iframe")[0]?.src)

    const iframeElement = container?.getElementsByTagName("iframe")[0]?.contentWindow

    if (!iframeElement) {
      throw new Error("Unable to find widget iframe")
    }

    const postMessageSpy = jest.spyOn(iframeElement, "postMessage")
    const expectedPayload = JSON.stringify({ type: "ping" })

    widget.ping()

    expect(postMessageSpy).toHaveBeenCalledWith(expectedPayload, widget.targetOrigin)

    postMessageSpy.mockRestore()
  })
})
