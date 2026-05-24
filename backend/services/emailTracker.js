import Lead from '../models/Lead.js'

export async function updateEmailRecord(event) {
    const eventType = event.event
    const rawMessageId = event['message-id'] || event['MessageId']
    const messageId = rawMessageId ? rawMessageId.replace(/^<|>$/g, '') : null
    const email = event.email
    const ts = event.date || new Date().toISOString()

    console.log(`[Webhook] event=${eventType} | messageId=${messageId} | email=${email}`)

    // Skip request events
    if (eventType === 'request') return

    let lead = null

    // Try finding by messageId first (normal format)
    if (messageId && !messageId.startsWith('an#')) {
        lead = await Lead.findOne({ 'status.messageId': messageId })
    }

    // Fallback by email
    if (!lead && email) {
        lead = await Lead.findOne({
            email: email,
            'status.sent': true
        }).sort({ createdAt: -1 })
    }

    // Fallback by messageId in body (for click events)
    if (!lead && messageId && messageId.startsWith('an#')) {
        // Try to find most recently sent lead
        lead = await Lead.findOne({
            'status.sent': true,
            'status.delivered': true
        }).sort({ createdAt: -1 })
    }

    if (!lead) {
        console.log(`No record found for messageId=${messageId} email=${email}`)
        return
    }

    switch (eventType) {
        case 'delivered':
            lead.status.delivered = true
            lead.timestamps.delivered = ts
            break
        case 'opened':
        case 'unique_opened':
            lead.status.opened = true
            lead.timestamps.opened = ts
            break
        case 'click':
        case 'clicked':
            lead.status.clicked = true
            lead.timestamps.clicked = ts
            break
        case 'bounce':
        case 'hard_bounce':
        case 'soft_bounce':
        case 'hardBounce':
        case 'softBounce':
            lead.status.bounced = true
            lead.status.bounceType = eventType
            lead.timestamps.bounced = ts
            break
        case 'spam':
        case 'complaint':
            lead.status.spam = true
            lead.timestamps.spam = ts
            break
        case 'unsubscribed':
        case 'unsubscribe':
            lead.status.unsubscribed = true
            break
        default:
            console.log(`Unknown event: ${eventType}`)
    }

    await lead.save()
    console.log(`✅ Record updated | event=${eventType} | lead=${lead.email}`)
}