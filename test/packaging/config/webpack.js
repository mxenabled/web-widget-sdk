const path = require("path")

module.exports = {
  mode: "production",
  entry: "./src/esm.js",
  output: {
    filename: "esm.js",
    path: path.join(__dirname, "..", "build"),
  }
}
