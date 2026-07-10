import express from 'express'
import { getPrompts, updatePrompts, resetPrompts } from '../controllers/promptController.js'

const router = express.Router()

router.get('/', getPrompts)
router.put('/', updatePrompts)
router.post('/reset', resetPrompts)

export default router