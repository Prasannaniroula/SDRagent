import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('MongoDB connected successfully!')
    } catch (error) {
        console.log('MongoDB connection failed:', error)
        process.exit(1)
    }
}