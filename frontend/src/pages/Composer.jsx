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
  const[loading, setLoading] = useState

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