const requiredOptions = ['id', 'url']

const defaultValues = {
  height: '100%',
  width: '100%',
  title: 'MX Web Widget',
}

class WebWidgetSDK {
  constructor(options = {}) {
    // If an instance already exists, return it ensuring nothing runs more than once
    if (!WebWidgetSDK._instance) {
      WebWidgetSDK._instance = this

      this.options = options

      // If we are missing a required option, throw an error
      this.#validateOptions()

      // Set up our post message listener to handle 'mx' messages
      this.#setupPostMessages()

      // Construct and append iframe to DOM using id
      this.#setupIFrame()
    }

    return WebWidgetSDK._instance
  }

  static getInstance() {
    return this._instance
  }

  #validateOptions() {
    if (Object.keys(this.options).length === 0) {
      throw new Error('Missing options object')
    }

    requiredOptions.forEach((option) => {
      if (!this.options[option]) {
        throw new Error(`Missing required param ${option}`)
      }
    })
  }

  #setupIFrame() {
    const iframe = document.createElement('iframe')

    iframe.src = this.options.url
    iframe.title = this.options.title ?? defaultValues.title
    iframe.width = this.options.width ?? defaultValues.width
    iframe.height = this.options.height ?? defaultValues.height

    const node = document.querySelector(this.options.id)
    node.appendChild(iframe)
  }

  #setupPostMessages() {
    window.addEventListener(
      'message',
      (event) => {
        // Ensure we only capture mx post messages
        if (event.data.mx) {
          console.log('window message received', event)
          this.options.onEvent(event.data.type, event.data.metadata)
        }
      },
      false,
    )
  }
}

window.WebWidgetSDK = WebWidgetSDK
