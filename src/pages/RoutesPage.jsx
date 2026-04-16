import React from 'react'
import { Row, Col, Card, Table } from 'react-bootstrap'
import { motion } from 'framer-motion'

const routes = [
  { path: '/auth', upstream: 'http://auth-service:5000', rateLimit: 20, description: 'Auth Service', canary: false },
  { path: '/flags', upstream: 'http://feature-flag-service:4000', rateLimit: 60, description: 'Feature Flag Service', canary: false },
  { path: '/audio', upstream: 'http://13.200.223.160:3001', rateLimit: 10, description: 'Audio Extraction Service', canary: false },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay, ease: 'easeOut' }
})

export default function RoutesPage() {
  return (
    <div>
      <motion.div {...fadeUp(0)}>
        <Card className="p-3 mb-4">
          <div className="card-label">REGISTERED GATEWAY ROUTES</div>
          <Table hover responsive className="mb-0">
            <thead>
              <tr>
                <th>PATH PREFIX</th>
                <th>UPSTREAM</th>
                <th>RATE LIMIT</th>
                <th>DESCRIPTION</th>
                <th>CANARY</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route, i) => (
                <motion.tr key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}>
                  <td><span className="code-pill">{route.path}</span></td>
                  <td><span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#7070a0' }}>{route.upstream}</span></td>
                  <td><span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{route.rateLimit}/min</span></td>
                  <td><span style={{ fontSize: 12, color: '#9090b0' }}>{route.description}</span></td>
                  <td><span className={`badge ${route.canary ? 'badge-queued' : 'badge-expired'} px-2 py-1`}>
                    {route.canary ? 'enabled' : 'disabled'}
                  </span></td>
                  <td><span className="badge badge-healthy d-flex align-items-center gap-1 px-2 py-1" style={{ width: 'fit-content' }}>
                    <span className="pulse-dot pulse-green" />active
                  </span></td>
                </motion.tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </motion.div>

      <Row className="g-3">
        {[
          { label: 'CIRCUIT BREAKER', value: 'CLOSED', color: 'var(--green)', sub: 'All upstreams healthy', delay: 0.1 },
          { label: 'RATE LIMITING', value: 'ACTIVE', color: 'var(--accent)', sub: 'Redis sliding window', delay: 0.15 },
          { label: 'CANARY ROUTING', value: 'READY', color: 'var(--amber)', sub: 'Flag-driven routing', delay: 0.2 },
          { label: 'JWT VERIFICATION', value: 'RS256', color: 'var(--blue)', sub: 'Public key loaded', delay: 0.25 },
        ].map((item, i) => (
          <Col key={i} md={3}>
            <motion.div {...fadeUp(item.delay)}>
              <Card className="p-3">
                <div className="card-label">{item.label}</div>
                <div className="stat-num" style={{ color: item.color, fontSize: 20 }}>{item.value}</div>
                <div style={{ fontSize: 11, color: '#55557a', marginTop: 4 }}>{item.sub}</div>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      <motion.div {...fadeUp(0.3)} className="mt-4">
        <Card className="p-3">
          <div className="card-label">MIDDLEWARE PIPELINE</div>
          <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
            {['requestId', 'requestLogger', 'jwtVerify', 'requireRoute', 'rateLimiter', 'circuitBreaker', 'resolveUpstream', 'dynamicProxy'].map((step, i) => (
              <React.Fragment key={i}>
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="code-pill"
                >
                  {step}
                </motion.span>
                {i < 7 && <span style={{ color: '#55557a', fontSize: 12 }}>→</span>}
              </React.Fragment>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
