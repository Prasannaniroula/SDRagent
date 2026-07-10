import Groq from 'groq-sdk'
import dotenv from 'dotenv'
import PromptSettings from '../models/PromptsSettings.js'
import { DEFAULT_EVALUATOR_PROMPT } from '../prompts/defaultPrompts.js'

dotenv.config()

const groq = new Groq({
    apiKey : process.env.GROQ_API_KEY
})

function fillTemplate(template, emails) {
    return template
        .replaceAll('{{professional}}', emails.professional ?? '')
        .replaceAll('{{humorous}}', emails.humorous ?? '')
        .replaceAll('{{concise}}', emails.concise ?? '')
}

async function getEvaluatorPromptTemplate() {
    try {
        const settings = await PromptSettings.findOne({ key: 'default' })
        if (settings?.evaluatorPrompt) return settings.evaluatorPrompt
    } catch (error) {
        console.log('Could not load custom evaluator prompt, falling back to default:', error.message)
    }
    return DEFAULT_EVALUATOR_PROMPT
}

export async function evaluateEmail(emails){
    const template = await getEvaluatorPromptTemplate()
    const prompt = fillTemplate(template, emails)

const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages:[
        {role:'system', content:'return only valid json'},
        {role:'user', content:prompt}
    ],
    temperature:0.3
})
const content = response.choices[0].message.content

const cleaned = content.replace(/```json/g,'').replace(/```/g,'').trim()
const data = JSON.parse(cleaned)
return data
}