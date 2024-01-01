import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import Nav from '~/components/nav'
import Breadcrumbs from '~/components/breadcrumbs'
import { requireAuthCookie } from '~/services/auth'

export async function loader({ request }: LoaderFunctionArgs) {
  let user = await requireAuthCookie(request)

  return json({ user })
}

export default function AppAdmin() {
  let { user } = useLoaderData<typeof loader>()

  return (
    <div className="min-h-full">
      <Nav userEntity={user} />

      <Breadcrumbs />

      <main className="bg-white">
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <Outlet context={user} />
        </div>
      </main>
    </div>
  )
}
