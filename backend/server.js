import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { generateEmail } from './emailgenerator.js'
import { evaluateEmail } from './emailevaluator.js'

dotenv.config()
const PORT = process.env.PORT || 5050


const app = express()

app.use(cors())
app.use(express.json())

app.get('/test', (req,res)=>{
    res.json({message:'Server is running'})
})

app.get('/test-email', async(req,res)=>{
const lead={
    name:"Prasanna",
    role:"Bsc.csit student",
    goal:"Pass the exam with good marks"
}
const result = await generateEmail(lead)
const evaluated = await evaluateEmail(result.emails)
res.json(evaluated)
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)

})