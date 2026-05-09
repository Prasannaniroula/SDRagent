import React from 'react'
import { useState } from 'react'
import axios from 'axios'

function Composer() {
  const [form, setForm] = useState({
    name: '',
    role: '',
    goal: '',
    email: ''
})
const [loading, setLoading] = useState(false)
const [result, setResult] = useState(null)
const [error, setError] = useState(null)

function handleChange(e) {
  setForm({ ...form, [e.target.name]: e.target.value })
}
async function handleSubmit() {
  setLoading(true)
  setError(null)
  setResult(null)

  try {
      const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/email/send`,
          form
      )
      setResult(res.data)
  } catch (err) {
      setError('Something went wrong. Please try again!')
  } finally {
      setLoading(false)
  }
}

return (
  <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
          ✍️ Email Composer
      </h2>

      {/* Form */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex flex-col gap-4">

              <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
              </div>

              <div>
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <input
                      type="text"
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      placeholder="BSC.CSIT Student"
                      className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
              </div>

              <div>
                  <label className="text-sm font-medium text-gray-700">Goal</label>
                  <input
                      type="text"
                      name="goal"
                      value={form.goal}
                      onChange={handleChange}
                      placeholder="Pass exams with good marks"
                      className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
              </div>

              <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@gmail.com"
                      className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
              </div>

              <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 transition">
                  {loading ? 'Generating & Sending...' : 'Generate & Send Email'}
              </button>

          </div>
      </div>

      {/* Error */}
      {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
              {error}
          </div>
      )}

      {/* Result */}
      {result && (
          <div className="bg-green-50 text-green-600 p-4 rounded-xl">
              <p className="font-bold">✅ Email Sent Successfully!</p>
              <p className="text-sm mt-1">Message ID: {result.messageId}</p>
              <p className="text-sm mt-1">Reason: {result.reason}</p>
          </div>
      )}

  </div>
)
}

export default Composer