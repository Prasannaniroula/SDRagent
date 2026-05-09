import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import emailRouter from './routes/emailRoute.js'
import webhookRouter from './routes/webhookRoute.js'
import { connectDB } from './db.js'
import metricsRouter from './routes/metricsRoute.js'
import leadRouter from './routes/LeadRoute.js'

dotenv.config()

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

connectDB()
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})