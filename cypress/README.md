# Integration tests

The integration tests use Cypress and require a proxy server to be running so
that we can make SSO URL requests from within the tests. The proxy server
requires some configuration which is outlined in this document.

Part of the integration test includes building the SDK in a CommonJS and in an
ES module to ensure we are able to import and build the SDK for these different
module types. All of that is done in the test application which can be found in
`cypress/application`.

**Make sure to build with `npm run test:build` before running the integration
tests.** Below are commands that relate to the integration tests:

- `npm run test:build` builds the SDK and install it in the test application,
  then builds the actual application. A successful build means we are able to
  import and build the SDK without issues.
- `npm run test:integration` to run the proxy server in the background and then
  execute the Cypress tests. The proxy server will be shut down when the tests
  complete. **This is the only command you need to remember.**
- `npm run test:cypress` to just execute the Cypress tests.
- `npm run test:server` to just run the proxy server.

## Configuring the proxy server

The proxy server needs your user and API information in order to work, all of
which can be configured via environment variables:

- `INTEGRATION_TEST_API_HOST`, the Platform API host, eg. "https://int-api.mx.com/".
- `INTEGRATION_TEST_API_KEY`, the client's API key.
- `INTEGRATION_TEST_CLIENT_ID`, the client's id.
- `INTEGRATION_TEST_USER_GUID`, the user's guid.

## Additional configuration

If you want to run the proxy server on another port, you can do so by setting
the `PORT` environment variable, (for example, `PORT=8042 npm run test:integration`).
By default, the proxy server will run on port 8089. You can also set
`DEBUG=express*` in your environment to run the server in verbose mode.
