import mongoose from 'mongoose'

const promptSettingsSchema = new mongoose.Schema({
    key:{type:String, default:'default', unique:true},
    generatorPrompt: {type:String, required:true},
    evaluatorPrompt:{type: String, required:true}
}, {timestamps: true})

export default mongoose.model('PromptSettings',promptSettingsSchema)