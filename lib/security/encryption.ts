// 数据加密工具
import crypto from "crypto"

const ALGORITHM = "aes-256-gcm"
const KEY_LENGTH = 32
const IV_LENGTH = 16
const SALT_LENGTH = 64
const TAG_LENGTH = 16

export class Encryption {
  private key: Buffer
  private salt: Buffer

  constructor(secret: string, salt?: Buffer) {
    // Generate a random salt if not provided (for new installations)
    // For existing installations, the salt should be stored securely and passed in
    this.salt = salt || crypto.randomBytes(SALT_LENGTH)
    this.key = crypto.scryptSync(secret, this.salt, KEY_LENGTH)
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(ALGORITHM, this.key, iv)

    let encrypted = cipher.update(text, "utf8", "hex")
    encrypted += cipher.final("hex")

    const authTag = cipher.getAuthTag()

    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`
  }

  decrypt(encryptedData: string): string {
    const parts = encryptedData.split(":")
    const iv = Buffer.from(parts[0], "hex")
    const authTag = Buffer.from(parts[1], "hex")
    const encrypted = parts[2]

    const decipher = crypto.createDecipheriv(ALGORITHM, this.key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  }

  hash(text: string): string {
    return crypto.createHash("sha256").update(text).digest("hex")
  }
}

// Validate that ENCRYPTION_SECRET is set
if (!process.env.ENCRYPTION_SECRET) {
  throw new Error(
    "ENCRYPTION_SECRET environment variable is not set. Please set it to a secure random string."
  )
}

// Load or generate salt (in production, this should be stored securely)
const ENCRYPTION_SALT = process.env.ENCRYPTION_SALT
  ? Buffer.from(process.env.ENCRYPTION_SALT, "hex")
  : undefined

export const encryption = new Encryption(process.env.ENCRYPTION_SECRET, ENCRYPTION_SALT)
