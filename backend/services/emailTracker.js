import dotenv from 'dotenv'

dotenv.config()

export async function updateEmailRecord(event) {
    const eventType = event.event
    const messageId = event['message-id'] || event['MessageId']
    const ts = event.date || new Date().toISOString()

    console.log(`[Webhook] event=${eventType} | messageId=${messageId}`)
    switch (eventType) {
        case 'delivered':
            console.log(`Email delivered to ${messageId}`)
            break
        case 'opened':
        case 'unique_opened':
            console.log(`Email opened by ${messageId}`)
            break
        case 'click':
            console.log(`Email clicked by ${messageId}`)
            break
        case 'bounce':
        case 'hard_bounce':
        case 'soft_bounce':
            console.log(`Email bounced for ${messageId}`)
            break
        case 'spam':
            console.log(`Email marked as spam by ${messageId}`)
            break
        case 'unsubscribe':
            console.log(`Email unsubscribed by ${messageId}`)
            break
        default:
            console.log(`Unknown event: ${eventType}`)
    }
}