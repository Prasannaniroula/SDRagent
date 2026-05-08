import express from 'express'
import { handleWebhook } from '../controllers/webhookController.js'

const router = express.Router()
router.post('/brevo', handleWebhook)

export default router