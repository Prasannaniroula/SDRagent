import mongoose from 'mongoose'
const leadSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
    goal: String,
    subject: String,
    body: String,
    status: {
        sent: { type: Boolean, default: false },
        delivered: { type: Boolean, default: false },
        opened: { type: Boolean, default: false },
        clicked: { type: Boolean, default: false },
        replied: { type: Boolean, default: false },
        bounced: { type: Boolean, default: false },
        spam: { type: Boolean, default: false },
        unsubscribed: { type: Boolean, default: false },
        bounceType: { type: String, default: null },
        messageId: { type: String, default: null }
    },
    timestamps: {
        sent: { type: String, default: null },
        delivered: { type: String, default: null },
        opened: { type: String, default: null },
        clicked: { type: String, default: null },
        bounced: { type: String, default: null },
        spam: { type: String, default: null }
    }
}, { timestamps: true })

export default mongoose.model('Lead', leadSchema)