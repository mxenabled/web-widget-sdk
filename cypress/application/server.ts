import * as express from "express"
import axios from "axios"
import "dotenv/config"

const apiHost = process.env["INTEGRATION_TEST_API_HOST"]
const apiKey = process.env["INTEGRATION_TEST_API_KEY"]
const clientId = process.env["INTEGRATION_TEST_CLIENT_ID"]
const userGuid = process.env["INTEGRATION_TEST_USER_GUID"]

if (!apiHost || !apiKey || !clientId || !userGuid) {
  console.log("unable to start server")
  console.log("the following environment variables are required but were not found:")
  if (!apiHost) console.log("  - INTEGRATION_TEST_API_HOST")
  if (!apiKey) console.log("  - INTEGRATION_TEST_API_KEY")
  if (!clientId) console.log("  - INTEGRATION_TEST_CLIENT_ID")
  if (!userGuid) console.log("  - INTEGRATION_TEST_USER_GUID")
  process.exit(1)
}

const app = express()
app.use(express.static(__dirname))
app.use("/dist", express.static(`${__dirname}/../../dist/`))
app.use(express.json())

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "*")
  res.setHeader("Access-Control-Allow-Headers", "*")
  next()
})

app.head("/", (req, res) => {
  res.send(200)
})

app.options("/get-sso-url", (req, res) => {
  res.send(200)
})

app.post("/get-sso-url", async (req, res, next) => {
  const url = `${apiHost}/users/${userGuid}/widget_urls`
  const headers = {
    "Accept-Language": req.headers["accept-language"] || "en",
    Accept: req.headers["accept"] || "application/vnd.mx.api.v1+json",
    Authorization: `Basic ${Buffer.from(`${clientId}:${apiKey}`).toString("base64")}`,
    "Content-Type": req.headers["content-type"] || "application/json",
  }

  try {
    const apiRes = await axios.post(url, req.body, { headers })
    res.json(apiRes.data)
  } catch (error) {
    next(error)
  }
})

app.listen(process.env["PORT"] || 8089)
