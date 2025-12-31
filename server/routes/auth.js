import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    async (req, res) => {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { name, email, password, role } = req.body;

            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists'
                });
            }

            // Create user
            const user = await User.create({
                name,
                email,
                password,
                role: role || 'agent' // Default to agent
            });

            // Generate token
            const token = generateToken(user._id);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                    token
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Registration failed',
                error: error.message
            });
        }
    }
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    async (req, res) => {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { email, password } = req.body;

            // Find user with password field
            const user = await User.findOne({ email }).select('+password');

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Check if user is active
            if (!user.isActive) {
                return res.status(403).json({
                    success: false,
                    message: 'Account is inactive'
                });
            }

            // Verify password
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Generate token
            const token = generateToken(user._id);

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        avatar: user.avatar
                    },
                    token
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Login failed',
                error: error.message
            });
        }
    }
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user',
            error: error.message
        });
    }
});

export default router;
