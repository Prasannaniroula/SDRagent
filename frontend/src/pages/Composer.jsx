import { useState } from 'react'
import axios from 'axios'
import { useTheme } from '../Context/ThemeContext'

export default function Composer() {
  const { isDark } = useTheme()

  const [form, setForm] = useState({
    name: '',
    role: '',
    goal: '',
    email: ''
  })

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [reason, setReason] = useState('')
  const [messageId, setMessageId] = useState(null)
  const [error, setError] = useState(null)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleGenerate() {
    if (!form.name || !form.role || !form.goal || !form.email) {
        setError('Please fill in all fields!')
        return
    }

    setLoading(true)
    setError(null)

    try {
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/email/generate`,
            form
        )
        setPreview(res.data.finalEmail)
        setReason(res.data.reason)
        setStep(2)
    } catch (err) {
        setError('Failed to generate email. Please try again!')
    } finally {
        setLoading(false)
    }
}

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
        ✍️ Email Composer
      </h2>
      <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        Fill in lead details and let AI generate a personalized email
      </p>
    </div>
  )
}