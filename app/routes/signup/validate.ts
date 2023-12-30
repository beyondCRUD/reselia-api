export type fields = {
  name?: string
  email?: string
  password?: string
  passwordConfirmation?: string
}

export function validate({
  name,
  email,
  password,
  passwordConfirmation,
}: fields): {
  errors: fields | null
} {
  let errors: {
    name?: string
    email?: string
    password?: string
    passwordConfirmation?: string
  } = {}

  if (!name) {
    errors.name = 'is required'
  }

  if (!email) {
    errors.email = 'is required'
  } else if (!email.includes('@')) {
    errors.email = 'is invalid'
  }

  if (!password) {
    errors.password = 'is required'
  } else if (password.length < 5) {
    errors.password = 'is too short'
  }

  if (!passwordConfirmation) {
    errors.passwordConfirmation = 'is required'
  } else if (passwordConfirmation !== password) {
    errors.passwordConfirmation = 'does not match password'
  }

  return {
    errors: Object.keys(errors).length > 0 ? errors : null,
  }
}
