import { LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import Nav from '~/components/nav'
import Breadcrumbs from '~/components/breadcrumbs'
import { authCookie } from '~/services/auth'
import { userEntity } from '../signin/login'

export async function loader({ request }: LoaderFunctionArgs) {
  let cookieString = request.headers.get('Cookie'),
    userEntityData = (await authCookie.parse(cookieString)) as userEntity

  if (!userEntityData) {
    return redirect('/signin')
  }

  return json({ user: userEntityData })
}

export default function AppAdmin() {
  let { user } = useLoaderData<typeof loader>()

  return (
    <div className="min-h-full">
      <Nav userEntity={user} />
      <Breadcrumbs />

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
