import { ActionFunctionArgs, redirect } from '@remix-run/node'
import {
  Form,
  Link,
  useActionData,
  useFetcher,
  useFormAction,
  useNavigate,
  useNavigation,
  useParams,
} from '@remix-run/react'
import larafetch from '~/services/larafetch'
import submitRequest from '~/services/submitRequest'

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData(),
    modul = String(formData.get('modul')),
    storing = await submitRequest(
      larafetch(
        '/api/v1/categories',
        { method: 'post', body: formData },
        request
      )
    )

  if (storing.errors) {
    return { errors: storing.errors }
  }

  return redirect(`/admin/${modul}`)
}

export default function AdminUserCreate() {
  let { modul } = useParams(),
    actionData = useActionData<typeof action>(),
    titleError = actionData?.errors?.title,
    { state } = useNavigation(),
    isLoading = state === 'submitting',
    navigate = useNavigate()

  if (isLoading) {
    titleError = undefined
  }

  return (
    <Form method="post">
      <input type="hidden" name="modul" value={modul} />
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Title
              </label>
              <div className="mt-2">
                <input
                  autoFocus
                  type="text"
                  name="title"
                  id="title"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {Array.isArray(titleError) && (
                  <ol className="mt-2 ml-4 text-sm text-red-500 list-decimal">
                    {titleError.map((error, i) => (
                      <li key={`error-email-${i}`}>{error}</li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
        <button
          disabled={isLoading}
          type="submit"
          className="rounded-md disabled:bg-indigo-200 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </Form>
  )
}
