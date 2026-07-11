import Campaign from '../models/Campaign.js'
import { processCampaign } from '../services/campaignProcessor.js'

export async function startBulkCampaign(req, res) {
    const { leads } = req.body

    if (!Array.isArray(leads) || leads.length === 0) {
        return res.status(400).json({ error: 'Please provide a non-empty leads array' })
    }

    const invalid = leads.filter(l => !l.name || !l.role || !l.goal || !l.email)
    if (invalid.length > 0) {
        return res.status(400).json({
            error: `${invalid.length} leads are missing required fields (name, role, goal, email)`
        })
    }

    try {
        // Only one campaign at a time keeps things simple and respects rate limits
        const active = await Campaign.findOne({ status: 'running' })
        if (active) {
            return res.status(409).json({
                error: 'A campaign is already running. Wait for it to finish first.',
                campaignId: active._id
            })
        }

        const campaign = new Campaign({
            status: 'running',
            total: leads.length,
            progress: 0,
            leads: leads.map(l => ({
                name: l.name,
                role: l.role,
                goal: l.goal,
                email: l.email,
                status: 'pending'
            }))
        })
        await campaign.save()

        // Kick off background processing — do NOT await this.
        // The response returns immediately; the server keeps sending.
        processCampaign(campaign._id)

        res.status(200).json({
            success: true,
            campaignId: campaign._id,
            total: campaign.total
        })
    } catch (error) {
        console.log('Error starting campaign:', error)
        res.status(500).json({ error: error.message })
    }
}

export async function getCampaignStatus(req, res) {
    try {
        const campaign = await Campaign.findById(req.params.id)
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' })
        }
        res.status(200).json(formatCampaign(campaign))
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Latest campaign (running or most recently finished) —
// lets the UI restore progress after the user navigates away and back
export async function getLatestCampaign(req, res) {
    try {
        const campaign = await Campaign.findOne().sort({ createdAt: -1 })
        if (!campaign) {
            return res.status(200).json(null)
        }
        res.status(200).json(formatCampaign(campaign))
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

function formatCampaign(campaign) {
    return {
        campaignId: campaign._id,
        status: campaign.status,
        total: campaign.total,
        progress: campaign.progress,
        createdAt: campaign.createdAt,
        leads: campaign.leads.map(l => ({
            name: l.name,
            email: l.email,
            role: l.role,
            status: l.status,
            error: l.error
        }))
    }
}