import api from './api'

export const getSession = (id) => api.get(`/sessions/${id}`)
export const startSession = (id) => api.patch(`/sessions/${id}/start`)
export const endSession = (id) => api.patch(`/sessions/${id}/end`)