
type WidgetOptions = {
  id: string
  url: string
  style: Partial<CSSStyleDeclaration>
  onMessage?: (data: unknown) => void
}

class Widget {
  private options: WidgetOptions

  constructor(options: Partial<WidgetOptions>) {
    
    let id: string
    if (typeof options.id === 'string') {
      id = options.id
    } else {
      throw new Error("missing id prop")
    }
    
    let url: string
    if (typeof options.url === 'string') {
      url = options.url
    } else {
      throw new Error("missing url prop")
    }

    this.options = {
      style: {
        height: '100%',
        width: '100%',
      },
      ...options,
      id,
      url
    }

    this.setupPostMessages()
    this.setupIFrame()
  }

  /**
   * Construct and append iframe to DOM using id
   */
  private setupIFrame() {
    const iframe = document.createElement('iframe')

    iframe.src = this.options.url
    Object.keys(this.options.style).forEach((prop) => {
      console.log("prop", prop)
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
    window.addEventListener(
      'message',
      (event) => {
        // Ensure we only capture mx post messages
        if (event.data.mx) {
          this.options.onMessage?.(event.data)
        }
      }
    )
  }
}
