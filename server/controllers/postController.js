const prisma = require('../config/prisma')

const createPost = async (req, res) => {
  try {
    const { title, description, ingredients, steps, imageUrl } = req.body

    if (!title || !description || !ingredients || !steps) {
      return res.status(400).json({
        message: 'Title, description, ingredients and steps are required'
      })
    }

    const chefProfile = await prisma.chefProfile.findUnique({
      where: { userId: req.user.id }
    })

    if (!chefProfile) {
      return res.status(403).json({
        message: 'You must have a chef profile to create posts'
      })
    }

    const post = await prisma.processPost.create({
      data: {
        title,
        description,
        ingredients,
        steps,
        imageUrl: imageUrl || null,
        authorId: req.user.id,
        chefId: chefProfile.id
      }
    })

    res.status(201).json({
      message: 'Post created successfully',
      post
    })

  } catch (error) {
    console.error('CreatePost error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.processPost.findMany({
      where: { isPublished: true },
      include: {
        author: {
          select: { id: true, name: true }
        },
        chef: {
          select: { id: true, location: true, cuisineType: true, trustScore: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ posts, count: posts.length })

  } catch (error) {
    console.error('GetAllPosts error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getPostById = async (req, res) => {
  try {
    const { id } = req.params

    const post = await prisma.processPost.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: {
          select: { id: true, name: true }
        },
        chef: {
          select: { 
            id: true, 
            bio: true,
            location: true, 
            cuisineType: true, 
            trustScore: true,
            isVerified: true
          }
        }
      }
    })

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    res.json({ post })

  } catch (error) {
    console.error('GetPostById error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const updatePost = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, ingredients, steps, imageUrl } = req.body

    const post = await prisma.processPost.findUnique({
      where: { id: parseInt(id) }
    })

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    if (post.authorId !== req.user.id) {
      return res.status(403).json({ 
        message: 'You can only update your own posts' 
      })
    }

    const updatedPost = await prisma.processPost.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(ingredients && { ingredients }),
        ...(steps && { steps }),
        ...(imageUrl && { imageUrl })
      }
    })

    res.json({
      message: 'Post updated successfully',
      post: updatedPost
    })

  } catch (error) {
    console.error('UpdatePost error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const deletePost = async (req, res) => {
  try {
    const { id } = req.params

    const post = await prisma.processPost.findUnique({
      where: { id: parseInt(id) }
    })

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    if (post.authorId !== req.user.id) {
      return res.status(403).json({ 
        message: 'You can only delete your own posts' 
      })
    }

    await prisma.processPost.delete({
      where: { id: parseInt(id) }
    })

    res.json({ message: 'Post deleted successfully' })

  } catch (error) {
    console.error('DeletePost error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const togglePublish = async (req, res) => {
  try {
    const { id } = req.params

    const post = await prisma.processPost.findUnique({
      where: { id: parseInt(id) }
    })

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    if (post.authorId !== req.user.id) {
      return res.status(403).json({ 
        message: 'You can only publish your own posts' 
      })
    }

    const updatedPost = await prisma.processPost.update({
      where: { id: parseInt(id) },
      data: { isPublished: !post.isPublished }
    })

    res.json({
      message: updatedPost.isPublished ? 'Post published' : 'Post unpublished',
      post: updatedPost
    })

  } catch (error) {
    console.error('TogglePublish error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  togglePublish
}