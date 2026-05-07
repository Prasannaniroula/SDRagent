import Groq from "groq-sdk";
import dotenv from 'dotenv'
dotenv.config()

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});
export async function generateEmail(lead) {
    const prompt = `
    You are an elite SDR at Hamro Aadhiyan writing hyper-personalized cold emails to BSC.CSIT students in Nepal.
    
    Your job is NOT to write marketing copy.
    Your job is to write emails that feel like a real human noticed this specific student and wrote a short message.
    
    ---
    
    COMPANY CONTEXT:
    - BSC.CSIT notes, videos, past questions
    - AI-based weak area detection for exam improvement
    - Based in Biratnagar, Nepal
    - Website: www.hamroaadhiyan.com
    
    LEAD:
    - Name: ${lead.name}
    - Role: ${lead.role}
    - Goal: ${lead.goal}
    
    SENDER:
    - Name: Prasanna Niroula
    - Position: CEO, Hamro Aadhiyan
    
    ---
    
    BANNED PHRASES (never use any of these):
    - "I've been in your shoes"
    - "I wanted to reach out"
    - "I noticed you're a..."
    - "we understand the importance"
    - "we are committed to helping"
    - "our comprehensive solutions"
    - "let you know about"
    - "hope this email finds you well"
    - "that's why I'm reaching out"
    - "I hope this email finds you well"
    - "I am reaching out"
    - "I wanted to connect"
    - ANY generic marketing phrase
    
    ---
    
    GOOD EMAIL STRUCTURE:
    1. Line 1 → Start with a SPECIFIC pain point about ${lead.goal} — no intro, just jump in
       Example: "CSIT exams hit different when you don't know which chapters to prioritize."
    2. Line 2 → One sentence on what CHANGES with Hamro Aadhiyan — outcome focused, not feature focused
    3. Line 3 → Soft curiosity-based CTA, not pushy
       Example: "Would it help if you knew exactly where your marks are slipping?"
    4. Sign off → short and human
    
    ---
    
    PERSONALIZATION RULES:
    - Reference ${lead.goal} specifically in every email
    - Make ${lead.name} feel like this email was written ONLY for them
    - Never sound like a mass email
    - Use simple conversational Nepali-English tone
    - Mention specific CSIT subjects or struggles when relevant
    
    ---
    
    EMAIL TYPES:
    1. professional → warm, direct, peer-to-peer. No corporate language.
    2. humorous → relatable student struggle, light humor, conversational
    3. concise → max 3 lines, punchy and direct
    
    ---
    
    HTML FORMAT (use this EXACT structure for all 3 emails):
    
    <div style="background:#f4f6f8;padding:32px 16px;font-family:Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        
        <div style="background:#4F46E5;padding:20px 28px;">
          <span style="color:#ffffff;font-size:18px;font-weight:bold;">Hamro Aadhiyan</span>
          <span style="color:#c7d2fe;font-size:13px;margin-left:8px;">for BSC.CSIT students</span>
        </div>
    
        <div style="padding:28px;">
          <p style="font-size:20px;font-weight:bold;color:#1a1a1a;margin:0 0 16px;">Hi ${lead.name},</p>
          <p style="font-size:15px;line-height:1.7;color:#374151;margin:0 0 12px;">
            [FIRST LINE — specific pain point about ${lead.goal}]
          </p>
          <p style="font-size:15px;line-height:1.7;color:#374151;margin:0 0 12px;">
            [SECOND LINE — outcome of using Hamro Aadhiyan for ${lead.role}]
          </p>
          <p style="font-size:15px;line-height:1.7;color:#374151;margin:0 0 24px;">
            [THIRD LINE — soft CTA related to ${lead.goal}]
          </p>
    
          <a href="https://www.hamroaadhiyan.com" style="display:inline-block;background:#4F46E5;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:15px;font-weight:bold;">
            Check Hamro Aadhiyan
          </a>
        </div>
    
        <div style="padding:20px 28px;border-top:1px solid #f0f0f0;background:#fafafa;">
          <p style="margin:0;font-size:14px;font-weight:bold;color:#1a1a1a;">Prasanna Niroula</p>
          <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">CEO, Hamro Aadhiyan</p>
          <a href="https://www.hamroaadhiyan.com" style="font-size:13px;color:#4F46E5;text-decoration:none;">www.hamroaadhiyan.com</a>
        </div>
    
      </div>
    </div>
    
    ---
    
    OUTPUT RULES:
    - NO markdown
    - NO explanation
    - NO extra text
    - NO placeholders like "[FIRST LINE]" in output
    - ONLY valid JSON
    - Fill ALL placeholders with real personalized content
    
    FORMAT:
    {
      "emails": {
        "professional": "<div>...</div>",
        "humorous": "<div>...</div>",
        "concise": "<div>...</div>"
      }
    }
    `


const response = await groq.chat.completions.create({
    model:'llama-3.3-70b-versatile',
    messages:[
        {role:'system',content:'Return only valid json'},
        {role:'user',content:prompt}
    ],
    temperature: 0.7 
})

const content = response.choices[0].message.content
const cleaned = content.replace(/```json/g,'').replace(/```/g,'').trim()
const data = JSON.parse(cleaned)
return data
}
