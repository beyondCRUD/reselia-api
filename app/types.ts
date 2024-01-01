export type Route = { name: string; href: string; current?: boolean }

export type ResponseLinks = {
  url: string | null
  label: string
  active: boolean
}

export type ResponseMeta = {
  current_page: number
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export type ApiResponse<Data> = {
  data: Data
  links: ResponseLinks[]
  meta: ResponseMeta
}

export type Category = {
  id: string
  title: string
  parent_id: any
  created_at: string
  updated_at: string
  deleted_at: string
  endpoints: {
    show: string
    update: string
    delete: string
  }
}
