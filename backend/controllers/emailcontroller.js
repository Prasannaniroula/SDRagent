import { generateEmail } from "../services/emailgenerator.js";
import { evaluateEmail } from "../services/emailevaluator.js";
import { sendEmail } from "../services/emailsender.js";
import Lead from '../models/Lead.js'

export async function sendColdEmail(req, res) {
    const { name, role, goal, email, finalEmail } = req.body

    if (!name || !role || !goal || !email) {
        return res.status(400).json({
            error: "Please provide name, role, goal and email"
        })
    }

    try {
        let emailToSend = finalEmail
        if (!emailToSend) {
            const generated = await generateEmail({ name, role, goal })
            const evaluated = await evaluateEmail(generated.emails)
            emailToSend = evaluated.final_email
        }

        const subject = `Quick help for ${role}`
        const result = await sendEmail(email, name, subject, emailToSend)

        console.log("MessageId from Brevo:", result.messageId)

        const lead = new Lead({
            name,
            email,
            role,
            goal,
            subject,
            body: emailToSend,
            status: {
                sent: result.success,
                messageId: result.messageId ? result.messageId.replace(/^<|>$/g, '') : null
            },
            timestamps: {
                sent: new Date().toISOString()
            }
        })
        console.log("Saving messageId:", result.messageId ? result.messageId.replace(/^<|>$/g, '') : null)

        await lead.save()

        res.status(200).json({
            success: true,
            messageId: result.messageId
        })

    } catch (error) {
        console.log("Error:", error)
        res.status(500).json({ error: error.message })
    }
}

export async function generateEmailPreview(req, res) {
    const { name, role, goal, email } = req.body

    if (!name || !role || !goal || !email) {
        return res.status(400).json({
            error: "Please provide name, role, goal and email"
        })
    }

    try {

        const generated = await generateEmail({ name, role, goal })

        // Step 2 - Evaluate and pick best email
        const evaluated = await evaluateEmail(generated.emails)

        // Step 3 - Return preview only (don't send yet!)
        res.status(200).json({
            finalEmail: evaluated.final_email,
            reason: evaluated.reason
        })

    } catch (error) {
        console.log("Error:", error)
        res.status(500).json({ error: error.message })
    }
}