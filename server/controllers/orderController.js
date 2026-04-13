const prisma = require('../config/prisma')

const createOrder = async (req, res) => {
  try {
    const { postId } = req.body

    if (!postId) {
      return res.status(400).json({ message: 'postId is required' })
    }

    const post = await prisma.processPost.findUnique({
      where: { id: parseInt(postId) }
    })

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    if (!post.isPublished) {
      return res.status(400).json({ message: 'This post is not available for ordering' })
    }

    if (post.authorId === req.user.id) {
      return res.status(400).json({ message: 'You cannot order your own post' })
    }

    const order = await prisma.order.create({
      data: {
        customerId: req.user.id,
        postId: parseInt(postId),
        amount: post.price
    },
      include: {
        post: {
          select: { title: true, description: true }
        }
      }
    })

    res.status(201).json({
      message: 'Order placed successfully',
      order
    })

  } catch (error) {
    console.error('CreateOrder error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: req.user.id },
      include: {
        post: {
          select: { title: true, description: true, imageUrl: true }
        },
        liveSession: {
          select: { id: true, status: true, startedAt: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ orders, count: orders.length })

  } catch (error) {
    console.error('GetMyOrders error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getChefOrders = async (req, res) => {
  try {
    const chefProfile = await prisma.chefProfile.findUnique({
      where: { userId: req.user.id }
    })

    if (!chefProfile) {
      return res.status(403).json({ message: 'Chef profile not found' })
    }

    const orders = await prisma.order.findMany({
      where: {
        post: { chefId: chefProfile.id }
      },
      include: {
        post: {
          select: { title: true, isLive: true }
        },
        customer: {
          select: { id: true, name: true, email: true }
        },
        liveSession: {
          select: { id: true, status: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ orders, count: orders.length })

  } catch (error) {
    console.error('GetChefOrders error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const confirmOrder = async (req, res) => {
  try {
    const { id } = req.params

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        post: { select: { chefId: true, isLive: true } }
      }
    })

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    const chefProfile = await prisma.chefProfile.findUnique({
      where: { userId: req.user.id }
    })

    if (!chefProfile || order.post.chefId !== chefProfile.id) {
      return res.status(403).json({ message: 'Not authorized to confirm this order' })
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({ message: `Order is already ${order.status}` })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status: 'CONFIRMED' }
    })

    if (order.post.isLive) {
      const liveSession = await prisma.liveSession.create({
        data: {
          orderId: parseInt(id),
          status: 'SCHEDULED'
        }
      })
      return res.json({
        message: 'Order confirmed. Live session scheduled.',
        order: updatedOrder,
        liveSession
      })
    }

    res.json({
      message: 'Order confirmed.',
      order: updatedOrder
    })

  } catch (error) {
    console.error('ConfirmOrder error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        post: { select: { chefId: true } }
      }
    })

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    const isCustomer = order.customerId === req.user.id

    const chefProfile = await prisma.chefProfile.findUnique({
      where: { userId: req.user.id }
    })

    const isChef = chefProfile && order.post.chefId === chefProfile.id

    if (!isCustomer && !isChef) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' })
    }

    if (order.status === 'COMPLETED' || order.status === 'CANCELLED') {
      return res.status(400).json({ message: `Order is already ${order.status}` })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status: 'CANCELLED' }
    })

    res.json({
      message: 'Order cancelled',
      order: updatedOrder
    })

  } catch (error) {
    console.error('CancelOrder error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getChefOrders,
  confirmOrder,
  cancelOrder
}