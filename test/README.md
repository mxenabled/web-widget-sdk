# Integration tests

The integration tests use Cypress and require you to run a proxy server so that
the widgets can load SSO URLs.

- `npm run test:server` to start the proxy server.
- `npm run test:integration` to run integration tests in a headless browser.

Make sure you have the following environment variables set for the proxy
server:

- `INTEGRATION_TEST_API_HOST`, the Platform API host, eg. "https://int-api.mx.com/".
- `INTEGRATION_TEST_API_KEY`, the client's API key.
- `INTEGRATION_TEST_CLIENT_ID`, the client's id.
