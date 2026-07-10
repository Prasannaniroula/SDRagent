import { useEffect, useState } from 'react'
import axios from 'axios'
import { useTheme } from '../Context/ThemeContext'

const PLACEHOLDER_HELP = {
    generator: ['{{name}}', '{{role}}', '{{goal}}'],
    evaluator: ['{{professional}}', '{{humorous}}', '{{concise}}']
}

export default function PromptSettings() {
    const { isDark } = useTheme()

    const [activeTab, setActiveTab] = useState('generator')
    const [generatorPrompt, setGeneratorPrompt] = useState('')
    const [evaluatorPrompt, setEvaluatorPrompt] = useState('')

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [resetting, setResetting] = useState(false)
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/settings/prompts`)
            .then((res) => {
                setGeneratorPrompt(res.data.generatorPrompt)
                setEvaluatorPrompt(res.data.evaluatorPrompt)
            })
            .catch((err) => {
                console.error(err)
                setError('Failed to load prompts. Is the backend running?')
            })
            .finally(() => setLoading(false))
    }, [])

    async function handleSave() {
        setSaving(true)
        setError(null)
        setMessage(null)
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/settings/prompts`, {
                generatorPrompt,
                evaluatorPrompt
            })
            setMessage('Saved! New emails will use this prompt right away.')
        } catch (err) {
            console.error(err)
            setError('Failed to save prompt. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    async function handleReset() {
        setResetting(true)
        setError(null)
        setMessage(null)
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/settings/prompts/reset`, {
                target: activeTab
            })
            if (activeTab === 'generator') setGeneratorPrompt(res.data.generatorPrompt)
            else setEvaluatorPrompt(res.data.evaluatorPrompt)
            setMessage('Reset to the default prompt.')
        } catch (err) {
            console.error(err)
            setError('Failed to reset prompt. Please try again.')
        } finally {
            setResetting(false)
        }
    }

    const currentValue = activeTab === 'generator' ? generatorPrompt : evaluatorPrompt
    const setCurrentValue = activeTab === 'generator' ? setGeneratorPrompt : setEvaluatorPrompt
    const placeholders = PLACEHOLDER_HELP[activeTab]

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                🧠 Prompt Settings
            </h2>
            <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Edit the instructions the AI uses to write and pick emails. Changes apply immediately to new emails.
            </p>

            <div className={`flex gap-2 mb-4 p-1 rounded-xl w-fit ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <button
                    onClick={() => setActiveTab('generator')}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'generator'
                        ? 'bg-indigo-600 text-white'
                        : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                        }`}>
                    Email Generator Prompt
                </button>
                <button
                    onClick={() => setActiveTab('evaluator')}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'evaluator'
                        ? 'bg-indigo-600 text-white'
                        : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                        }`}>
                    Email Evaluator Prompt
                </button>
            </div>

            {loading ? (
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-sm border p-8 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Loading prompt...
                </div>
            ) : (
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-sm border p-6`}>

                    <div className={`flex flex-wrap items-center gap-2 mb-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <span className="font-medium">Placeholders that get filled in automatically:</span>
                        {placeholders.map(p => (
                            <code key={p} className={`px-2 py-0.5 rounded-md ${isDark ? 'bg-gray-700 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
                                {p}
                            </code>
                        ))}
                    </div>

                    <textarea
                        value={currentValue}
                        onChange={(e) => setCurrentValue(e.target.value)}
                        spellCheck={false}
                        className={`w-full h-[28rem] p-4 rounded-2xl border font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-800'}`}
                    />

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mt-4">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm mt-4">
                            {message}
                        </div>
                    )}

                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={handleReset}
                            disabled={resetting || saving}
                            className={`flex-1 py-3 rounded-xl font-bold border transition disabled:opacity-50 ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                            {resetting ? 'Resetting...' : '↺ Reset to Default'}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving || resetting}
                            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition">
                            {saving ? 'Saving...' : '💾 Save Prompt'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}