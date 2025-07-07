import { AuthRoutes } from '@/libs/api/routes/auth-routes'
import { useAuthStore } from '@/store/useAuthStore'
import axios from 'axios'
import { API_BASE_URL, TENANT_ID } from '../env'

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

const refreshToken = async () => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject })
    })
  }

  isRefreshing = true
  const { setToken, refreshToken, user, setRefreshToken, signOut } = useAuthStore.getState()

  if (!refreshToken) {
    signOut()
    return Promise.reject(new Error('No refresh token available'))
  }

  try {
    const response = await API_CLIENT.post(AuthRoutes.auth.refresh, {
      refreshToken: refreshToken,
      userId: user?.id || user?.userId || 0,
    })
    const { access_token, refresh_token } = response.data
    setToken(access_token)
    setRefreshToken(refresh_token)
    processQueue(null, access_token)
    return access_token
  } catch (error) {
    processQueue(error, null)
    signOut()
    throw error
  } finally {
    isRefreshing = false
  }
}

const API_CLIENT = axios.create({
  baseURL: API_BASE_URL || 'https://nestjs-expo-lms.up.railway.app',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-tenant-id': TENANT_ID || 'CHESS',
  },
})

API_CLIENT.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

API_CLIENT.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle network errors
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.error('Network error:', error)
      return Promise.reject(new Error('Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng.'))
    }

    // Handle CORS errors
    if (error.message?.includes('CORS') || error.response?.status === 0) {
      console.error('CORS error:', error)
      return Promise.reject(new Error('Lỗi CORS. Vui lòng liên hệ admin để cấu hình server.'))
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const newToken = await refreshToken()
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return API_CLIENT(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default API_CLIENT
