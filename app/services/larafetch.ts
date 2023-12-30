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

type LarafetchOptions<R extends ResponseType> = {
  method?: string
  body?: FormData | Record<string, any>
}

export default async function larafetch<T, R extends ResponseType = 'json'>(
  path: RequestInfo,
  { ...options }: LarafetchOptions<R> = {},
  request?: Request
) {
  const { API_URL, APP_URL } = process.env

  let body = undefined,
    method = options?.method?.toLowerCase() || 'get',
    Cookie = request?.headers.get('Cookie') || null,
    token = request?.headers.get(CSRF_HEADER) || null,
    isMutation = ['post', 'put', 'patch', 'delete'].includes(method)

  method = method.toUpperCase()

  if (Cookie) {
    let user = (await authCookie.parse(Cookie)) as userEntity

    token = user['X-XSRF-TOKEN']
    Cookie = user.Cookie
  }

  if (isMutation && !Cookie) {
    let csrf = await initCsrf(),
      laraCookies = await getLaravelCookies(
        String(csrf.headers.get('set-cookie'))
      )

    token = laraCookies.XSRFToken
    Cookie = [
      `laravel_session=${laraCookies.laravelSession}`,
      `${CSRF_COOKIE}=${token}`,
    ].join(';')
  }

  let headers: any = {
    ...(token && {
      Cookie,
      [CSRF_HEADER]: token,
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
      method,
      body,
    })
  } catch (error) {
    throw error
  }
}

/**
 * Initializes the CSRF token by making a GET request to the specified API URL.
 *
 * @returns A Promise that resolves to the response of the CSRF cookie request.
 */
async function initCsrf(): Promise<Response> {
  const { API_URL } = process.env

  return await fetch(`${API_URL}/sanctum/csrf-cookie`, {
    method: 'GET',
  })
}

/**
 * Retrieves the Laravel cookies from the "Set-Cookie" header string and returns them as an object.
 *
 * @param setCookie - The "Set-Cookie" header string containing the cookies.
 * @returns A Promise that resolves to an object containing the XSRFToken and laravelSession cookies.
 */
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

/**
 * Retrieves the value of a specific cookie from a given cookie string.
 *
 * @param name - The name of the cookie to retrieve.
 * @param cookieString - The string containing the cookies.
 * @returns A Promise that resolves to the value of the cookie.
 */
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
