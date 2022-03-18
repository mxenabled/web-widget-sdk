import {
  Type,
  InternalWidgetConfigurationProps,
  WidgetConfigurationProps,
} from "./widget_configuration"

export type Props<CustomWidgetConfigurationProps> = SsoUrlProps &
  InternalWidgetConfigurationProps &
  CustomWidgetConfigurationProps

export type ApiRequestOptions = {
  url: RequestInfo
  options: RequestInit
}

export type ApiResponseBody = {
  widget_url: {
    type: Type
    url: string
  }
}

export type SsoUrlProps = SsoUrlMethodProps & SsoUrlRequestProps

export type SsoUrlMethodProps =
  | SsoUrlMethodUrlProps
  | SsoUrlMethodPlatformApiProps
  | SsoUrlMethodProxyServerProps

export type SsoUrlMethodUrlProps = {
  url: string
}

export type SsoUrlMethodPlatformApiProps = {
  apiKey: string
  clientId: string
  environment: string
  userGuid: string
}

export type SsoUrlMethodProxyServerProps = {
  proxy: string
}

export type SsoUrlRequestProps = {
  onSsoUrlLoadError?: (error: Error) => void
  ssoRequestBuilder?: (
    props: WidgetConfigurationProps & InternalWidgetConfigurationProps,
  ) => ApiRequestOptions
  ssoRequestPreprocess?: (opts: ApiRequestOptions) => ApiRequestOptions
  ssoRequestPostprocess?: (res: ApiResponseBody) => string
}

export function isSsoUrlMethodUrl(props: SsoUrlProps): props is SsoUrlMethodUrlProps {
  return "url" in props && typeof props.url === "string"
}

export function isSsoUrlMethodProxyServer(
  props: SsoUrlProps,
): props is SsoUrlMethodProxyServerProps {
  return "proxy" in props && typeof props.proxy === "string"
}

export function isSsoUrlMethodPlatformApi(
  props: SsoUrlProps,
): props is SsoUrlMethodPlatformApiProps {
  return (
    "clientId" in props &&
    typeof props.clientId === "string" &&
    "apiKey" in props &&
    typeof props.apiKey === "string" &&
    "userGuid" in props &&
    typeof props.userGuid === "string" &&
    "environment" in props &&
    typeof props.environment === "string"
  )
}
