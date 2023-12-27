import { FetchOptions } from 'ofetch'
import { authCookie } from './auth'
import { userEntity } from '~/routes/signin/login'

export const CSRF_COOKIE = 'XSRF-TOKEN',
  CSRF_HEADER = 'X-XSRF-TOKEN'

interface ResponseMap {
  blob: Blob
  text: string
  arrayBuffer: ArrayBuffer
}

type ResponseType = keyof ResponseMap | 'json'

type LarafetchOptions<R extends ResponseType> = FetchOptions<R> & {
  redirectIfNotAuthenticated?: boolean
  redirectIfNotVerified?: boolean
}

export default async function larafetch<T, R extends ResponseType = 'json'>(
  path: RequestInfo,
  {
    redirectIfNotAuthenticated = true,
    redirectIfNotVerified = true,
    ...options
  }: LarafetchOptions<R> = {},
  request?: Request
) {
  const { API_URL, APP_URL } = process.env

  let body = undefined,
    method = options?.method?.toLowerCase() || 'get',
    cookie = request?.headers.get('Cookie') || null,
    isMutation = ['post', 'put', 'patch', 'delete'].includes(method),
    token

  if (!cookie && isMutation) {
    let csrf = await initCsrf(),
      laraCookies = await getLaravelCookies(
        String(csrf.headers.get('set-cookie'))
      )

    token = laraCookies.XSRFToken
    cookie = [
      `laravel_session=${laraCookies.laravelSession}`,
      `${CSRF_COOKIE}=${token}`,
    ].join(';')
  } else if (cookie && isMutation) {
    let user = (await authCookie.parse(cookie)) as userEntity

    token = user['X-XSRF-TOKEN']
    cookie = user.Cookie
  }

  let headers: any = {
    ...(token && {
      [CSRF_HEADER]: token,
      Cookie: cookie,
    }),
    accept: 'application/json',
    Referer: APP_URL,
  }

  if (options?.body instanceof FormData) {
    headers = {
      ...headers,
      'Content-Type': 'application/json',
    }
    body = JSON.stringify(Object.fromEntries(options?.body))
  }

  try {
    return await fetch(`${API_URL}${path}`, {
      headers,
      method: method.toUpperCase(),
      body,
    })
  } catch (error) {
    throw error
  }
}

async function initCsrf(): Promise<Response> {
  const { API_URL } = process.env

  return await fetch(`${API_URL}/sanctum/csrf-cookie`, {
    method: 'GET',
  })
}

export async function getLaravelCookies(setCookie: string): Promise<{
  XSRFToken: string
  laravelSession: string
}> {
  let XSRFToken = '',
    laravelSession = '',
    cookies = setCookie.split(',')

  for (let index = 0; index < cookies.length; index++) {
    const cookie = cookies[index]
    if (cookie.includes(CSRF_COOKIE)) {
      XSRFToken = await getCookie(CSRF_COOKIE, cookie)
    }
    if (cookie.includes('laravel_session')) {
      laravelSession = await getCookie('laravel_session', cookie.split(';')[0])
    }
  }

  return {
    XSRFToken,
    laravelSession,
  }
}

export async function getCookie(
  name: string,
  cookieString: string
): Promise<string> {
  if (name === 'laravel_session') {
    return decodeURIComponent(cookieString.split('=')[1])
  }

  let match = cookieString.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))

  return match ? decodeURIComponent(match[3]) : ''
}

// export async function getCookieLaravelSession(
//   cookieString: string
// ): Promise<string> {
//   let match = cookieString.match(
//     new RegExp('(^|;\\s*)(laravel_session)=([^;]*)')
//   )

//   return match ? decodeURIComponent(match[3]) : ''
// }
