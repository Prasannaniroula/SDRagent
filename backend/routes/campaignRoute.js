import express from 'express'
import { startBulkCampaign, getCampaignStatus, getLatestCampaign } from '../controllers/campaignController.js'

const router = express.Router()

router.post('/start', startBulkCampaign)
router.get('/latest', getLatestCampaign)
router.get('/:id', getCampaignStatus)

export default router