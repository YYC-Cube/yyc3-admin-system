export function calculateSecurityScore(metrics: {
  failedLogins: number
  auditViolations: number
  encryptedFields: number
  totalChecks: number
}): number {
  const base = 100
  const penalty = metrics.failedLogins * 2 + metrics.auditViolations * 5
  const bonus = metrics.encryptedFields * 1.5
  const score = base - penalty + bonus

  return Math.max(0, Math.min(score, 100))
}
