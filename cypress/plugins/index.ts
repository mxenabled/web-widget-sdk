module.exports = (on, config) => {
  config.baseUrl = `http://localhost:${process.env["PORT"] || 8089}`
  config.skipRemoteAssetTests = process.env["SKIP_REMOTE_ASSET_TESTS"]

  return config
}
