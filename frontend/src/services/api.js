import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({ baseURL: `${API_BASE_URL}/api` })

export async function analyzeVCF(formData) {
  const resp = await api.post('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return resp.data
}

export default api
