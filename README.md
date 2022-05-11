# MX Web Widget SDK

## Introduction

The purpose of this project is to help simplify your integration experience.
Giving you as few steps as possible to get up and running with an MX web widget.

After following the Getting Started instructions below, you will be able to
import and load MX widgets in your web applications, and configure them
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

Open a terminal and run the commands below at the root of your project to
install the SDK:

Using npm

```
npm install --save @mxenabled/web-widget-sdk
```

Using yarn

```
yarn add @mxenabled/web-widget-sdk
```

### Incorporating the SDK into your application

The Widget SDK provides multiple modules that you can import and use in your
application. There is currently a [CommonJS module][commonjs_module], an ES
module, an [AMD module][amd_module], and an [UMD module][umd_module] that you
can use depending on your build process.

#### CommonJS module

The CommonJS module is available in `@mxenabled/web-widget-sdk/dist/cjs`.
Import this module and build your project with a build tool that supports
CommonJS modules (such as [browserify][browserify]):

```js
const widgetSdk = require("@mxenabled/web-widget-sdk/dist/cjs")
const widget = new widgetSdk.ConnectWidget({ /* options */ })
```

#### ES module

The ES module is available in `@mxenabled/web-widget-sdk/dist/es`. Import this
module and build your project with a build tool that supports ES modules (such
as [webpack][webpack]):

```js
import * as widgetSdk from "@mxenabled/web-widget-sdk/dist/es"
const widget = new widgetSdk.ConnectWidget({ /* options */ })
```

#### AMD module

The AMD module can be found in
`node_modules/@mxenabled/web-widget-sdk/dist/amd/index.js`. In order to serve
this file in your application, you will have to host it yourself. Transfer this
file into any location where it can be made publicly available from. Once the
file is available, you can import and use it like so:

```html
<script src="https://requirejs.org/docs/release/2.3.6/minified/require.js"></script>
<script>
requirejs(["<path to MX Web Widget SDK AMD JavaScript file>"], function (widgetSdk) {
  const widget = new widgetSdk.ConnectWidget({ /* options */ })
})
</script>
```

#### UMD module

The UMD module can be found in
`node_modules/@mxenabled/web-widget-sdk/dist/umd/index.js`. In order to serve
this file in your application, you will have to host it yourself. Transfer this
file into any location where it can be made publicly available from. Once the
file is available, you can import and use it like so:

```html
<div id="container"></div>
<script src="<path to MX Web Widget SDK UMD JavaScript file>"></script>
<script>
const widget = new widgetSdk.ConnectWidget({ /* options */ })
</script>
```

### Generating your Widget SSO URL

See [SSO Widget URL documentation][api_request_widget_url] for instructions. If
loading the Connect Widget, follow the instructions located in [Connect SSO
Widget URL documentation][api_request_connect_url]. The SSO URL should be
passed to a Widget class via the `url` option.

```js
const options = {
  container: "#widget",
  url: "https://int-widgets.moneydesktop.com/md/connect/..."
}
```

#### Proxy server

The SDK also has the option of making the SSO request on your behalf to your
backend service that is able to make requests to our API. If used, the proxy
URL should passed to a Widget class via the `proxy` option.

```js
const options = {
  container: "#widget",
  proxy: "http://localhost:8089/{widget_type}/{user_guid}",
}
```

### Mounting and Unmounting the widget
When you instantiate a widget with options, it will mount itself in the DOM, and set up various event listeners.
You'll need to call the `unmount` method when closing the widget and before creating a new instance.

```js
const options = {
  container: "#widget",
  widgetURL: "https://int-widgets.moneydesktop.com/md/connect/...."
}

// Calling `new sdk.ConnectWidget(...)` here will mount the widget in the DOM
const widget = new widgetSdk.ConnectWidget(options)

// When you are ready to close the widget, you'll want to call `unmount`. This
// will remove the element and any event listeners added.
widget.unmount()
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
- `iframeTitle`: Allows for the title attribute of the iframe to be set.
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

[![Build SDK](https://github.com/mxenabled/web-widget-sdk/actions/workflows/build-sdk.yml/badge.svg)](https://github.com/mxenabled/web-widget-sdk/actions/workflows/build-sdk.yml)
[![Integration Tests](https://github.com/mxenabled/web-widget-sdk/actions/workflows/integration-tests.yml/badge.svg)](https://github.com/mxenabled/web-widget-sdk/actions/workflows/integration-tests.yml)
[![Package Audit](https://github.com/mxenabled/web-widget-sdk/actions/workflows/package-audit.yml/badge.svg)](https://github.com/mxenabled/web-widget-sdk/actions/workflows/package-audit.yml)

[amd_module]: https://requirejs.org/docs/whyamd.html "AMD modules"
[api_request_connect_url]: https://docs.mx.com/api#connect_request_a_url "Request a Connect URL"
[api_request_widget_url]: https://docs.mx.com/api#widgets_mx_widgets_request_widget_url "Request a widget URL"
[browserify]: https://browserify.org/ "Browserify"
[commonjs_module]: https://nodejs.org/api/modules.html "CommonJS modules"
[react_native_style]: https://reactnative.dev/docs/style "React Native Style"
[umd_module]: https://github.com/umdjs/umd "UMD modules"
[webpack]: https://webpack.js.org/ "webpack"
