import Lead from '../models/Lead.js'

export async function updateEmailRecord(event) {
    const eventType = event.event
    const rawMessageId = event['message-id'] || event['MessageId']
    const messageId = rawMessageId ? rawMessageId.replace(/^<|>$/g, '') : null
    const ts = event.date || new Date().toISOString()

    console.log(`[Webhook] event=${eventType} | messageId=${messageId}`)

    const lead = await Lead.findOne({ 'status.messageId': messageId })

    if (!lead) {
        console.log(`No record found for messageId=${messageId}`)
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
            lead.status.clicked = true
            lead.timestamps.clicked = ts
            break
        case 'bounce':
        case 'hard_bounce':
        case 'soft_bounce':
            lead.status.bounced = true
            lead.status.bounceType = eventType
            lead.timestamps.bounced = ts
            break
        case 'spam':
            lead.status.spam = true
            lead.timestamps.spam = ts
            break
        case 'unsubscribed':
            lead.status.unsubscribed = true
            break
    }

    await lead.save()
    console.log(`Record updated for messageId=${messageId}`)
}