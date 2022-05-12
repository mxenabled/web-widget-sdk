import typescript from "@rollup/plugin-typescript"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import { terser } from "rollup-plugin-terser"

export default {
  input: "build/src/index.js",
  output: [
    {
      file: "dist/esm/index.js",
      format: "esm",
    },
    {
      file: "dist/esm/index.min.js",
      format: "esm",
      plugins: [terser()],
    },
    {
      file: "dist/cjs/index.js",
      format: "cjs",
    },
    {
      file: "dist/cjs/index.min.js",
      format: "cjs",
      plugins: [terser()],
    },
    {
      dir: "dist/amd",
      format: "amd",
    },
    {
      file: "dist/amd/index.min.js",
      format: "amd",
      plugins: [terser()],
    },
    {
      file: "dist/umd/index.js",
      format: "umd",
      name: "widgetSdk",
    },
    {
      file: "dist/umd/index.min.js",
      format: "umd",
      name: "widgetSdk",
      plugins: [terser()],
    },
  ],
  plugins: [typescript(), nodeResolve()],
}
