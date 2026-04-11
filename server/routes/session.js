const express = require('express')
const router = express.Router()
const {
  getSession,
  startSession,
  endSession
} = require('../controllers/sessionController')
const { protect } = require('../middleware/authMiddleware')

router.get('/:id', protect, getSession)
router.patch('/:id/start', protect, startSession)
router.patch('/:id/end', protect, endSession)

module.exports = router