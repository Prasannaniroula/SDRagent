import Campaign from '../models/Campaign.js'
import Lead from '../models/Lead.js'
import { generateEmail } from './emailgenerator.js'
import { evaluateEmail } from './emailevaluator.js'
import { sendEmail } from './emailsender.js'

const DELAY_MS = 30000

// Prevents the same campaign being processed twice at once
const running = new Set()

export function processCampaign(campaignId) {
    const id = String(campaignId)
    if (running.has(id)) return
    running.add(id)

    // Fire and forget — runs in the background, independent of any HTTP request
    runCampaign(id).finally(() => running.delete(id))
}

async function runCampaign(campaignId) {
    try {
        const campaign = await Campaign.findById(campaignId)
        if (!campaign || campaign.status !== 'running') return

        console.log(`Campaign ${campaignId} started (${campaign.leads.length} leads)`)

        for (const lead of campaign.leads) {
            if (lead.status !== 'pending') continue

            try {
                const generated = await generateEmail(lead)
                const evaluated = await evaluateEmail(generated.emails)
                const emailToSend = evaluated.final_email

                const subject = "Internship inquiry - Prasanna Niroula(Frontend / Fullstack)"
                const result = await sendEmail(lead.email, lead.name, subject, emailToSend)

                if (!result.success) {
                    throw new Error(result.error || 'Email sending failed')
                }

                await new Lead({
                    name: lead.name,
                    email: lead.email,
                    role: lead.role,
                    goal: lead.goal,
                    subject,
                    body: emailToSend,
                    status: {
                        sent: true,
                        messageId: result.messageId ? result.messageId.replace(/^<|>$/g, '') : null
                    },
                    timestamps: {
                        sent: new Date().toISOString()
                    }
                }).save()

                lead.status = 'sent'
                console.log(`Campaign ${campaignId}: sent to ${lead.email}`)
            } catch (err) {
                lead.status = 'failed'
                lead.error = err.message
                console.log(`Campaign ${campaignId}: failed for ${lead.email} —`, err.message)
            }

            campaign.progress = campaign.leads.filter(l => l.status !== 'pending').length
            await campaign.save()

            const hasPending = campaign.leads.some(l => l.status === 'pending')
            if (hasPending) {
                await new Promise(resolve => setTimeout(resolve, DELAY_MS))
            }
        }

        campaign.status = 'completed'
        await campaign.save()
        console.log(`Campaign ${campaignId} completed`)
    } catch (err) {
        console.log(`Campaign ${campaignId} processing error:`, err)
    }
}

// Called once on server startup — picks up any campaign that was
// mid-flight when the server restarted (e.g. Render restarting the instance)
export async function resumeCampaigns() {
    try {
        const unfinished = await Campaign.find({ status: 'running' })
        for (const campaign of unfinished) {
            console.log('Resuming unfinished campaign:', campaign._id)
            processCampaign(campaign._id)
        }
    } catch (err) {
        console.log('Failed to resume campaigns:', err)
    }
}