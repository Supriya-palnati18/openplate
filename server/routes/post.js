const express = require('express')
const router = express.Router()
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  togglePublish
} = require('../controllers/postController')
const { protect, restrictTo } = require('../middleware/authMiddleware')

router.get('/', getAllPosts)
router.get('/:id', getPostById)
router.post('/', protect, restrictTo('CHEF'), createPost)
router.put('/:id', protect, restrictTo('CHEF'), updatePost)
router.delete('/:id', protect, restrictTo('CHEF'), deletePost)
router.patch('/:id/publish', protect, restrictTo('CHEF'), togglePublish)

module.exports = router