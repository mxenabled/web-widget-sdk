
type WidgetOptions = {
  id: string
  url: string
  style?: Partial<CSSStyleDeclaration>
  onMessage?: (data: unknown) => void
}

class Widget {
  private options: WidgetOptions
  private style: Partial<CSSStyleDeclaration>

  constructor(options: WidgetOptions) {
    
    this.options = options
    this.style = options.style || {
      height: '100%',
      width: '100%',
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
