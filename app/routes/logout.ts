import { ActionFunctionArgs, redirect } from '@remix-run/node'
import { authCookie } from '~/services/auth'
import larafetch from '~/services/larafetch'
import submitRequest from '~/services/submitRequest'

export async function action({ request }: ActionFunctionArgs) {
  let cookieString = request.headers.get('Cookie'),
    user = await authCookie.parse(cookieString)

  await submitRequest(larafetch('/logout', { method: 'post' }, request))

  return redirect('/signin', {
    headers: {
      'Set-Cookie': await authCookie.serialize('', {
        maxAge: 0,
      }),
    },
  })
}
