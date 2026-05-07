import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import emailRouter from './routes/emailRoute.js'

dotenv.config()

const PORT = process.env.PORT || 5050
const app = express()

app.use(cors())
app.use(express.json())

app.use('/email',emailRouter)
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})