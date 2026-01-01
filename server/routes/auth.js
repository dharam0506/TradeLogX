import express from 'express'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'

const router = express.Router()

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  })
}

// Signup Route
router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid email address'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long')
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        })
      }

      const { email, password, name } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        })
      }

      // Create new user
      const user = new User({
        email,
        password,
        name: name || email.split('@')[0] // Use email prefix if name not provided
      })

      await user.save()

      // Generate token
      const token = generateToken(user._id)

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt
          },
          token
        }
      })
    } catch (error) {
      console.error('Signup error:', error)
      res.status(500).json({
        success: false,
        message: 'Server error during signup',
        error: error.message
      })
    }
  }
)

// Login Route
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid email address'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        })
      }

      const { email, password } = req.body

      // Find user by email
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        })
      }

      // Compare password
      const isPasswordValid = await user.comparePassword(password)
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        })
      }

      // Generate token
      const token = generateToken(user._id)

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt
          },
          token
        }
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({
        success: false,
        message: 'Server error during login',
        error: error.message
      })
    }
  }
)

// Get current user (protected route)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt
        }
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    })
  }
})

export default router

