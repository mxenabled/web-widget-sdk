# MX Web Widget SDK

## Introduction

The purpose of this project is to help simplify your integration experience.
Giving you as few steps as possible to get up and running with an MX React
Native widget.

After following the Getting Started instructions below, you will be able to
import and load MX widgets in your React Native application, and configure them
for your specific needs.

## Getting Started

Please refer to the offical [MX Docs](https://docs.mx.com/) for an in-depth
explanation of the MX platform. The general outline for incorporating the
`web-widget-sdk` into your project is as follow:

- Signup for a developer account at the developer portal.
- Install and setup the SDK via `npm` or `yarn`.
- Generate an authenticated SSO widget url.
- Import the widget into your project providing it with the needed
  configuration object.

###  Aquire your developer account

A developer account can be obtained by signing up on our [Client
Portal](https://dashboard.mx.com) site.

### Installing the SDK

TODO: Install via es6 module system instructions.
TODO: Install via AMD module system instructions.

### Generating your Widget SSO URL

See [SSO Widget URL documentation][api_request_widget_url] for instructions. If
loading the Connect Widget, follow the instructions located in [Connect SSO
Widget URL documentation][api_request_connect_url]. The SSO URL should be
passed to a Widget class via the `url` option.

#### Proxy server

The SDK also has the option of making the SSO request on your behalf to your
backend service that is able to make requests to our API. If used, the proxy
URL should passed to a Widget class via the `proxy` option.

### Importing the SDK into your project and rendering a widget using modules with Asynchronous Module Definition (AMD)

Once the steps above have been completed, you will be able to import 
the `@mxenabled/web-widget-sdk` package and render them in your application:

```html
<script src="mx-web-widget-sdk-amd.js"></script>

<script>
  requirejs(["@mxenabled/web-widget-sdk"], function (sdk) {
    const options = {
      widgetContainer: "#widget",
      proxy: "http://localhost:8089/{widget_type}/{user_guid}",
      onMessage: (event) => {
        logEvent(event.data)
      },
    }

    const widget = new sdk.ConnectWidget(options)
  })
</script>
```
### Interacting with the widget

You can listen to post message events by passing callback functions in the widget
options object to the class. The option names follow this naming scheme:

* For widget events: `on<event name>`,
* For entity events: `on<entity><action>`

For example, the `mx/connect/selectInstitution` event is made available via
`onSelectInstitution` in the `ConnectWidget` class. Refer to [this
document](docs/widget_callback_props.md) for a list of events and their
payloads.

### Widget options

You can configure the state and behaviour of the widget with the following
class options:

- `language`: Load the widget in the specified language. Defaults to `en-US`.
  See [language
  options](https://docs.mx.com/api#connect_configuring_connect_language_options)
  for additional information.
- `proxy`: SSO proxy server URL.
- `style`: Styles applied to the view containing the widget.
- `url`: Widget SSO URL. See [Generating your Widget SSO
  URL](#generating-your-widget-sso-url) for additional information. **This prop
  is required.**

#### Connect specific options

- `colorScheme`: Load the widget in the specified colorScheme; options are
  `light` and `dark`. Defaults to `light`.
- `currentInstitutionCode`: Load the widget into the credential view for the
  specified institution.
- `currentInstitutionGuid`: Load the widget into the credential view for the
  specified institution.
- `currentMemberGuid`: Load to a specific member that contains an error or
  requires MFA from the most recent job. `currentMemberGuid` takes precedence
  over `currentInstitutionCode`.
- `disableInstitutionSearch`: When set to true, the institution search feature
  will be disabled and end users will not be able to navigate to it. Must be
  used with `currentInstitutionCode`, `currentInstituionGuid`, or
  `currentMemberGuid`.
- `includeTransactions`: When set to false while creating or updating a member,
  transaction data will not be automatically aggregated. Future manual or
  background aggregations will not be affected. Defaults to true.
- `uiMessageWebviewUrlScheme`: Used as the scheme that MX will redirect to at
  the end of OAuth. This must be a scheme that your application responds to.
  See [OAuth redirects](#oauth-redirects) for additional information.
- `updateCredentials`: Loads widget to the update credential view of a current
  member. Optionally used with `currentMemberGuid`. This option should be used
  sparingly. The best practice is to use `currentMemberGuid` and let the widget
  resolve the issue.
- `waitForFullAggregation`: Loads Connect, but forces the widget to wait until
  any aggregation-type process is complete in order to fire a member connected
  postMessage. This allows clients to have transactional data by the time the
  widget is closed.

### Available widget classes

This SDK exposes the following classes:

- `AccountsWidget`
- `BudgetsWidget`
- `ConnectAggregationWidget`
- `ConnectVerificationWidget`
- `ConnectWidget`
- `ConnectionsWidget`
- `DebtsWidget`
- `FinstrongWidget`
- `GoalsWidget`
- `HelpWidget`
- `MasterWidget`
- `MiniBudgetsWidget`
- `MiniFinstrongWidget`
- `MiniPulseCarouselWidget`
- `MiniSpendingWidget`
- `PulseWidget`
- `SettingsWidget`
- `SpendingWidget`
- `TransactionsWidget`
- `TrendsWidget`

---

[api_request_widget_url]: https://docs.mx.com/api#widgets_mx_widgets_request_widget_url "Request a widget URL"
[api_request_connect_url]: https://docs.mx.com/api#connect_request_a_url "Request a Connect URL"
[react_native_style]: https://reactnative.dev/docs/style "React Native Style"