// 数据加密工具
import crypto from "crypto"

const ALGORITHM = "aes-256-gcm"
const KEY_LENGTH = 32
const IV_LENGTH = 16
const SALT_LENGTH = 64
const TAG_LENGTH = 16

export class Encryption {
  private key: Buffer

  constructor(secret: string) {
    this.key = crypto.scryptSync(secret, "salt", KEY_LENGTH)
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

export const encryption = new Encryption(process.env.ENCRYPTION_SECRET || "default-secret-key-change-in-production")
