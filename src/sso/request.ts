import { Props, isSsoUrlMethodUrl } from "./properties"
import { RequestError } from "./error"
import {
  defaultSsoRequestBuilder,
  defaultSsoRequestPostprocess,
  defaultSsoRequestPreprocess,
} from "./request_processor"

export function getSsoUrl<Options>(props: Props<Options>): Promise<string | void> {
  if (isSsoUrlMethodUrl(props)) {
    return Promise.resolve(props.url)
  }

  const ssoRequestBuilder = props.ssoRequestBuilder ||
    defaultSsoRequestBuilder
  const ssoRequestPreprocess = props.ssoRequestPreprocess ||
    defaultSsoRequestPreprocess
  const ssoRequestPostprocess = props.ssoRequestPostprocess ||
    defaultSsoRequestPostprocess
  const onSsoUrlLoadError = props.onSsoUrlLoadError ||
    defaultOnSsoUrlLoadError

  const req = ssoRequestPreprocess(ssoRequestBuilder(props))

  return fetch(req.url, req.options)
    .then(handleFetchResponse)
    .then(ssoRequestPostprocess)
    .catch(onSsoUrlLoadError)
}

function handleFetchResponse(res: Response) {
  if (!res.ok) {
    throw new RequestError(res.status)
  }

  return res.json()
}

function defaultOnSsoUrlLoadError(err: Error) {
  console.error(err)
}
