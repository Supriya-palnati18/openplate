import api from './api'

export const createOrder = (postId) => api.post('/orders', { postId })
export const getMyOrders = () => api.get('/orders/my')
export const getChefOrders = () => api.get('/orders/chef')
export const confirmOrder = (id) => api.patch(`/orders/${id}/confirm`)
export const cancelOrder = (id) => api.patch(`/orders/${id}/cancel`)