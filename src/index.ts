
type WidgetOptions = {
  id: string
  url: string
  style: Partial<CSSStyleDeclaration>
  onMessage?: (data: unknown) => void
}

class Widget {
  private options: WidgetOptions

  constructor(options: Partial<WidgetOptions>) {
    // If an instance already exists, return it ensuring nothing runs more than once
    // if (!WebWidgetSDK._instance) {
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

      // if (id === undefined || url === undefined) {
      //   throw new Error('Missing required options')
      // }
      // WebWidgetSDK._instance = this
      // if (!options || !options.url || !options.id) {
      //   throw new Error('Missing required options')
      // }

      this.options = {
        style: {
          height: '100%',
          width: '100%',
        },
        ...options,
        id,
        url
      }

      // Set up our post message listener to handle 'mx' messages
      this.setupPostMessages()

      // Construct and append iframe to DOM using id
      this.setupIFrame()
    // }

    // return WebWidgetSDK._instance
  }

  // static getInstance() {
  //   return this._instance
  // }

  // private validateOptions() {
  //   if (Object.keys(this.options).length === 0) {
  //     throw new Error('Missing options object')
  //   }

  //   requiredOptions.forEach((option) => {
  //     if (!this.options[option]) {
  //       throw new Error(`Missing required param ${option}`)
  //     }
  //   })
  // }

  private setupIFrame() {
    const iframe = document.createElement('iframe')

    iframe.src = this.options.url
    Object.keys(this.options.style).forEach((prop) => {
      console.log("prop", prop)
    })

    // iframe.style = this.options.style
    // iframe.width = this.options.width ?? defaultValues.width
    // iframe.height = this.options.height ?? defaultValues.height

    const node = document.querySelector(this.options.id)
    if (node) {
      node.appendChild(iframe)
    }
  }

  private setupPostMessages() {
    window.addEventListener(
      'message',
      (event) => {
        // Ensure we only capture mx post messages
        if (event.data.mx) {
          console.log('window message received', event)
          this.options.onMessage?.(event.data)
        }
      },
      false,
    )
  }
}
