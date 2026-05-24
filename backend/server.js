import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import emailRouter from './routes/emailRoute.js'
import webhookRouter from './routes/webhookRoute.js'
import { connectDB } from './db.js'
import metricsRouter from './routes/metricsRoute.js'
import leadRouter from './routes/LeadRoute.js'
import https from 'https'

dotenv.config()

setInterval(() => {
    https.get('https://sdr-agent-backend.onrender.com/health', (res) => {
        console.log('Keep alive ping:', res.statusCode)
    }).on('error', (err) => {
        console.log('Keep alive error:', err.message)
    })
}, 14 * 60 * 1000)

const PORT = process.env.PORT || 5050
const app = express()

app.use(cors())
app.use(express.json())



app.use('/email',emailRouter)
app.use('/webhook', webhookRouter)
app.use('/metrics', metricsRouter)
app.use('/leads', leadRouter)
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' })
})
app.get('/health', (req, res) => {
    res.json({ status: 'alive' })
})

connectDB()
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})