import api from './api'

export const createProfile = (data) => api.post('/chef/profile', data)
export const getMyProfile = () => api.get('/chef/profile')
export const getChefById = (id) => api.get(`/chef/${id}`)
export const updateProfile = (data) => api.put('/chef/profile', data)