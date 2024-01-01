type ValidationErrors = Record<string, string[]>

/**
 * Submits a request and handles the response.
 *
 * @param fetchable - A promise that represents the request to be made.
 * @param onSuccess - Optional callback function to be called on successful response.
 * @param onValidationError - Optional callback function to be called when there are validation errors in the response.
 * @returns A promise that resolves to an object containing the response data and any validation errors.
 */
export default async function submitRequest<T>(
  fetchable: Promise<T>,
  onSuccess?: (data?: T | Response) => any,
  onValidationError?: (errors: ValidationErrors) => any
): Promise<{
  data: T
  errors: ValidationErrors | null
}> {
  try {
    let response = (await fetchable) as Response,
      { status, statusText } = response,
      data = null,
      errors = null

    if (status === 500) {
      throw new Error(await response.json())
    }

    if (status === 401) {
      throw new Error(statusText)
    }

    if (status === 422) {
      let json = await response.json()

      data = null
      errors = json.errors

      await onValidationError?.(errors)
    }

    if (status === 200) {
      data = await response.json()
    }

    if (status === 204) {
      data = response
    }

    await onSuccess?.(response)

    return { data, errors }
  } catch (error) {
    throw error
  }
}
