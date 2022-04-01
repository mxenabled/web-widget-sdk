# Running integration tests

The integration tests use Cypress and require you to run a proxy server so that
the widgets can load SSO URLs.

- `npm run test:server` to start the proxy server.
- `npm run test:integration` to run integration tests in a headless browser.
