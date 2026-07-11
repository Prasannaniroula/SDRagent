import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const ALGORITHM = 'aes-256-cbc'
// 32-byte key derived from the secret in .env
const KEY = crypto.createHash('sha256')
    .update(process.env.ENCRYPTION_SECRET || 'default-secret-change-me')
    .digest()

export function encrypt(plainText) {
    if (!plainText) return plainText
    const iv = crypto.randomBytes(16)               // random IV per encryption
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv)
    let encrypted = cipher.update(plainText, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    // store IV with the ciphertext, separated by ':'
    return iv.toString('hex') + ':' + encrypted
}

export function decrypt(cipherText) {
    if (!cipherText || !cipherText.includes(':')) return cipherText
    try {
        const [ivHex, encrypted] = cipherText.split(':')
        const iv = Buffer.from(ivHex, 'hex')
        const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv)
        let decrypted = decipher.update(encrypted, 'hex', 'utf8')
        decrypted += decipher.final('utf8')
        return decrypted
    } catch {
        return cipherText   // old unencrypted records pass through unchanged
    }
}