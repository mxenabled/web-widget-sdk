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
  id: string
  style?: Partial<CSSStyleDeclaration>
}

export type WidgetOptions<Configuration, CallbackProps> = BaseOptions &
  UrlLoadingProps<Configuration> &
  CallbackProps

abstract class Widget<
  Configuration = {},
  CallbackProps = WidgetPostMessageCallbackProps<MessageEvent>,
> {
  protected options: WidgetOptions<unknown, WidgetPostMessageCallbackProps<MessageEvent>>
  protected style: Partial<CSSStyleDeclaration>

  constructor(options: WidgetOptions<Configuration, CallbackProps>) {
    this.options = options
    this.style = options.style || {
      border: "none",
      height: "100%",
      width: "100%",
    }

    this.setupPostMessages()
    this.setupIFrame()
  }

  get widgetType(): Type {
    if (this.options.widgetType) {
      return this.options.widgetType
    }

    throw new Error("Missing required widgetType option")
  }

  get dispatcher() {
    return dispatchWidgetPostMessageEvent
  }

  /**
   * Construct and append iframe to DOM using id
   */
  private setupIFrame() {
    const iframe = document.createElement("iframe")

    getSsoUrl({
      ...this.options,
      widgetType: this.widgetType,
    }).then((url) => {
      if (url) {
        iframe.src = url
      }
    })

    Object.keys(this.style).forEach((prop) => {
      iframe.style[prop] = this.style[prop]
    })

    const node = document.querySelector(this.options.id)
    if (node) {
      node.appendChild(iframe)
    }
  }

  /**
   * Set up our post message listener to handle 'mx' messages
   */
  private setupPostMessages() {
    window.addEventListener("message", (event) => {
      // Ensure we only capture mx post messages
      if (event.data.mx) {
        this.dispatcher(event, this.options)
      }
    })
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
  {},
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

export class PulseWidget extends Widget<{}, PulsePostMessageCallbackProps<MessageEvent>> {
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
