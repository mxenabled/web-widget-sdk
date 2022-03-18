import {
  ApiRequestOptions,
  ApiResponseBody,
  Props,
  SsoUrlMethodPlatformApiProps,
  SsoUrlMethodProxyServerProps,
  isSsoUrlMethodPlatformApi,
  isSsoUrlMethodProxyServer,
} from "./properties"

import { lookupHost } from "./environment"
import { getWidgetConfigurationFromProps } from "./widget_configuration"
import { InvalidSsoUrlPropsError } from "./error"

export function defaultSsoRequestPostprocess(body: ApiResponseBody): string {
  return body.widget_url.url
}

export function defaultSsoRequestBuilder<Configuration>(
  props: Props<Configuration>,
): ApiRequestOptions {
  const url = getRequestUrl(props)
  const options = getRequestOptions(props)
  return { url, options }
}

export function defaultSsoRequestPreprocess(opts: ApiRequestOptions): ApiRequestOptions {
  return opts
}

function getRequestUrl<Configuration>(props: Props<Configuration>): string {
  if (isSsoUrlMethodProxyServer(props)) {
    return getProxyServerRequestUrl(props)
  } else if (isSsoUrlMethodPlatformApi(props)) {
    return getPlatformApiRequestUrl(props)
  }

  throw new InvalidSsoUrlPropsError()
}

function getProxyServerRequestUrl(props: SsoUrlMethodProxyServerProps): string {
  return props.proxy
}

function getPlatformApiRequestUrl(props: SsoUrlMethodPlatformApiProps): string {
  const host = lookupHost(props.environment)
  const userGuid = props.userGuid
  return `${host}/users/${userGuid}/widget_urls`
}

function getRequestOptions<Configuration>(props: Props<Configuration>): RequestInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.mx.api.v1+json",
    "Content-Type": "application/json",
  }
  if (props.language) {
    headers["Accept-Language"] = props.language
  }
  if (isSsoUrlMethodPlatformApi(props)) {
    const { apiKey, clientId } = props
    const authorization = btoa(`${clientId}:${apiKey}`)
    headers["Authorization"] = `Basic ${authorization}`
  }

  const mode = "cors"
  const method = "POST"
  const body = JSON.stringify({
    widget_url: getWidgetConfigurationFromProps(props),
  })

  return { method, headers, body, mode }
}
