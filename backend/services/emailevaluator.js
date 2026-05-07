import Groq from 'groq-sdk'
import dotenv from 'dotenv'

dotenv.config()

const groq = new Groq({
    apiKey : process.env.GROQ_API_KEY
})

export async function evaluateEmail(emails){
    const prompt = `
You are an expert SDR email evaluator.

You must select the BEST email from the 3 versions below and return it EXACTLY as-is.

SELECTION CRITERIA:
- Most personalized and human feeling
- No generic marketing language
- Clear and specific pain point
- Soft and curiosity based CTA
- Best overall tone for a BSC.CSIT student in Nepal

CRITICAL RULES:
- Output must be CLEAN HTML email only
- NO placeholders like "(button here)" or "..."
- NO explanations or comments
- NO markdown
- NO extra text outside JSON
- Preserve HTML structure exactly as given

Emails to evaluate:

Professional:
${emails.professional}

Humorous:
${emails.humorous}

Concise:
${emails.concise}

Return ONLY valid JSON:
{
  "final_email": "<clean full HTML email>",
  "reason": "one line why you picked this one"
}
`
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
