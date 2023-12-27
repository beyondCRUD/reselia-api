import larafetch, {
  CSRF_COOKIE,
  CSRF_HEADER,
  getLaravelCookies,
} from '~/services/larafetch'
import submitRequest from '~/services/submitRequest'

export async function login(
  formData: FormData,
  request: Request
): Promise<{
  data: {
    id: number
    name: string
    email: string
    email_verified_at: string
    created_at: string
    updated_at: string
  }
  Cookie: string
  'X-XSRF-TOKEN': string
}> {
  let loginResponse = await submitRequest(
      larafetch('/login', { method: 'post', body: formData }, request)
    ),
    Cookie = '',
    token = ''

  if (loginResponse.data instanceof Response) {
    let { headers } = loginResponse.data,
      laraCookies = await getLaravelCookies(String(headers.get('set-cookie')))

    token = laraCookies.XSRFToken
    Cookie = [
      `laravel_session=${laraCookies.laravelSession}`,
      `${CSRF_COOKIE}=${token}`,
    ].join(';')
  }

  request.headers.set('cookie', Cookie)
  request.headers.set(CSRF_HEADER, token)

  let { data } = await submitRequest(
    larafetch('/api/user', { method: 'get' }, request)
  )

  if (
    data instanceof Object &&
    'id' in data &&
    'name' in data &&
    'email' in data &&
    'email_verified_at' in data &&
    'created_at' in data &&
    'updated_at' in data
  ) {
    return {
      Cookie,
      [CSRF_HEADER]: token,
      data: {
        id: Number(data?.id),
        name: String(data?.name),
        email: String(data?.email),
        email_verified_at: String(data?.email_verified_at),
        created_at: String(data?.created_at),
        updated_at: String(data?.updated_at),
      },
    }
  }

  throw new Error("Couldn't get user data")
}
