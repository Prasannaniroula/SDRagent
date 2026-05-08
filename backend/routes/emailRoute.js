import express from 'express'
import { sendColdEmail } from '../controllers/emailController.js'

const router = express.Router()
router.post('/send', sendColdEmail)

export default router