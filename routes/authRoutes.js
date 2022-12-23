import express from 'express'
import { register, login, update, getCurrentUser, logout } from '../controllers/authController.js'
import authenticateUser from '../middleware/auth.js'
import rateLimiter from 'express-rate-limit';

const router = express.Router()

// 10 max request in 15 minutes
const apiLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

router.route('/register').post(apiLimiter, register)
router.route('/login').post(apiLimiter, login)
router.route('/updateUser').patch(authenticateUser, update)
router.route('/getCurrentUser').get(authenticateUser, getCurrentUser)
router.get('/logout', logout);

export default router