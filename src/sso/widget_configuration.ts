/**
 * See "Configuration options" section in
 * https://docs.mx.com/api#connect_request_a_url for more details.
 */

export enum Type {
  AccountsWidget = "accounts_widget",
  BudgetsWidget = "budgets_widget",
  ConnectWidget = "connect_widget",
  ConnectionsWidget = "connections_widget",
  DebtsWidget = "debts_widget",
  FinstrongWidget = "finstrong_widget",
  GoalsWidget = "goals_widget",
  HelpWidget = "help_widget",
  MasterWidget = "master_widget",
  MiniBudgetsWidget = "mini_budgets_widget",
  MiniFinstrongWidget = "mini_finstrong_widget",
  MiniPulseCarouselWidget = "mini_pulse_carousel_widget",
  MiniSpendingWidget = "mini_spending_widget",
  PulseWidget = "pulse_widget",
  SettingsWidget = "settings_widget",
  SpendingWidget = "spending_widget",
  TransactionsWidget = "transactions_widget",
  TrendsWidget = "trends_widget",
}

type CWM =
  | "verification"
  | "aggregation"

export type ConnectWidgetMode =
  | `${CWM}`
  | `${CWM},${CWM}`
  | `${CWM},${CWM},${CWM}`
  | `${CWM},${CWM},${CWM},${CWM}`
  | `${CWM},${CWM},${CWM},${CWM},${CWM}`
  | `${CWM},${CWM},${CWM},${CWM},${CWM},${CWM}`
  | `${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM}`
  | `${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM}`
  | `${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM}`
  | `${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM}`

// Taken from https://stackoverflow.com/a/63715429, thank you!!
type Camelize<T> = { [K in keyof T as CamelizeString<K>]: T[K] }
type CamelizeString<T extends PropertyKey, C extends string = ""> =
  T extends string ? string extends T ? string :
    T extends `${infer F}_${infer R}` ?
      CamelizeString<Capitalize<R>, `${C}${F}`> : `${C}${T}` : T;

export type InternalWidgetConfigurationProps = Camelize<InternalWidgetConfiguration>
export type InternalWidgetConfiguration = WidgetConfiguration & {
  widget_type?: Type
}

export type WidgetConfigurationProps = Camelize<WidgetConfiguration>
export type WidgetConfiguration = {
  color_scheme?: "dark" | "light"
  is_mobile_webview?: boolean
  language?: string
  oauth_referral_source?: string
  ui_message_version?: number
  ui_message_webview_url_scheme?: string
}

export type ConnectWidgetConfigurationProps = Camelize<ConnectWidgetConfiguration>
export type ConnectWidgetConfiguration = WidgetConfiguration & {
  client_redirect_url?: string
  current_institution_code?: string
  current_institution_guid?: string
  current_member_guid?: string
  disable_institution_search?: boolean
  include_transactions?: boolean
  mode?: ConnectWidgetMode
  update_credentials?: boolean
  wait_for_full_aggregation?: boolean
}

export function getWidgetConfigurationFromProps(props: ConnectWidgetConfigurationProps & InternalWidgetConfigurationProps) {
  return {
    client_redirect_url: props.clientRedirectUrl,
    color_scheme: props.colorScheme,
    current_institution_code: props.currentInstitutionCode,
    current_institution_guid: props.currentInstitutionGuid,
    current_member_guid: props.currentMemberGuid,
    disable_institution_search: props.disableInstitutionSearch,
    include_transactions: props.includeTransactions,
    is_mobile_webview: props.isMobileWebview || false,
    mode: props.mode,
    oauth_referral_source: props.oauthReferralSource,
    ui_message_version: props.uiMessageVersion || 4,
    ui_message_webview_url_scheme: props.uiMessageWebviewUrlScheme,
    update_credentials: props.updateCredentials,
    wait_for_full_aggregation: props.waitForFullAggregation,
    widget_type: props.widgetType,
  }
}
