import * as widgets from "./widgets"

declare function define<T>(name: string, mod: () => T)
define("@mxenabled/web-widget-sdk", function () {
  return widgets
})
