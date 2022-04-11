import fetch from "node-fetch"
import * as util from "util"

/* The type cast of `global.fetch` and `global.TextDecoder` to `unknown` is
 * needed to cleanly override the variables.
 *
 * fetch is needed because we are running in a Node environment which doesn't
 * have fetch, and TextDecoder is needed because Jest's jsdom environment
 * doesn't allow access to it (because it's not part of the DOM API), but
 * node-fetch requires it, so I'm including it here. Nothing besides fetch uses
 * TextDecoder.
 */
// prettier-ignore
(global.fetch as unknown) = fetch;
// prettier-ignore
(global.TextDecoder as unknown) = util.TextDecoder
