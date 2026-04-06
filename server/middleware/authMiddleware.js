const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
  try {
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({ 
        message: 'Not authorized, no token' 
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded

    next()

  } catch (error) {
    return res.status(401).json({ 
      message: 'Not authorized, token invalid' 
    })
  }
}

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${roles.join(' or ')}` 
      })
    }
    next()
  }
}

module.exports = { protect, restrictTo }