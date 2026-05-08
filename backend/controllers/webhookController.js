import { updateEmailRecord } from '../services/emailTracker.js'

export async function handleWebhook(req, res) {
    let events = req.body

    if (!events) {
        return res.status(200).json({ status: "no events" })
    }

    if (!Array.isArray(events)) {
        events = [events]
    }

    for (const event of events) {
        await updateEmailRecord(event)
    }

    return res.status(200).json({ 
        status: "ok", 
        processed: events.length 
    })
}