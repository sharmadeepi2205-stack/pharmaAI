import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export async function analyzeVCF(formData) {
  const resp = await api.post('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return resp.data
}

export default api
