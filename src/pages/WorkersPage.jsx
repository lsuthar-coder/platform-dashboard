import React from 'react'
import { Card, Table, Row, Col } from 'react-bootstrap'
import { motion } from 'framer-motion'

const workers = [
  { name: 'health-aggregator', trigger: 'HTTP', url: 'health-aggregator.leeladharsuthar62.workers.dev', desc: 'Aggregates all service health checks' },
  { name: 'log-retention-pruner', trigger: 'Cron 0 2 * * *', url: 'log-retention-pruner.leeladharsuthar62.workers.dev', desc: 'Deletes logs older than 30 days' },
  { name: 'flag-change-notifier', trigger: 'Queue: flag-events', url: 'flag-change-notifier.leeladharsuthar62.workers.dev', desc: 'Sends Slack notification on flag changes' },
  { name: 'github-webhook-handler', trigger: 'HTTP', url: 'github-webhook-handler.leeladharsuthar62.workers.dev', desc: 'Triggers Azure Pipeline on push' },
  { name: 'file-cleanup', trigger: 'Cron 0 */6 * * *', url: 'file-cleanup.leeladharsuthar62.workers.dev', desc: 'Removes expired S3 audio files' },
  { name: 'circuit-breaker-handler', trigger: 'HTTP', url: 'circuit-breaker-handler.leeladharsuthar62.workers.dev', desc: 'Resets circuit breaker state' },
  { name: 'jwt-key-rotator', trigger: 'Cron 0 0 1 * *', url: 'jwt-key-rotator.leeladharsuthar62.workers.dev', desc: 'Monthly RSA key rotation' },
  { name: 's3-upload-validator', trigger: 'HTTP', url: 's3-upload-validator.leeladharsuthar62.workers.dev', desc: 'Validates and enqueues uploaded files' },
]

export default function WorkersPage() {
  return (
    <div>
      <Row className="g-3 mb-4">
        {[
          { label: 'TOTAL WORKERS', value: '8', color: 'var(--accent)' },
          { label: 'HTTP TRIGGERS', value: '4', color: 'var(--blue)' },
          { label: 'CRON TRIGGERS', value: '3', color: 'var(--amber)' },
          { label: 'QUEUE TRIGGERS', value: '1', color: 'var(--green)' },
        ].map((s, i) => (
          <Col key={i} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}>
              <Card className="p-3">
                <div className="card-label">{s.label}</div>
                <div className="stat-num" style={{ color: s.color }}>{s.value}</div>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}>
        <Card className="p-3">
          <div className="card-label">CLOUDFLARE WORKERS</div>
          <Table hover responsive className="mb-0">
            <thead>
              <tr>
                <th>WORKER</th>
                <th>TRIGGER</th>
                <th>ENDPOINT</th>
                <th>DESCRIPTION</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w, i) => (
                <motion.tr key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.04 }}>
                  <td style={{ fontWeight: 600, fontSize: 12 }}>{w.name}</td>
                  <td><span className="code-pill">{w.trigger}</span></td>
                  <td><span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#55557a' }}>{w.url}</span></td>
                  <td style={{ fontSize: 12, color: '#9090b0' }}>{w.desc}</td>
                  <td>
                    <span className="badge badge-healthy d-flex align-items-center gap-1 px-2 py-1" style={{ width: 'fit-content' }}>
                      <span className="pulse-dot pulse-green" />active
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </motion.div>
    </div>
  )
}
