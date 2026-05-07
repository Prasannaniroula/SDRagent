import { generateEmail } from "../services/emailgenerator.js";
import { evaluateEmail } from "../services/emailevaluator.js";
import { sendEmail } from "../services/emailsender.js";

export async function sendColdEmail(req, res) {
    const { name, role, goal, email } = req.body
    if (!name || !role || !goal || !email) {
        return res.status(400).json({ 
            error: "Please provide name, role, goal and email" 
        })
    }
    try {
        const generated = await generateEmail({ name, role, goal })
    
        const evaluated = await evaluateEmail(generated.emails)

        const subject = `Quick help for ${role}`
        const result = await sendEmail(email, name, subject, evaluated.final_email)
    
        res.status(200).json({
            success: true,
            messageId: result.messageId,
            reason: evaluated.reason
        })
    
    } catch (error) {
        console.log("Error:", error)
        res.status(500).json({ error: error.message })
    }
}