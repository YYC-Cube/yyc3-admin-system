export const kafkaSyncConfig = {
  brokers: ['localhost:9092'],
  topics: {
    hr: 'sync.hr',
    audit: 'sync.audit',
    kpi: 'sync.kpi'
  },
  metadataFields: ['source_module', 'sync_timestamp'],
  retryPolicy: {
    retries: 3,
    delayMs: 1000
  }
}
