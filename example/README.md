# MX Web Widget SDK AMD Example

## Running this example

1. Clone this repo.
2. Cd into newly created directory, or if using the defaults `cd web-widget-sdk`.
3. Run `npm install -g ts-node` to install as global
4. Start a static file server, `python -m SimpleHTTPServer`, or `python3 -m http.server`.
5. Navigate to http://localhost:8000/ or wherever your server is running.

## Testing the widget via the `url` option

Follow the same steps as above but also:

1. Open `examples/index.html`
2. Run `npm run watch`
3. Comment out the `proxy` configuration option
4. Add a `url` configuration option that is a widget URL
5. Run `npm run build`
6. visit http://localhost:8000/example/

For example:

```
const options = {
  container: "#widget",
  iframeTitle: "Example Widget",
  url: "https://widgets.moneydesktop.com.mx/md/connect/...",
}
```
