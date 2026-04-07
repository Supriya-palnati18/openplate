const express = require('express')
const router = express.Router()
const { 
  createChefProfile, 
  getMyProfile, 
  getChefById, 
  updateChefProfile 
} = require('../controllers/chefController')
const { protect } = require('../middleware/authMiddleware')

router.post('/profile', protect, createChefProfile)
router.get('/profile', protect, getMyProfile)
router.get('/:id', getChefById)
router.put('/profile', protect, updateChefProfile)

module.exports = router