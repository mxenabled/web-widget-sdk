// rollup.config.js
import typescript from "@rollup/plugin-typescript"
import { nodeResolve } from "@rollup/plugin-node-resolve"

export default {
  input: "output/index.js",
  output: [
    {
      dir: "dist/es",
      format: "es",
    },
    {
      dir: "dist/cjs",
      format: "cjs",
    },
    {
      dir: "dist/amd",
      format: "amd",
    },
  ],
  plugins: [typescript(), nodeResolve()],
}
