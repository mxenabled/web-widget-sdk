import {
  AccountsWidget,
  BudgetsWidget,
  ConnectWidget,
  ConnectionsWidget,
  DebtsWidget,
  FinstrongWidget,
  GoalsWidget,
  HelpWidget,
  MasterWidget,
  MiniBudgetsWidget,
  MiniFinstrongWidget,
  MiniPulseCarouselWidget,
  MiniSpendingWidget,
  PulseWidget,
  SettingsWidget,
  SpendingWidget,
  TransactionsWidget,
  TrendsWidget,
} from "../../src"

import { waitFor } from "../../jest/utils"
import { rest, server } from "../../jest/server"

const url = "https://widgets.moneydesktop.com/md/..."
const proxy = "https://client.com/mx-sso-proxy"
const clientId = "myVeryOwnClientId"
const apiKey = "myVeryOwnApiKey"
const userGuid = "USR-777"
const environment = "production"

let container = document.createElement("div")
beforeEach(() => {
  container = document.createElement("div")
  document.body.appendChild(container)
})

afterEach(() => {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild)
  }
})

const widgets = [
  AccountsWidget,
  BudgetsWidget,
  ConnectWidget,
  ConnectionsWidget,
  DebtsWidget,
  FinstrongWidget,
  GoalsWidget,
  HelpWidget,
  MasterWidget,
  MiniBudgetsWidget,
  MiniFinstrongWidget,
  MiniPulseCarouselWidget,
  MiniSpendingWidget,
  PulseWidget,
  SettingsWidget,
  SpendingWidget,
  TransactionsWidget,
  TrendsWidget,
]
widgets.forEach((widgetClass) => {
  describe(widgetClass.name, () => {
    describe("initialization", () => {
      test("an error is thrown when the container element is not found", () => {
        expect(() => {
          new widgetClass({ url, container: "#notfound" })
        }).toThrow(
          "Unable to find widget container. Ensure that an element matching a selector for '#notfound' is available in the DOM before you initialize the widget.",
        )
      })

      test("it appends the iframe to the widget container element when container is a DOM element", async () => {
        new widgetClass({ url, container })

        await waitFor(() => !!container?.getElementsByTagName("iframe")[0]?.src)

        expect(container?.children.length).toBe(1)
        expect(container?.children[0].tagName).toBe("IFRAME")
      })

      test("it appends the iframe to the widget container element when container is a CSS selector", async () => {
        container.id = "widget"
        new widgetClass({ url, container: "#widget" })

        await waitFor(() => !!container?.getElementsByTagName("iframe")[0]?.src)

        expect(container?.children.length).toBe(1)
        expect(container?.children[0].tagName).toBe("IFRAME")
      })

      test("post message event listener is added", () => {
        const spy = jest.spyOn(window, "addEventListener").mockImplementation(() => ({
          addEventListener: jest.fn(),
        }))

        new widgetClass({ url, container })

        expect(window.addEventListener).toHaveBeenCalledWith("message", expect.anything(), false)
        spy.mockRestore()
      })
    })

    describe("unmount", () => {
      test("it removes the iframe from the container element", async () => {
        const widget = new widgetClass({ url, container })

        await waitFor(() => !!container?.getElementsByTagName("iframe")[0]?.src)

        widget.unmount()

        expect(container?.children.length).toBe(0)
      })

      test("it prevents from appending the iframe if unmount was called early", async () => {
        const widget = new widgetClass({ url, container })

        widget.unmount()

        expect(container?.children.length).toBe(0)
      })

      test("post message event listener is removed", async () => {
        const spy = jest.spyOn(window, "removeEventListener").mockImplementation(() => ({
          removeEventListener: jest.fn(),
        }))

        const widget = new widgetClass({ url, container })

        await waitFor(() => !!container?.getElementsByTagName("iframe")[0]?.src)

        widget.unmount()

        expect(window.removeEventListener).toHaveBeenCalledWith("message", expect.anything(), false)
        spy.mockRestore()
      })
    })

    describe("Post Message Dispatching", () => {
      test("message payload is included", () => {
        const onPing = jest.fn()
        new widgetClass({ url, container, onPing })

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

    describe("SSO URL Loading", () => {
      describe("Platform API", () => {
        test("it is able to load the widget url when Platform API props are passed in", async () => {
          const widget = new widgetClass({
            apiKey,
            clientId,
            environment,
            userGuid,
            container,
          })

          await waitFor(() => !!container?.getElementsByTagName("iframe")[0]?.src)

          expect(container?.getElementsByTagName("iframe")[0]?.src).toBe(
            `https://widgets.moneydesktop.com/md/${widget.widgetType}/$ssotoken$`,
          )
        })

        test("an error results in the onSsoUrlLoadError callback being triggered", (done) => {
          expect.assertions(1)

          server.use(
            rest.post("https://api.mx.com/users/:userGuid/widget_urls", (req, res, ctx) =>
              res(ctx.status(500), ctx.json({ message: "NO!" })),
            ),
          )

          new widgetClass({
            apiKey,
            clientId,
            environment,
            userGuid,
            container,
            onSsoUrlLoadError: (_error) => {
              expect(true).toBe(true)
              done()
            },
          })
        })

        test("it passes the request back to the host before execution via the ssoRequestPreprocess callback", async () => {
          new widgetClass({
            apiKey,
            clientId,
            environment,
            userGuid,
            container,
            ssoRequestPreprocess: (req) => {
              const body = JSON.parse(req.options.body?.toString() || "")
              body.widget_url.widget_type = "something_else"
              req.options.body = JSON.stringify(body)
              return req
            },
          })

          await waitFor(() => !!container?.getElementsByTagName("iframe")[0]?.src)

          expect(container?.getElementsByTagName("iframe")[0]?.src).toContain(
            "https://widgets.moneydesktop.com/md/something_else/",
          )
        })
      })

      describe("Proxy server", () => {
        test("it is able to load the widget url when proxy props are passed in", async () => {
          const widget = new widgetClass({ proxy, container })

          await waitFor(() => !!container?.getElementsByTagName("iframe")[0]?.src)

          expect(container?.getElementsByTagName("iframe")[0]?.src).toBe(
            `https://widgets.moneydesktop.com/md/${widget.widgetType}/$ssotoken$`,
          )
        })

        test("an error results in the onSsoUrlLoadError callback being triggered", (done) => {
          expect.assertions(1)

          server.use(
            rest.post("https://client.com/mx-sso-proxy", (req, res, ctx) =>
              res(ctx.status(500), ctx.json({ message: "NO!" })),
            ),
          )

          new widgetClass({
            proxy,
            container,
            onSsoUrlLoadError: (_error) => {
              expect(true).toBe(true)
              done()
            },
          })
        })

        test("it passes the request back to the host before execution via the ssoRequestPreprocess callback", async () => {
          new widgetClass({
            proxy,
            container,
            ssoRequestPreprocess: (req) => {
              const body = JSON.parse(req.options.body?.toString() || "")
              body.widget_url.widget_type = "something_else"
              req.options.body = JSON.stringify(body)
              return req
            },
          })

          await waitFor(() => !!container?.getElementsByTagName("iframe")[0]?.src)

          expect(container?.getElementsByTagName("iframe")[0]?.src).toContain(
            "https://widgets.moneydesktop.com/md/something_else/",
          )
        })
      })

      describe("URL", () => {
        test("it is able to get the widget url from props when a url prop is passed in", async () => {
          new widgetClass({
            url: "https://widgets.moneydesktop.com/md/hi/tototoken",
            container,
          })

          await waitFor(() => !!container?.getElementsByTagName("iframe")[0]?.src)

          expect(container?.getElementsByTagName("iframe")[0]?.src).toBe(
            "https://widgets.moneydesktop.com/md/hi/tototoken",
          )
        })
      })

      test("it throws when no loading props are included", () => {
        /* [1]: Widget classes expect either URL loading props, API loading
         * props, or proxy loading props, but we want to test how it behaves at
         * runtime when it's missing that data, so we suppress compilation
         * errors errors here in order to do that.
         */
        expect(() => {
          /* eslint @typescript-eslint/ban-ts-comment: "off" */
          /* @ts-ignore: see [1] for details */
          new widgetClass({ container })
        }).toThrow()
      })
    })
  })
})

describe("ConnectWidget", () => {
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
