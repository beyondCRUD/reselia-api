import { Route } from './types'

const adminRoute = { name: 'Admin', href: '/admin' },
  categoryRoute = { name: 'Categories', href: '/admin/categories' }

export const breadcrumbs: {
  [key: string]: Route[]
} = {
  '/admin': [adminRoute],
  '/admin/profile': [adminRoute, { name: 'Profile', href: '/profile' }],
  '/admin/categories': [adminRoute, categoryRoute],
  '/admin/categories/create': [
    adminRoute,
    categoryRoute,
    { name: 'Create', href: '/admin/categories/create' },
  ],
  '/admin/categories/edit': [
    adminRoute,
    categoryRoute,
    { name: 'Edit', href: '/admin/edit/01hk1t4wxa81546f5emhy72mgt' },
  ],
}

export const navigation: Route[] = [categoryRoute]

export const userNavigation: {
  name: string
  href: string
  isLogout?: boolean
}[] = [
  { name: 'Your Profile', href: '/admin/profile' },
  { name: 'Sign out', href: '/logout', isLogout: true },
]

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
