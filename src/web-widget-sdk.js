const requiredOptions = ['id', 'url']

const defaultValues = {
  height: 400,
  width: 500,
  title: 'MX Web Widget',
}

class WebWidgetSDK {
  constructor(options) {
    if (!WebWidgetSDK._instance) {
      WebWidgetSDK._instance = this

      this.options = options

      this.#validateOptions()
      this.#setupPostMessages()
      this.#buildIframe()

      console.log('no instance yet', this)
    }

    console.log('instance already exists', this)
    return WebWidgetSDK._instance
  }

  static getInstance() {
    return this._instance
  }

  #validateOptions() {
    requiredOptions.forEach((option) => {
      if (!this.options[option]) {
        throw new Error(`No ${option} provided`)
      }
    })
  }

  #buildIframe() {
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
        console.log('window message received', event)
        // if (event.origin !== 'http://example.org:8080') return

        // ...
      },
      false,
    )

    document.addEventListener(
      'message',
      (event) => {
        console.log('document message received', event)
        // if (event.origin !== 'http://example.org:8080') return

        // ...
      },
      false,
    )
  }
}

window.WebWidgetSDK = WebWidgetSDK
