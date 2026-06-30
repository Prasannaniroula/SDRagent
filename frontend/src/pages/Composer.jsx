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

    const [emailText, setEmailText] = useState('')

    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState(null)
    const [reason, setReason] = useState('')
    const [messageId, setMessageId] = useState(null)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState('single')
    const [csvLeads, setCsvLeads] = useState([])
    const [bulkLoading, setBulkLoading] = useState(false)
    const [bulkProgress, setBulkProgress] = useState(0)
    const [bulkResults, setBulkResults] = useState([])

    const [editMode, setEditMode] = useState(false)
    const [editedEmail, setEditedEmail] = useState('')


    function htmlToPlainText(html) {
        const div = document.createElement('div')
        div.innerHTML = html
        return div.textContent || div.innerText || ''
    }


    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    function rebuildHtmlFromText(originalHtml, newText) {
        const div = document.createElement('div')
        div.innerHTML = originalHtml
    
        const paragraphs = div.querySelectorAll('p')
        const newLines = newText.split('\n').filter(line => line.trim() !== '')
    
        paragraphs.forEach((p, i) => {
            if (newLines[i] !== undefined) {
                p.textContent = newLines[i]
            }
        })
    
        return div.innerHTML
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
            setEditedEmail(res.data.finalEmail)
            setEmailText(htmlToPlainText(res.data.finalEmail))
            setReason(res.data.reason)
            setStep(2)
        } catch (err) {
            setError('Failed to generate email. Please try again!')
        } finally {
            setLoading(false)
        }

    }
    async function handleSend() {
        setLoading(true)
        setError(null)

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/email/send`,
                { ...form, finalEmail: preview }
            )
            setMessageId(res.data.messageId)
            setStep(3)
        } catch (err) {
            setError('Failed to send email. Please try again!')
        } finally {
            setLoading(false)
        }
    }

    function handleCSV(e) {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            const text = e.target.result
            const lines = text.split('\n').filter(line => line.trim())

            const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
            const requiredHeaders = ['name', 'role', 'goal', 'email']
            const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))

            if (missingHeaders.length > 0) {
                setError(`❌ CSV is missing columns: ${missingHeaders.join(', ')}`)
                setCsvLeads([])
                return
            }

            const leads = lines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim())
                const lead = {}
                headers.forEach((header, i) => {
                    lead[header] = values[i]
                })
                return lead
            }).filter(lead => lead.email)


            const invalidLeads = leads.filter(lead =>
                !lead.name || !lead.role || !lead.goal || !lead.email
            )

            if (invalidLeads.length > 0) {
                setError(` ${invalidLeads.length} rows have missing fields!`)
                setCsvLeads([])
                return
            }


            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            const invalidEmails = leads.filter(lead => !emailRegex.test(lead.email))

            if (invalidEmails.length > 0) {
                setError(` Invalid emails found: ${invalidEmails.map(l => l.email).join(', ')}`)
                setCsvLeads([])
                return
            }

            setError(null)
            setCsvLeads(leads)
        }
        reader.readAsText(file)
    }

    async function handleBulkSend() {
        if (csvLeads.length === 0) return

        setBulkLoading(true)
        setBulkProgress(0)
        setBulkResults([])

        for (let i = 0; i < csvLeads.length; i++) {
            const lead = csvLeads[i]
            try {
                await axios.post(
                    `${import.meta.env.VITE_API_URL}/email/send`,
                    lead
                )
                setBulkResults(prev => [...prev, {
                    name: lead.name,
                    email: lead.email,
                    success: true
                }])
            } catch (err) {
                setBulkResults(prev => [...prev, {
                    name: lead.name,
                    email: lead.email,
                    success: false
                }])
            }
            setBulkProgress(i + 1)

            if (i < csvLeads.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 30000))
            }
        }

        setBulkLoading(false)
    }

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                ✍️ Email Composer
            </h2>
            <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Fill in lead details and let AI generate a personalized email
            </p>

            {/* Tabs */}
            <div className={`flex gap-2 mb-6 p-1 rounded-xl w-fit ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <button
                    onClick={() => setActiveTab('single')}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'single'
                            ? 'bg-indigo-600 text-white'
                            : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                        }`}>
                    Single Email
                </button>
                <button
                    onClick={() => setActiveTab('bulk')}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'bulk'
                            ? 'bg-indigo-600 text-white'
                            : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                        }`}>
                    Bulk CSV
                </button>
            </div>

            {activeTab == 'single' && (
                <>



                    <div className="flex items-center gap-2 mb-8">
                        {['Lead Details', 'Preview', 'Sent!'].map((label, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step > i ? 'bg-indigo-600 text-white' : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>
                                    {i + 1}
                                </div>
                                <span className={`text-sm ${step === i + 1 ? 'text-indigo-600 font-medium' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {label}
                                </span>
                                {i < 2 && <div className={`w-8 h-0.5 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />}
                            </div>
                        ))}
                    </div>


                    {step === 1 && (
                        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-100'} p-6`}>
                            <div className="flex flex-col gap-4">
                                {[
                                    { label: 'Name', name: 'name', placeholder: 'John Doe', type: 'text' },
                                    { label: 'Role', name: 'role', placeholder: 'BSC.CSIT Student', type: 'text' },
                                    { label: 'Goal', name: 'goal', placeholder: 'Pass exams with good marks', type: 'text' },
                                    { label: 'Email', name: 'email', placeholder: 'john@gmail.com', type: 'email' },
                                ].map(field => (
                                    <div key={field.name}>
                                        <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {field.label}
                                        </label>
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={form[field.name]}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                            className={`w-full mt-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`}
                                        />
                                    </div>
                                ))}

                                {error && (
                                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    className="bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition">
                                    {loading ? 'Generating...' : '✨ Generate Email'}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col gap-4">
                            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-sm border p-4`}>
                                <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    AI Reason:
                                </p>
                                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {reason}
                                </p>
                            </div>



                            <div className="flex justify-between items-center mb-2">
                                <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                    Email Preview
                                </h4>
                                <button
                                     onClick={() => {
                                        if (editMode) {
                                            const updatedHtml = rebuildHtmlFromText(preview, emailText)
                                            setPreview(updatedHtml)
                                        }
                                        setEditMode(!editMode)
                                    }}
                                    className={`text-xs font-medium px-3 py-1.5 rounded-lg transition ${editMode
                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                            : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}>
                                    {editMode ? '👁️ View Preview' : '✏️ Edit Text'}
                                </button>
                            </div>

                            {editMode ? (
                                <textarea
                                    value={emailText}
                                    onChange={(e) => setEmailText(e.target.value)}
                                    className={`w-full h-72 p-4 rounded-2xl border text-sm leading-relaxed ${isDark ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-800'}`}
                                    placeholder="Edit your email text here..."
                                />
                            ) : (
                                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                                    <iframe
                                        srcDoc={preview}
                                        className="w-full h-96 bg-white"
                                        title="Email Preview"
                                    />
                                </div>
                            )}






                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(1)}
                                    className={`flex-1 py-3 rounded-xl font-bold border transition ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                                    ← Regenerate
                                </button>
                                <button
                                    onClick={handleSend}
                                    disabled={loading}
                                    className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition">
                                    {loading ? 'Sending...' : ' Send Email'}
                                </button>
                            </div>
                        </div>
                    )}


                    {step === 3 && (
                        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-sm border p-8 text-center`}>
                            <div className="text-5xl mb-4">🎉</div>
                            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                Email Sent Successfully!
                            </h3>
                            <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Message ID: {messageId}
                            </p>
                            <button
                                onClick={() => {
                                    setStep(1)
                                    setForm({ name: '', role: '', goal: '', email: '' })
                                    setPreview(null)
                                    setMessageId(null)
                                }}
                                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
                                Send Another Email
                            </button>
                        </div>
                    )}


                </>
            )}



            {activeTab === 'bulk' && (
                <div className="flex flex-col gap-6">

                    {/* //upload CSV */}
                    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-sm border p-6`}>
                        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            Upload CSV File
                        </h3>
                        <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            CSV must have columns: name, role, goal, email
                        </p>
                        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition ${isDark ? 'border-gray-600 hover:border-indigo-500 bg-gray-700' : 'border-gray-300 hover:border-indigo-500 bg-gray-50'}`}>
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-3xl">📂</span>
                                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Click to upload CSV file
                                </p>
                                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    name, role, goal, email columns required
                                </p>
                            </div>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleCSV}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {csvLeads.length > 0 && !bulkLoading && bulkResults.length === 0 && (
                        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-sm border p-6`}>
                            <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                {csvLeads.length} Leads Found
                            </h3>
                            <div className="flex flex-col gap-2 mb-6">
                                {csvLeads.map((lead, i) => (
                                    <div key={i} className={`flex justify-between items-center p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                        <div>
                                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{lead.name}</p>
                                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{lead.email}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-lg ${isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                                            {lead.role}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <p className={`text-xs mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                ⏱ Estimated time: {csvLeads.length * 30} seconds (~{Math.ceil(csvLeads.length * 30 / 60)} minutes)
                            </p>
                            <button
                                onClick={handleBulkSend}
                                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
                                Send All {csvLeads.length} Emails
                            </button>
                        </div>
                    )}

                    {bulkLoading && (
                        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-sm border p-6`}>
                            <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                Sending Emails...
                            </h3>
                            <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {bulkProgress} of {csvLeads.length} sent
                            </p>
                            <p className={`text-xs mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                ⏱ Estimated time remaining: {(csvLeads.length - bulkProgress) * 30} seconds
                            </p>
                            {/* Progress Bar */}
                            <div className={`w-full h-3 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <div
                                    className="h-3 bg-indigo-600 rounded-full transition-all duration-500"
                                    style={{ width: `${(bulkProgress / csvLeads.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {bulkResults.length > 0 && !bulkLoading && (
                        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-sm border p-6`}>
                            <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                Results
                            </h3>
                            <div className="flex flex-col gap-2">
                                {bulkResults.map((result, i) => (
                                    <div key={i} className={`flex justify-between items-center p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                        <div>
                                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{result.name}</p>
                                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{result.email}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-lg font-medium ${result.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {result.success ? 'Sent' : 'Failed'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => {
                                    setCsvLeads([])
                                    setBulkResults([])
                                    setBulkProgress(0)
                                }}
                                className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
                                Upload New CSV
                            </button>
                        </div>
                    )}

                </div>
            )}


        </div>
    )
}