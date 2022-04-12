import { rest } from "msw"
import { setupServer } from "msw/node"

import type {
  RestContext,
  ResponseComposition,
  DefaultRequestBody,
  RestRequest,
  PathParams,
} from "msw"

type Body = {
  widget_url?: {
    widget_type?: string
  }
}

const respondWithSsoUrl = (
  req: RestRequest<Body, PathParams>,
  res: ResponseComposition<DefaultRequestBody>,
  ctx: RestContext,
) => {
  const widget = req.body?.widget_url?.widget_type

  if (!widget) {
    return res(ctx.status(400), ctx.json({ error: true }))
  }

  return res(
    ctx.status(200),
    ctx.json({
      widget_url: {
        type: widget,
        url: `https://widgets.moneydesktop.com/md/${widget}/$ssotoken$`,
      },
    }),
  )
}

const handlers = [
  rest.post<Body>("https://api.mx.com/users/:userGuid/widget_urls", respondWithSsoUrl),
  rest.post<Body>("https://client.com/mx-sso-proxy", respondWithSsoUrl),
]

const server = setupServer(...handlers)

export { rest, server }
