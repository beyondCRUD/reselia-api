export type ValidationErrors = Record<string, string[]>

export default async function submitRequest<T>(
  fetchable: Promise<T>,
  onSuccess?: (data?: T) => any,
  onValidationError?: (errors: ValidationErrors) => any
): Promise<{ data: T | object | null; errors: ValidationErrors | null }> {
  try {
    const data = await fetchable

    if (data instanceof Response && data.status === 422) {
      const { errors } = await data.json()
      await onValidationError?.(errors)

      return { data: null, errors }
    }

    if (data instanceof Response && data.status === 500) {
      const response = await data.json()

      throw new Error(response.message)
    }

    if (data instanceof Response && data.status === 200) {
      const response = await data.json()

      return { data: response, errors: null }
    }

    await onSuccess?.(data)

    return { data, errors: null }
  } catch (error) {
    if (error instanceof Response) {
      const { errors } = await error.json()
      await onValidationError?.(errors)

      return { data: null, errors }
    }

    throw error
  }
}
