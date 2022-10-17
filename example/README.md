# MX Web Widget SDK AMD Example

## Running this example

1. Clone this repo.
2. Cd into newly created directory, or if using the defaults `cd web-widget-sdk`.
3. Run `npm install`.
4. Run `npm run example` and enter your API and user settings when asked for
   them. This command will start a proxy server for the MX Platform API and
   open your default browser and navigate to the example application after.

The example application uses [`@mxenabled/sso-api-proxy`][sso_api_proxy] to run
a proxy server that talks to MX's Platform API. When the proxy server first
starts up, it will prompt you to enter the necessary API and user settings in
order to run. This configuration is then saved locally. See [this
page][sso_api_proxy_config] for more information on how to configure
`@mxenabled/sso-api-proxy`.

[sso_api_proxy]: https://www.npmjs.com/package/@mxenabled/sso-api-proxy "@mxenabled/sso-api-proxy"
[sso_api_proxy_config]: https://github.com/mxenabled/sso-api-proxy#configuration "Configuration"
