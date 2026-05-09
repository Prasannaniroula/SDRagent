import express from 'express'
import { sendColdEmail, generateEmailPreview } from '../controllers/emailController.js'

const router = express.Router()
router.post('/send', sendColdEmail)
router.post('/generate', generateEmailPreview)

export default router