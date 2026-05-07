import express from 'express'
import { sendColdEmail } from '../controllers/emailcontroller.js'

const router = express.Router()
router.post('/send', sendColdEmail)

export default router