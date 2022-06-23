import { getSsoUrl, Props as UrlLoadingProps, Type, ConnectWidgetConfigurationProps } from "./sso"

import {
  ConnectPostMessageCallbackProps,
  PulsePostMessageCallbackProps,
  WidgetPostMessageCallbackProps,
  dispatchConnectPostMessageEvent,
  dispatchPulsePostMessageEvent,
  dispatchWidgetPostMessageEvent,
  NavigationPayload,
  Type as PostMessageTypes,
} from "@mxenabled/widget-post-message-definitions"

type BaseOptions = {
  container: string | Element
  iframeTitle?: string
  style?: Partial<CSSStyleDeclaration>
}

type PostMessageData<T> = {
  type: PostMessageTypes
  metadata: T
}

export type WidgetOptions<Configuration, CallbackProps> = BaseOptions &
  UrlLoadingProps<Configuration> &
  CallbackProps

export abstract class Widget<
  Configuration = unknown,
  CallbackProps = WidgetPostMessageCallbackProps<MessageEvent>,
> {
  protected options: WidgetOptions<unknown, WidgetPostMessageCallbackProps<MessageEvent>>
  protected iframe: HTMLIFrameElement
  protected container: Element
  protected style: Partial<CSSStyleDeclaration>
  protected isUnmounting: boolean
  protected ssoUrl?: string

  // Filters for 'mx' events before dispatching to proper handlers
  protected messageCallback: (event: MessageEvent) => void

  constructor(options: WidgetOptions<Configuration, CallbackProps>) {
    this.isUnmounting = false

    this.options = options
    this.iframe = document.createElement("iframe")
    this.style = options.style || {
      border: "none",
      height: "100%",
      width: "100%",
    }

    this.messageCallback = (event) => {
      if (event.data.mx) {
        if (event.data.type === "mx/client/oauthRedirect") {
          this.handleOAuthRedirect(event.data.metadata.url)
        }
        this.dispatcher(event, this.options)
      }
    }

    if (typeof options.container === "string") {
      const container = document.querySelector(options.container)
      if (!container) {
        throw new Error(
          `Unable to find widget container. Ensure that an element matching a selector for '${this.options.container}' is available in the DOM before you initialize the widget.`,
        )
      }
      this.container = container
    } else if (options.container instanceof Element) {
      this.container = options.container
    } else {
      throw new Error(
        "Invalid or missing value for container property, expecting a query selector string or a DOM Element.",
      )
    }

    this.setupIframe()
    this.setupListener()
  }

  get widgetType(): Type {
    if (this.options.widgetType) {
      return this.options.widgetType
    }

    throw new Error(
      "Missing value for widgetType property, expecting a string (eg. connect_widget).",
    )
  }

  get dispatcher() {
    return dispatchWidgetPostMessageEvent
  }

  /**
   * Public method to communicate with the iframe widget about a navigation event.
   * Can be called when the host has a 'back' event happen.
   * This will send a post message event to the iframe widget.
   * The iframe widget can listen for the 'mx/navigation' event.
   * Which sends its own post message event back with a `did_go_back` property.
   */
  navigateBack(): Promise<boolean> {
    return new Promise((resolve) => {
      const iframeElement = this.iframe.contentWindow
      const data = { mx: true, type: PostMessageTypes.Navigation, payload: { action: "back" } }

      if (!iframeElement) {
        throw new Error("Unable to navigate back, iframe element is not available.")
      }

      // If we get a navigation event back, resolve the promise with the value `did_go_back`
      const handleIncomingNavigationEvent = (
        e: MessageEvent<PostMessageData<NavigationPayload>>,
      ) => {
        if (e.data.type === PostMessageTypes.Navigation) {
          window.removeEventListener("message", handleIncomingNavigationEvent)
          resolve(e.data.metadata.did_go_back)
        }
      }

      // Set up temporary listener to listen for navigation events from the iframe widget
      window.addEventListener("message", handleIncomingNavigationEvent, false)

      // Send post message event to iframe widget, which can trigger a navigation event back
      iframeElement.postMessage(JSON.stringify(data), this.targetOrigin)
    })
  }

  handleOAuthRedirect(redirectURL: string): void {
    try {
      const urlStruct = new URL(redirectURL)
      const status = urlStruct.searchParams.get("status")
      const memberGuid = urlStruct.searchParams.get("member_guid")

      const message = {
        mx: true,
        type: `oauthComplete/${status}`,
        metadata: {
          member_guid: memberGuid
        }
      }

      const iframeElement = this.iframe.contentWindow

      iframeElement?.postMessage(message, this.targetOrigin)
    } catch (error) {
      console.error("Unable to postMessage OAuth URL: ", redirectURL)
      throw error
    }
  }

  /**
   * Public method to tear down our post message listener and iframe container
   */
  unmount() {
    this.isUnmounting = true

    this.teardownListener()
    this.teardownIframe()
  }

  /**
   * Uses matching to get our url targetOrigin, or falls back to our widgets url
   */
  private get targetOrigin(): string {
    const baseUrlPattern = /^https?:\/\/[^/]+/i
    let targetOrigin

    if (this.ssoUrl && this.ssoUrl.match(baseUrlPattern)) {
      targetOrigin = this.ssoUrl.match(baseUrlPattern)?.[0]
    }

    return targetOrigin || "https://widgets.moneydesktop.com"
  }

  /**
   * Construct and append iframe to DOM using id
   */
  private setupIframe() {
    getSsoUrl({
      ...this.options,
      widgetType: this.widgetType,
    }).then((url) => {
      if (this.isUnmounting || !url) {
        return
      }

      this.ssoUrl = url

      this.iframe.setAttribute("data-test-id", "mx-widget-iframe")
      this.iframe.setAttribute("title", this.options.iframeTitle || "Widget Iframe")
      this.iframe.setAttribute("src", url)

      Object.keys(this.style).forEach((prop) => {
        this.iframe.style[prop] = this.style[prop]
      })

      this.container.appendChild(this.iframe)
    })
  }

  /**
   * Removes iframe and container from DOM
   */
  private teardownIframe() {
    if (this.container.contains(this.iframe)) {
      this.container.removeChild(this.iframe)
    }
  }

  /**
   * Set up our post message listener
   */
  private setupListener() {
    window.addEventListener("message", this.messageCallback, false)
  }

  /**
   * Clean up post message event listener
   */
  private teardownListener() {
    window.removeEventListener("message", this.messageCallback, false)
  }
}

