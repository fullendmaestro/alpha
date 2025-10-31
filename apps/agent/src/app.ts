import { logger } from 'hono/logger'

import { Hono } from 'hono'

export const app = new Hono()

app.use('*', async (c, next) => {
  try {
    const contentType = c.req.header('content-type') || ''

    if (contentType.includes('application/json')) {
      const body = await c.req.json()
      console.log('Request body (json):', body)
      // attach parsed body for downstream handlers if needed
      ;(c as any).parsedBody = body
    } else {
      // attempt to read text body (works for form-encoded or plain text)
      const text = await c.req.text().catch(() => null)
      if (text) console.log('Request body (text):', text)
    }
  } catch (err) {
    console.warn('Failed to read request body for logging:', err)
  }

  return next()
})
app.get('/hello', (c) => c.json({ hello: 'world' }))
