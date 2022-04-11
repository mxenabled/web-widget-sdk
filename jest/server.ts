import { rest } from "msw"
import { setupServer } from "msw/node"

type Body = {
  widget_url?: {
    widget_type?: string
  }
}

const handlers = [
  rest.post<Body>("https://api.mx.com/users/:userGuid/widget_urls", (req, res, ctx) => {
    const widget = req.body?.widget_url?.widget_type?.replace("_widget", "")

    if (!widget) {
      return res(ctx.status(400), ctx.json({ error: true }))
    }

    return res(
      ctx.status(200),
      ctx.json({
        widget_url: {
          type: `${widget}_widget`,
          url: `https://widgets.moneydesktop.com/md/${widget}/$ssotoken$`,
        },
      }),
    )
  }),

  rest.post<Body>("https://client.com/mx-sso-proxy", (req, res, ctx) => {
    const widget = req.body?.widget_url?.widget_type?.replace("_widget", "")

    if (!widget) {
      return res(ctx.status(400), ctx.json({ error: true }))
    }

    return res(
      ctx.status(200),
      ctx.json({
        widget_url: {
          type: `${widget}_widget`,
          url: `https://widgets.moneydesktop.com/md/${widget}/$ssotoken$`,
        },
      }),
    )
  }),
]

const server = setupServer(...handlers)

export { rest, server }
