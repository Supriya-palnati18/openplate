import api from './api'

export const getAllPosts = () => api.get('/posts')
export const getPostById = (id) => api.get(`/posts/${id}`)
export const createPost = (data) => api.post('/posts', data)
export const updatePost = (id, data) => api.put(`/posts/${id}`, data)
export const deletePost = (id) => api.delete(`/posts/${id}`)
export const togglePublish = (id) => api.patch(`/posts/${id}/publish`)