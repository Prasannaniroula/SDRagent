import * as Brevo from '@getbrevo/brevo'
import dotenv from 'dotenv'

dotenv.config()

const apiInstance = new Brevo.TransactionEmailsApi()
apiInstance.authentications['apiKey'].apiKey = process.env.BREVO_API_KEY
