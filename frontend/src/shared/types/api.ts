export type PaginatedResponse<T> = {
  data: T[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number | null
    last_page: number
    path: string
    per_page: number
    to: number | null
    total: number
  }
}

export type Category = {
  id: number
  name: string
  slug: string
  description: string | null
  products_count?: number
  created_at: string
  updated_at: string
}

export type Product = {
  id: number
  name: string
  sku: string
  description: string | null
  price: string
  quantity: number
  min_quantity: number
  is_low_stock: boolean
  category: {
    id: number
    name: string
    slug: string
  } | null
  created_at: string
  updated_at: string
}

export type StockMovement = {
  id: number
  product_id: number
  product: {
    id: number
    name: string
    sku: string
    category: {
      id: number
      name: string
      slug: string
    } | null
  } | null
  order_id: number | null
  order_number: string | null
  type: 'stock_in' | 'stock_out'
  quantity: number
  note: string | null
  created_at: string
  updated_at: string
}

export type Order = {
  id: number
  order_number: string
  status: string
  total_amount: string
  notes: string | null
  items: Array<{
    id: number
    product_id: number
    product_name: string | null
    product_sku: string | null
    category: {
      id: number
      name: string
      slug: string
    } | null
    quantity: number
    unit_price: string
    subtotal: string
  }>
  stock_movements: Array<{
    id: number
    product_id: number
    type: 'stock_in' | 'stock_out'
    quantity: number
    note: string | null
    created_at: string
  }>
  created_at: string
  updated_at: string
}
