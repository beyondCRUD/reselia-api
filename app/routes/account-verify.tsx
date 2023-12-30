import type { MetaFunction } from '@remix-run/node'
import { Form, Link } from '@remix-run/react'
import logoAssetUrl from '~/assets/logo.svg'

export const meta: MetaFunction = () => {
  return [{ title: 'Account Verify - Stock SaaS' }]
}

export default function AccountVerify() {
  return (
    <>
      <div className="flex flex-col justify-center flex-1 min-h-full px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="w-auto h-10 mx-auto"
            src={logoAssetUrl}
            alt="Stock SaaS"
          />
          <h1 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-center text-gray-900">
            Account Inactive
          </h1>
        </div>

        <div className="text-center">
          <p className="mt-1 text-sm text-gray-500">
            Your account is inactive. Please check your email for a verification
            link.
          </p>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center mt-4">
          <form action="/logout" method="post">
            <button
              type="submit"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
