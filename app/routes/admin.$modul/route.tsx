import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node'
import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useParams,
} from '@remix-run/react'
import { RefObject, useEffect, useRef, useState } from 'react'
import { classNames } from '~/utils'
import { ApiResponse, Category } from '~/types'

import submitRequest from '~/services/submitRequest'
import larafetch from '~/services/larafetch'

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData(),
    intent = formData.get('intent'),
    selectedID = formData.getAll('id[]')

  if (intent === 'delete') {
    selectedID.forEach((id) => console.log(`deleting ID: ${id}`))
    // TODO: delete selected users
  }

  if (intent === 'export') {
    selectedID.forEach((id) => console.log(`exporting ID: ${id}`))
    // TODO: export selected users
  }

  return null
}

export async function loader() {
  let { data } = await submitRequest<ApiResponse<Category[]>>(
    larafetch('/api/v1/categories', { method: 'get' })
  )

  return json({ items: data.data })
}

export default function AdminUsers() {
  let { modul } = useParams(),
    title = modul
      ?.toLowerCase()
      .replace(/(?<= )[^\s]|^./g, (a) => a.toUpperCase()),
    data = useLoaderData<typeof loader>(),
    checkbox = useRef() as RefObject<HTMLInputElement>,
    [checked, setChecked] = useState(false),
    [indeterminate, setIndeterminate] = useState(false),
    [selectedItems, setSelectedItems] = useState<Category[]>([]),
    items = data.items as Category[],
    { pathname } = useLocation(),
    isMutationPage = pathname.includes('/create') || pathname.includes('/edit')

  useEffect(() => {
    let isIndeterminate =
      selectedItems.length > 0 && selectedItems.length < items.length

    setChecked(selectedItems.length === items.length)
    setIndeterminate(isIndeterminate)

    if (checkbox.current) {
      checkbox.current.indeterminate = isIndeterminate
    }
  }, [selectedItems])

  function toggleAll() {
    if (checked || indeterminate) {
      setSelectedItems([])
    } else {
      setSelectedItems(items)
    }

    setChecked(!checked && !indeterminate)
    setIndeterminate(false)
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            {title}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the {modul}.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          {!isMutationPage && (
            <Link
              to={`/admin/${modul}/create`}
              className="block rounded-md bg-indigo-600 px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create
            </Link>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Outlet />
      </div>

      <div className="mt-8 flow-root bg-white">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="relative">
              {selectedItems.length > 0 && (
                <Form method="post">
                  {selectedItems.map((item) => (
                    <input
                      key={item.id}
                      type="hidden"
                      name="id[]"
                      value={item.id}
                    />
                  ))}
                  <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-white sm:left-12">
                    <button
                      type="submit"
                      name="intent"
                      value="export"
                      className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                    >
                      Export
                    </button>
                    <button
                      type="submit"
                      name="intent"
                      value="delete"
                      className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                    >
                      Delete
                    </button>
                  </div>
                </Form>
              )}
              <table className="min-w-full table-fixed divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-3"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className={
                        selectedItems.includes(item) ? 'bg-gray-50' : undefined
                      }
                    >
                      <td className="relative px-7 sm:w-12 sm:px-6">
                        {selectedItems.includes(item) && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                        )}
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          value={item.id}
                          checked={selectedItems.some((p) => p.id === item.id)}
                          onChange={(e) => {
                            setSelectedItems(
                              e.target.checked
                                ? [...selectedItems, item]
                                : selectedItems.filter(
                                    (p) => p.id !== e.target.value
                                  )
                            )
                          }}
                        />
                      </td>
                      <td
                        className={classNames(
                          'whitespace-nowrap py-4 pl-3 text-sm font-medium',
                          selectedItems.includes(item)
                            ? 'text-indigo-600'
                            : 'text-gray-900'
                        )}
                      >
                        {item.title}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                        <Link
                          to={`/admin/${modul}/edit/${item.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit<span className="sr-only">, {item.title}</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
