import express from 'express'
import { startBulkCampaign, getCampaignStatus, getLatestCampaign, cancelCampaign } from '../controllers/campaignController.js'

const router = express.Router()

router.post('/start', startBulkCampaign)
router.get('/latest', getLatestCampaign)
router.post('/:id/cancel' cancelCampaign)
router.get('/:id', getCampaignStatus)

export default router