import Lead from '../models/Lead.js'

export async function updateEmailRecord(event) {
    const eventType = event.event
    const rawMessageId = event['message-id'] || event['MessageId']
    const messageId = rawMessageId ? rawMessageId.replace(/^<|>$/g, '') : null
    const email = event.email
    const ts = event.date || new Date().toISOString()

    console.log(`[Webhook] event=${eventType} | messageId=${messageId} | email=${email}`)

    // For unique_opened and click events use email to find lead
    let lead = null

    if (messageId && !messageId.startsWith('an#')) {
        lead = await Lead.findOne({ 'status.messageId': messageId })
    }

    // Fallback — search by email if messageId not found
    if (!lead && email) {
        lead = await Lead.findOne({ 
            email: email,
            'status.sent': true 
        }).sort({ createdAt: -1 })
    }

    if (!lead) {
        console.log(`No record found for messageId=${messageId} email=${email}`)
        return
    }

    switch (eventType) {
        case 'request':
            break
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
    console.log(`Record updated for messageId=${messageId} event=${eventType}`)
}