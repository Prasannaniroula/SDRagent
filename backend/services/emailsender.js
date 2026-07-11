import { BrevoClient } from '@getbrevo/brevo'
import dotenv from 'dotenv'

dotenv.config()

const client = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY
})

export async function sendEmail(to, name, subject, htmlContent) {
    try {
        const response = await client.transactionalEmails.sendTransacEmail({
            to: [{ email: to, name: name }],
            sender: {
                name: "Hamro Aadhiyan",
                email: "hello@prasannaniroula.com.np"
            },
            replyTo:{
                name:"Prasanna Niroula",
                email:"Prasannaniroula987@gmail.com"
            },
            subject: subject,
            htmlContent: htmlContent,
            attachment:[
                {
                    url:"https://prasannaniroula.com.np/PrasannaResume.pdf",
                    name:"Prasanna_Niroula_CV.pdf"
                }
            ]
        })

        return {
            success: true,
            messageId: response.messageId
        }

    } catch (error) {
        console.log("Email sending failed:", error)
        return {
            success: false,
            error: error.message
        }
    }
}