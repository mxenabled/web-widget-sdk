import typescript from "@rollup/plugin-typescript"
import { nodeResolve } from "@rollup/plugin-node-resolve"

export default {
  input: "build/index.js",
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
