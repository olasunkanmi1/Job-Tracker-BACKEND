import express from 'express'
import { register, login, update } from '../controllers/authController.js'

const router = express.Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/updateUser').patch(update)

export default router