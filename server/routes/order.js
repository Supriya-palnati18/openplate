const express = require('express')
const router = express.Router()
const {
  createOrder,
  getMyOrders,
  getChefOrders,
  confirmOrder,
  cancelOrder
} = require('../controllers/orderController')
const { protect, restrictTo } = require('../middleware/authMiddleware')

router.post('/', protect, restrictTo('CUSTOMER'), createOrder)
router.get('/my', protect, getMyOrders)
router.get('/chef', protect, restrictTo('CHEF'), getChefOrders)
router.patch('/:id/confirm', protect, restrictTo('CHEF'), confirmOrder)
router.patch('/:id/cancel', protect, cancelOrder)

module.exports = router