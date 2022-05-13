This is a test application used in integration tests. Part of the integration
test includes building the SDK in a CommonJS and in an ES module to ensure we
are able to import and build the SDK for these different module types.

Run `npm run setup` to build the SDK and install it in this application, and
then run `npm run build` to build the application. A successful build means we
are able to import and build the SDK without issues.
