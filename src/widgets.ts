import { getSsoUrl, Props, Type, ConnectWidgetConfigurationProps } from "./sso"

export type WidgetOptions<Configuration> = Props<Configuration> & {
  id: string
  style?: Partial<CSSStyleDeclaration>
  onMessage?: (data: unknown) => void
}

abstract class Widget<Configuration = {}> {
  protected options: WidgetOptions<unknown>
  protected style: Partial<CSSStyleDeclaration>

  constructor(options: WidgetOptions<Configuration>) {
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
        this.options.onMessage?.(event.data)
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

export class ConnectWidget extends Widget<ConnectWidgetConfigurationProps> {
  get widgetType() {
    return Type.ConnectWidget
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

export class MiniPulseCarouselWidget extends Widget {
  get widgetType() {
    return Type.MiniPulseCarouselWidget
  }
}

export class MiniSpendingWidget extends Widget {
  get widgetType() {
    return Type.MiniSpendingWidget
  }
}

export class PulseWidget extends Widget {
  get widgetType() {
    return Type.PulseWidget
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
