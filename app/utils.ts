export const navigation: {
  name: string
  href: string
}[] = [
  { name: 'Admin', href: '/admin' },
  { name: 'Users', href: '/admin/users' },
]

export const userNavigation: {
  name: string
  href: string
  isLogout?: boolean
}[] = [
  { name: 'Your Profile', href: '#' },
  { name: 'Sign out', href: '/logout', isLogout: true },
]

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
