import PromptSettings from '../models/PromptsSettings.js'
import { DEFAULT_GENERATOR_PROMPT, DEFAULT_EVALUATOR_PROMPT } from '../prompts/defaultPrompts.js'

async function getOrCreateSettings() {
    let settings = await PromptSettings.findOne({ key: 'default' })
    if (!settings) {
        settings = new PromptSettings({
            key: 'default',
            generatorPrompt: DEFAULT_GENERATOR_PROMPT,
            evaluatorPrompt: DEFAULT_EVALUATOR_PROMPT
        })
        await settings.save()
    }
    return settings
}

export async function getPrompts(req, res) {
    try {
        const settings = await getOrCreateSettings()
        res.status(200).json({
            generatorPrompt: settings.generatorPrompt,
            evaluatorPrompt: settings.evaluatorPrompt,
            defaultGeneratorPrompt: DEFAULT_GENERATOR_PROMPT,
            defaultEvaluatorPrompt: DEFAULT_EVALUATOR_PROMPT,
            updatedAt: settings.updatedAt
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export async function updatePrompts(req, res) {
    const { generatorPrompt, evaluatorPrompt } = req.body

    if (!generatorPrompt && !evaluatorPrompt) {
        return res.status(400).json({
            error: 'Provide at least one of generatorPrompt or evaluatorPrompt'
        })
    }

    try {
        const settings = await getOrCreateSettings()
        if (typeof generatorPrompt === 'string' && generatorPrompt.trim()) {
            settings.generatorPrompt = generatorPrompt
        }
        if (typeof evaluatorPrompt === 'string' && evaluatorPrompt.trim()) {
            settings.evaluatorPrompt = evaluatorPrompt
        }
        await settings.save()

        res.status(200).json({
            success: true,
            generatorPrompt: settings.generatorPrompt,
            evaluatorPrompt: settings.evaluatorPrompt,
            updatedAt: settings.updatedAt
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export async function resetPrompts(req, res) {
    const { target } = req.body // 'generator' | 'evaluator' | undefined (=both)

    try {
        const settings = await getOrCreateSettings()

        if (!target || target === 'generator') {
            settings.generatorPrompt = DEFAULT_GENERATOR_PROMPT
        }
        if (!target || target === 'evaluator') {
            settings.evaluatorPrompt = DEFAULT_EVALUATOR_PROMPT
        }

        await settings.save()

        res.status(200).json({
            success: true,
            generatorPrompt: settings.generatorPrompt,
            evaluatorPrompt: settings.evaluatorPrompt
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}