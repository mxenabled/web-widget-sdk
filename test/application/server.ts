import { IncomingMessage, ServerResponse, RequestListener, createServer } from "http"
import axios from "axios"

function logInfo(msg) {
  process.stdout.write(`[${new Date().toISOString()}] [info] ${msg}\n`)
}

function logError(msg) {
  process.stderr.write(`[${new Date().toISOString()}] [error] ${msg}\n`)
}

function setResponseAccessControlHeaders(res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "*")
  res.setHeader("Access-Control-Allow-Headers", "*")
}

async function getRequestBody(req: IncomingMessage) {
  const parts: Uint8Array[] = []
  for await (const chunk of req) {
    parts.push(chunk)
  }

  return Buffer.concat(parts).toString()
}

function buildRequestUrl(apiHost: string, userGuid: string) {
  return `${apiHost}/users/${userGuid}/widget_urls`
}

function buildRequestOptions(req: IncomingMessage, clientId: string, apiKey: string) {
  return { headers: buildRequestHeaders(req, clientId, apiKey) }
}

function buildRequestHeaders(
  req: IncomingMessage,
  clientId: string,
  apiKey: string,
): Record<string, string> {
  return {
    Accept: "application/vnd.mx.api.v1+json",
    Authorization: `Basic ${Buffer.from(`${clientId}:${apiKey}`).toString("base64")}`,
    "Accept-Language": req.headers["accept-language"] || "en",
    "Content-Type": "application/json",
  }
}

function handler(
  apiHost: string,
  clientId: string,
  apiKey: string,
  userGuid: string,
): RequestListener {
  return async (req, res) => {
    logInfo(`handling ${req.method} ${req.url}`)

    if (req.method === "OPTIONS") {
      setResponseAccessControlHeaders(res)
      res.writeHead(200)
      res.end()
      return
    } else if (req.method !== "POST") {
      res.writeHead(400)
      res.end(`bad request, unable to handle ${req.method} method`)
      logError(`bad request, unable to handle ${req.method} method`)
      return
    }

    const url = buildRequestUrl(apiHost, userGuid)
    const options = buildRequestOptions(req, clientId, apiKey)
    const body = await getRequestBody(req)
    if (!body) {
      res.writeHead(400)
      res.end("bad request, missing body")
      logError("bad request, missing body")
      return
    }

    try {
      const apiRes = await axios.post(url, body, options)
      setResponseAccessControlHeaders(res)
      res.writeHead(200)
      res.end(JSON.stringify(apiRes.data))
    } catch (error) {
      res.writeHead(500)
      res.end(`unable to make API request: ${error}`)
      logError(`unable to make API request: ${error}`)
      return
    }

    logInfo(`finished ${req.method} ${req.url}`)
  }
}

function main() {
  const apiHost = process.env["INTEGRATION_TEST_API_HOST"]
  const apiKey = process.env["INTEGRATION_TEST_API_KEY"]
  const clientId = process.env["INTEGRATION_TEST_CLIENT_ID"]
  const userGuid = process.env["INTEGRATION_TEST_USER_GUID"]
  if (!apiHost || !apiKey || !clientId || !userGuid) {
    logError("missing environment data")
    logError("the following environment variables are required to run this server:")
    logError("  - INTEGRATION_TEST_API_HOST")
    logError("  - INTEGRATION_TEST_API_KEY")
    logError("  - INTEGRATION_TEST_CLIENT_ID")
    logError("  - INTEGRATION_TEST_USER_GUID")
    process.exit(1)
  }

  const port = process.env["PORT"] || 8089
  const server = createServer(handler(apiHost, clientId, apiKey, userGuid))

  logInfo("starting server")
  server.listen(port)
  logInfo(`listening on port ${port}`)
}

main()
