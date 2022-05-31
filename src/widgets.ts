import { getSsoUrl, Props as UrlLoadingProps, Type, ConnectWidgetConfigurationProps } from "./sso"

import {
  ConnectPostMessageCallbackProps,
  PulsePostMessageCallbackProps,
  WidgetPostMessageCallbackProps,
  dispatchConnectPostMessageEvent,
  dispatchPulsePostMessageEvent,
  dispatchWidgetPostMessageEvent,
} from "@mxenabled/widget-post-message-definitions"

type BaseOptions = {
  container: string | Element
  iframeTitle?: string
  style?: Partial<CSSStyleDeclaration>
  url?: string
  proxy?: string
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
   * Public method to communicate with iframe widget about navigation events
   * Can be called when the host has a 'back' event happen.
   * This will send a post message event to the iframe widget, which if it's
   * listening for the 'mx/navigation' event, it can make its changes and then
   * send its own post message event back to the SDK for the 'onNavigation' callback
   */
  navigateBack() {
    const iframeElement = this.iframe.contentWindow

    if (!iframeElement) {
      throw new Error("Unable to navigate back, iframe element is not available.")
    }

    let targetOrigin
    const baseUrlPattern = /^https?:\/\/[^/]+/i

    if (this.options.url && this.options.url.match(baseUrlPattern)) {
      targetOrigin = this.options.url.match(baseUrlPattern)?.[0]
    }

    const data = { mx: true, type: "mx/navigation", payload: { action: "back" } }

    iframeElement.postMessage(data, targetOrigin || "https://widgets.moneydesktop.com")
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
