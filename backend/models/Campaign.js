import mongoose from 'mongoose'

const campaignSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['running', 'completed','cancelled'],
        default: 'running'
    },
    total: { type: Number, default: 0 },
    progress: { type: Number, default: 0 },
    leads: [{
        name: String,
        role: String,
        goal: String,
        email: String,
        status: {
            type: String,
            enum: ['pending', 'sent', 'failed'],
            default: 'pending'
        },
        error: { type: String, default: null }
    }]
}, { timestamps: true })

export default mongoose.model('Campaign', campaignSchema)