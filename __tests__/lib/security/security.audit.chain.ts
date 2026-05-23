import crypto from 'crypto'

export function generateAuditHashChain(logs: string[]): string[] {
  const chain: string[] = []
  let previousHash = ''

  for (const log of logs) {
    const hash = crypto
      .createHash('sha256')
      .update(previousHash + log)
      .digest('hex')
    chain.push(hash)
    previousHash = hash
  }

  return chain
}
