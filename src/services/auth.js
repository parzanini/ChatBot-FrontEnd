const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const LOGIN_URL = `${API_BASE_URL}/api/login`

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser() {
  const serializedUser = localStorage.getItem(USER_KEY)

  if (!serializedUser) {
    return null
  }

  try {
    return JSON.parse(serializedUser)
  } catch {
    clearAuth()
    return null
  }
}

export function isAuthenticated() {
  return Boolean(getStoredToken() && getStoredUser())
}

export function isAdmin() {
  const user = getStoredUser()
  return user?.role === 'ADMIN'
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export async function loginAdmin(email, password) {
  let response

  try {
    response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
  } catch {
    throw new Error('Unable to reach login server. Check API URL or CORS/proxy settings.')
  }

  let payload

  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    const message = 'Invalid email or password.'
    throw new Error(message)
  }

  if (!payload?.success || !payload?.token || !payload?.user) {
    throw new Error('Invalid login response from server.')
  }

  if (payload.user.role !== 'ADMIN') {
    clearAuth()
    throw new Error('Only admin users can access this application.')
  }

  localStorage.setItem(TOKEN_KEY, payload.token)
  localStorage.setItem(USER_KEY, JSON.stringify(payload.user))

  return payload.user
}