export class AccountsWidget extends Widget {
  get widgetType() {
    return Type.AccountsWidget
  }
}

export class BudgetsWidget extends Widget {
  get widgetType() {
    return Type.BudgetsWidget
  }
}

export class ConnectWidget extends Widget<
  ConnectWidgetConfigurationProps,
  ConnectPostMessageCallbackProps<MessageEvent>
> {
  get widgetType() {
    return Type.ConnectWidget
  }

  get dispatcher() {
    return dispatchConnectPostMessageEvent
  }
}

export class ConnectionsWidget extends Widget {
  get widgetType() {
    return Type.ConnectionsWidget
  }
}

export class DebtsWidget extends Widget {
  get widgetType() {
    return Type.DebtsWidget
  }
}

export class FinstrongWidget extends Widget {
  get widgetType() {
    return Type.FinstrongWidget
  }
}

export class GoalsWidget extends Widget {
  get widgetType() {
    return Type.GoalsWidget
  }
}

export class HelpWidget extends Widget {
  get widgetType() {
    return Type.HelpWidget
  }
}

export class MasterWidget extends Widget {
  get widgetType() {
    return Type.MasterWidget
  }
}

export class MiniBudgetsWidget extends Widget {
  get widgetType() {
    return Type.MiniBudgetsWidget
  }
}

export class MiniFinstrongWidget extends Widget {
  get widgetType() {
    return Type.MiniFinstrongWidget
  }
}

export class MiniPulseCarouselWidget extends Widget<
  unknown,
  PulsePostMessageCallbackProps<MessageEvent>
> {
  get widgetType() {
    return Type.MiniPulseCarouselWidget
  }

  get dispatcher() {
    return dispatchPulsePostMessageEvent
  }
}

export class MiniSpendingWidget extends Widget {
  get widgetType() {
    return Type.MiniSpendingWidget
  }
}

export class PulseWidget extends Widget<unknown, PulsePostMessageCallbackProps<MessageEvent>> {
  get widgetType() {
    return Type.PulseWidget
  }

  get dispatcher() {
    return dispatchPulsePostMessageEvent
  }
}

export class SettingsWidget extends Widget {
  get widgetType() {
    return Type.SettingsWidget
  }
}

export class SpendingWidget extends Widget {
  get widgetType() {
    return Type.SpendingWidget
  }
}

export class TransactionsWidget extends Widget {
  get widgetType() {
    return Type.TransactionsWidget
  }
}

export class TrendsWidget extends Widget {
  get widgetType() {
    return Type.TrendsWidget
  }
}
