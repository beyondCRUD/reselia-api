import { Form, Link, useActionData } from '@remix-run/react'
import { ActionFunctionArgs } from 'react-router'
import logoAssetUrl from '~/assets/logo.svg'
import { validate } from './validate'
import submitRequest from '~/services/submitRequest'
import larafetch from '~/services/larafetch'

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData(),
    name = String(formData.get('name')),
    email = String(formData.get('email')),
    password = String(formData.get('password')),
    passwordConfirmation = String(formData.get('password_confirmation')),
    { errors } = validate({ name, email, password, passwordConfirmation })

  if (errors) {
    return { errors }
  }

  let response = await submitRequest(
    larafetch('/register', { method: 'post', body: formData }, request),
    (data) => {
      console.log(data)
      // TODO: Redirect to dashboard
    },
    (errors) => {
      return errors
    }
  )

  return response
}

export default function SignUp() {
  let actionData = useActionData<typeof action>(),
    nameError = actionData?.errors?.name,
    emailError = actionData?.errors?.email,
    passwordError = actionData?.errors?.password,
    passwordConfirmationError = actionData?.errors?.passwordConfirmation

  console.log(actionData)

  return (
    <>
      <div className="flex flex-col justify-center flex-1 min-h-full px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="w-auto h-10 mx-auto"
            src={logoAssetUrl}
            alt="Stock SaaS"
          />
          <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-center text-gray-900">
            Sign up for an account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form className="space-y-6" method="post">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Full name{' '}
                {nameError && (
                  <span className="text-red-500" aria-live="polite">
                    {nameError}
                  </span>
                )}
              </label>
              <div className="mt-2">
                <input
                  autoFocus
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address{' '}
                {emailError && !Array.isArray(emailError) && (
                  <span className="text-red-500" aria-live="polite">
                    {emailError}
                  </span>
                )}
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {Array.isArray(emailError) && (
                <ol className="mt-2 ml-4 text-sm text-red-500 list-decimal">
                  {emailError.map((error, i) => (
                    <li key={`error-email-${i}`}>{error}</li>
                  ))}
                </ol>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password{' '}
                  {passwordError && !Array.isArray(passwordError) && (
                    <span className="text-red-500" aria-live="polite">
                      {passwordError}
                    </span>
                  )}
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {Array.isArray(passwordError) && (
                <ol className="mt-2 ml-4 text-sm text-red-500 list-decimal">
                  {passwordError.map((error, i) => (
                    <li key={`error-password-${i}`}>{error}</li>
                  ))}
                </ol>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password-confirmation"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password confirmation{' '}
                  {passwordConfirmationError && (
                    <span className="text-red-500" aria-live="polite">
                      {passwordConfirmationError}
                    </span>
                  )}
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password-confirmation"
                  name="password_confirmation"
                  type="password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
            </div>
          </Form>

          <p className="mt-10 text-sm text-center text-gray-500">
            Already have an account?{' '}
            <Link
              to="/"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
