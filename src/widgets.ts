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
  widgetContainer: string | Element
  iframeTitle?: string
  style?: Partial<CSSStyleDeclaration>
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
  protected widgetContainer: Element
  protected style: Partial<CSSStyleDeclaration>

  // Filters for 'mx' events before dispatching to proper handlers
  protected messageCallback: (event: MessageEvent) => void

  constructor(options: WidgetOptions<Configuration, CallbackProps>) {
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

    if (typeof options.widgetContainer === "string") {
      const widgetContainer = document.querySelector(options.widgetContainer)
      if (!widgetContainer) {
        throw new Error(
          `Unable to find widget container. Ensure that an element matching a selector for '${this.options.widgetContainer}' is available in the DOM before you initialize the widget.`,
        )
      }
      this.widgetContainer = widgetContainer
    } else if (options.widgetContainer instanceof Element) {
      this.widgetContainer = options.widgetContainer
    } else {
      throw new Error(
        "Invalid or missing value for widgetContainer property, expecting a query selector string or a DOM Element.",
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
   * Public method to tear down our post message listener and iframe container
   */
  unmount() {
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
      if (url) {
        this.iframe.setAttribute("data-test-id", "mx-widget-iframe")
        this.iframe.setAttribute("title", this.options.iframeTitle || "Widget Iframe")
        this.iframe.setAttribute("src", url)

        Object.keys(this.style).forEach((prop) => {
          this.iframe.style[prop] = this.style[prop]
        })

        this.widgetContainer.appendChild(this.iframe)
      }
    })
  }

  /**
   * Removes iframe and container from DOM
   */
  private teardownIframe() {
    this.widgetContainer.removeChild(this.iframe)
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
