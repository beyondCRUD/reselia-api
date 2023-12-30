import { authCookie } from '~/services/auth'
import larafetch, {
  CSRF_COOKIE,
  CSRF_HEADER,
  getLaravelCookies,
} from '~/services/larafetch'
import submitRequest from '~/services/submitRequest'

export type userData = {
  id: number
  name: string
  email: string
  email_verified_at: string
  created_at: string
  updated_at: string
  imageUrl: string
}

export type userEntity = {
  data: userData
  Cookie: string
  'X-XSRF-TOKEN': string
}

export async function login(
  formData: FormData,
  request: Request
): Promise<userEntity> {
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

  request.headers.set(
    'Cookie',
    await authCookie.serialize({
      Cookie,
      [CSRF_HEADER]: token,
    })
  )

  let { data, errors } = (await submitRequest(
    larafetch('/api/user', { method: 'get' }, request)
  )) as { data: userEntity['data']; errors: any | null }

  if (errors) {
    throw new Error("Couldn't get user data")
  }

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
      imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  }
}
