const express = require('express')
const router = express.Router()
const { createProfile, getProfile, updateProfile } = require('../controllers/customerController')
const { protect } = require('../middleware/authMiddleware')

router.post('/profile', protect, createProfile)
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)

module.exports = router