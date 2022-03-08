const requiredOptions = ['id', 'url']

const defaultValues = {
  height: 400,
  width: 500,
}

class WebWidgetSDK {

  constructor(options) {
    if (!WebWidgetSDK._instance) {
      WebWidgetSDK._instance = this;
      
      this.options = options;

      this.#validateOptions()
      this.#buildIframe()

      console.log("no instance yet", this)
    }

    console.log("instance already exists", this)
    return WebWidgetSDK._instance;
  }

  static getInstance() {
    return this._instance;
  }

  #validateOptions() {
    requiredOptions.forEach(option => {
      if (!this.options[option]) {
        throw new Error(`No ${option} provided`)
        }
    })
  }

  #buildIframe() {
    const iframe = document.createElement('iframe');

    iframe.src = this.options.url;
    iframe.height = this.options.height ?? defaultValues.height
    iframe.width = this.options.width ?? defaultValues.width
    
    const node = document.querySelector(this.options.id)
    node.appendChild(iframe)
  }
}

window.WebWidgetSDK = WebWidgetSDK