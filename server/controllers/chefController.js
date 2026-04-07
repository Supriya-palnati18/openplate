const prisma = require('../config/prisma')

const createChefProfile = async (req, res) => {
  try {
    const { bio, location, cuisineType } = req.body

    if (!bio || !location || !cuisineType) {
      return res.status(400).json({ 
        message: 'Bio, location and cuisineType are required' 
      })
    }

    const existingProfile = await prisma.chefProfile.findUnique({
      where: { userId: req.user.id }
    })

    if (existingProfile) {
      return res.status(400).json({ 
        message: 'Chef profile already exists' 
      })
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: { role: 'CHEF' }
    })

    const profile = await prisma.chefProfile.create({
      data: {
        bio,
        location,
        cuisineType,
        userId: req.user.id
      }
    })

    res.status(201).json({
      message: 'Chef profile created successfully',
      profile
    })

  } catch (error) {
    console.error('CreateChefProfile error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}


const getMyProfile = async (req, res) => {
  try {
    const profile = await prisma.chefProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    if (!profile) {
      return res.status(404).json({ message: 'Chef profile not found' })
    }

    res.json({ profile })

  } catch (error) {
    console.error('GetMyProfile error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getChefById = async (req, res) => {
  try {
    const { id } = req.params

    const profile = await prisma.chefProfile.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    })

    if (!profile) {
      return res.status(404).json({ message: 'Chef not found' })
    }

    res.json({ profile })

  } catch (error) {
    console.error('GetChefById error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const updateChefProfile = async (req, res) => {
  try {
    const { bio, location, cuisineType } = req.body

    const profile = await prisma.chefProfile.update({
      where: { userId: req.user.id },
      data: {
        ...(bio && { bio }),
        ...(location && { location }),
        ...(cuisineType && { cuisineType })
      }
    })

    res.json({
      message: 'Profile updated successfully',
      profile
    })

  } catch (error) {
    console.error('UpdateChefProfile error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  createChefProfile,
  getMyProfile,
  getChefById,
  updateChefProfile
}