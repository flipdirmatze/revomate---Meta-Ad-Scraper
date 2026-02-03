import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 300000, // 5 minutes for long-running operations
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Ein Fehler ist aufgetreten'
    return Promise.reject(new Error(message))
  }
)

export const scrapeAds = async (searchUrl, maxResults, apifyToken) => {
  const response = await api.post('/scrape', {
    searchUrl,
    maxResults,
    apifyToken,
  })
  return response.data
}

export const analyzeVideo = async (videoUrl, geminiKey) => {
  const response = await api.post('/analyze', {
    videoUrl,
    geminiKey,
  })
  return response.data
}

export default api
