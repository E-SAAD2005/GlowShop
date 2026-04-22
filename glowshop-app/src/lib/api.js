const API_URL = 'http://localhost:8000/api/v1'

export async function fetchProducts(params = {}) {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null)
  )
  const query = new URLSearchParams(filteredParams).toString()
  const res = await fetch(`${API_URL}/products?${query}`, {
    headers: {
      'Accept': 'application/json'
    }
  })
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export async function fetchProduct(slug) {
  const res = await fetch(`${API_URL}/products/${slug}`, {
    headers: {
      'Accept': 'application/json'
    }
  })
  if (!res.ok) throw new Error('Failed to fetch product')
  return res.json()
}

export async function createProduct(formData) {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to create product')
  }
  return res.json()
}

export async function updateProduct(id, formData) {
  // Laravel often requires _method=PUT for multipart/form-data updates via POST
  formData.append('_method', 'PUT')
  
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to update product')
  }
  return res.json()
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    }
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to delete product')
  }
  return true
}

export async function fetchAdminStats(token) {
  const res = await fetch(`${API_URL}/admin/stats`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  if (!res.ok) throw new Error('Failed to fetch admin stats')
  return res.json()
}

export async function fetchOrders() {
  // Assuming there's a GET /v1/admin/orders or similar
  const res = await fetch(`${API_URL}/orders`, {
    headers: {
      'Accept': 'application/json'
    }
  })
  if (!res.ok) throw new Error('Failed to fetch orders')
  return res.json()
}

export async function updateOrderStatus(id, status) {
  const res = await fetch(`${API_URL}/orders/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ status })
  })
  if (!res.ok) throw new Error('Failed to update order status')
  return res.json()
}
