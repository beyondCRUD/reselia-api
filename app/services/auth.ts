import { createCookie } from '@remix-run/node'

let secret = process.env.COOKIE_SECRET || 'default'

if (secret === 'default') {
  console.warn('🚨 No COOKIE_SECRET set, the app is insecure')
  secret = 'default-secret'
}

export let authCookie = createCookie('auth', {
  httpOnly: true,
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 30, // 30 days
  secrets: [secret],
})
