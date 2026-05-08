import Lead from '../models/Lead.js'
export async function getMetrics(req, res) {
    try {
        const total = await Lead.countDocuments()

        if (total === 0) {
            return res.status(200).json({ message: "No records found" })
        }

        const sent = await Lead.countDocuments({ 'status.sent': true })
        const delivered = await Lead.countDocuments({ 'status.delivered': true })
        const opened = await Lead.countDocuments({ 'status.opened': true })
        const clicked = await Lead.countDocuments({ 'status.clicked': true })
        const replied = await Lead.countDocuments({ 'status.replied': true })
        const bounced = await Lead.countDocuments({ 'status.bounced': true })
        const spam = await Lead.countDocuments({ 'status.spam': true })

        const rate = (n) => sent > 0 ? `${Math.round((n / sent) * 100 * 10) / 10}%` : '0%'

        res.status(200).json({
            total,
            sent,
            delivered,
            opened,
            clicked,
            replied,
            bounced,
            spam,
            rates: {
                deliveryRate: rate(delivered),
                openRate: rate(opened),
                clickRate: rate(clicked),
                replyRate: rate(replied),
                bounceRate: rate(bounced)
            }
        })

    } catch (error) {
        console.log("Error:", error)
        res.status(500).json({ error: error.message })
    }
}