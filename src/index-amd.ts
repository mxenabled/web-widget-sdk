/**
 * This file is the entry point for the AMD module built with browserify and
 * babel.
 */
import * as widgets from "./widgets"

declare function define<T>(name: string, mod: () => T)
define("@mxenabled/web-widget-sdk", function () {
  return widgets
})
