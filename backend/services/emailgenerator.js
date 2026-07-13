import Groq from "groq-sdk";
import dotenv from 'dotenv'
import PromptSettings from '../models/PromptsSettings.js'
import { DEFAULT_GENERATOR_PROMPT } from '../prompts/defaultPrompts.js'
dotenv.config()

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

function fillTemplate(template, lead) {
    return template
        .replaceAll('{{name}}', lead.name ?? '')
        .replaceAll('{{role}}', lead.role ?? '')
        .replaceAll('{{goal}}', lead.goal ?? '')
}

async function getGeneratorPromptTemplate() {
    try {
        const settings = await PromptSettings.findOne({ key: 'default' })
        if (settings?.generatorPrompt) return settings.generatorPrompt
    } catch (error) {
        console.log('Could not load custom generator prompt, falling back to default:', error.message)
    }
    return DEFAULT_GENERATOR_PROMPT
}

export async function generateEmail(lead) {
  const template = await getGeneratorPromptTemplate()
  const prompt = fillTemplate(template, lead)

const response = await groq.chat.completions.create({
    model:'openai/gpt-oss-120b',
    messages:[
        {role:'system',content:'Return only valid json'},
        {role:'user',content:prompt}
    ],
    temperature: 0.7 ,
    response_format:{type:'json_object'},
    reasoning_effort:'low'
})

const content = response.choices[0].message.content
const cleaned = content.replace(/```json/g,'').replace(/```/g,'').trim()
const data = JSON.parse(cleaned)
return data
}