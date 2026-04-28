const prisma = require('../config/prisma')

const createProfile = async (req, res) => {
  try {
    const { phone, landmark, street, city, state, country, pincode } = req.body

    if (!phone || !street || !city || !state || !country || !pincode) {
      return res.status(400).json({ message: 'Phone, street, city, state, country and pincode are required' })
    }

    const existing = await prisma.customerProfile.findUnique({
      where: { userId: req.user.id }
    })

    if (existing) {
      return res.status(400).json({ message: 'Customer profile already exists' })
    }

    const profile = await prisma.customerProfile.create({
      data: { phone, landmark, street, city, state, country, pincode, userId: req.user.id }
    })

    res.status(201).json({ message: 'Profile created successfully', profile })
  } catch (error) {
    console.error('createProfile error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getProfile = async (req, res) => {
  try {
    const profile = await prisma.customerProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } }
      }
    })

    if (!profile) {
      return res.status(404).json({ message: 'Customer profile not found' })
    }

    res.json({ profile })
  } catch (error) {
    console.error('getProfile error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { phone, landmark, street, city, state, country, pincode } = req.body

    const profile = await prisma.customerProfile.update({
      where: { userId: req.user.id },
      data: {
        ...(phone     && { phone }),
        ...(landmark  !== undefined && { landmark }),
        ...(street    && { street }),
        ...(city      && { city }),
        ...(state     && { state }),
        ...(country   && { country }),
        ...(pincode   && { pincode })
      }
    })

    res.json({ message: 'Profile updated successfully', profile })
  } catch (error) {
    console.error('updateProfile error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = { createProfile, getProfile, updateProfile }