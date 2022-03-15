const invalidSsoUrlPropsMessage = `Missing required widget props!

Component needs one of the following groups of props:

  - url

    - or -

  - proxy

    - or -

  - apiKey
  - clientId
  - environment
  - userGuid`

export class InvalidSsoUrlPropsError extends Error {
  constructor() {
    super(invalidSsoUrlPropsMessage)
    Object.setPrototypeOf(this, InvalidSsoUrlPropsError.prototype)
  }
}

export class RequestError extends Error {
  readonly statusCode: number

  constructor(statusCode: number) {
    super(`Request failed: ${statusCode}`)
    this.statusCode = statusCode
    Object.setPrototypeOf(this, RequestError.prototype)
  }
}
