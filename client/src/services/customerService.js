import api from './api'

export const createProfile = (data) => api.post('/customer/profile', data)
export const getProfile = () => api.get('/customer/profile')
export const updateProfile = (data) => api.put('/customer/profile', data)