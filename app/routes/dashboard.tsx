import { LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { authCookie } from '~/services/auth'
import { userEntity } from './signin/login'
import { useLoaderData } from '@remix-run/react'
import Nav from '~/components/nav'

export async function loader({ request }: LoaderFunctionArgs) {
  let cookieString = request.headers.get('Cookie'),
    userEntityData = (await authCookie.parse(cookieString)) as userEntity

  if (!userEntityData) {
    return redirect('/signin')
  }

  return json({ user: userEntityData })
}

export default function Dashboard() {
  let { user } = useLoaderData<typeof loader>()

  return (
    <>
      <Nav userEntity={user} />

      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold leading-6 text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {/* Your content */}
        </div>
      </main>
    </>
  )
}
