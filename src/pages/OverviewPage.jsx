import React from 'react'
import { Row, Col, Card, Badge, Spinner } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useGetGatewayHealthQuery, useGetAggregatedHealthQuery } from '../store/api'

const genData = (n = 24, base = 100, v = 40) =>
  Array.from({ length: n }, (_, i) => ({ t: i, v: Math.max(0, base + (Math.random() - 0.5) * v * 2) }))

const reqData = genData(24, 140, 60)
const latData = genData(24, 180, 70)
const errData = genData(24, 2.5, 2.5)

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay, ease: 'easeOut' }
})

function StatCard({ label, value, sub, color, delay = 0 }) {
  return (
    <motion.div {...fadeUp(delay)}>
      <Card className="p-3 h-100">
        <div className="card-label">{label}</div>
        <div className="stat-num" style={{ color }}>{value}</div>
        <div style={{ fontSize: 11, color: '#55557a', marginTop: 4 }}>{sub}</div>
      </Card>
    </motion.div>
  )
}

export default function OverviewPage() {
  const { data: gateway, isLoading: gLoading } = useGetGatewayHealthQuery(undefined, { pollingInterval: 30000 })
  const { data: health, isLoading: hLoading } = useGetAggregatedHealthQuery(undefined, { pollingInterval: 30000 })

  const services = health?.services || []
  const allOk = health?.status === 'ok'

  return (
    <div>
      <Row className="g-3 mb-4">
        <Col md={3}>
          <StatCard delay={0} label="PLATFORM STATUS"
            value={hLoading ? '...' : allOk ? 'HEALTHY' : 'DEGRADED'}
            color={allOk ? 'var(--green)' : 'var(--red)'}
            sub={`${services.filter(s => s.status === 'healthy').length}/${services.length} services up`} />
        </Col>
        <Col md={3}>
          <StatCard delay={0.05} label="ROUTES LOADED"
            value={gLoading ? '...' : gateway?.routes_loaded ?? '—'}
            color="var(--bs-body-color)"
            sub="API Gateway routes" />
        </Col>
        <Col md={3}>
          <StatCard delay={0.1} label="JWT KEY"
            value={gLoading ? '...' : gateway?.jwt_key_loaded ? 'LOADED' : 'MISSING'}
            color={gateway?.jwt_key_loaded ? 'var(--green)' : 'var(--red)'}
            sub="RS256 public key" />
        </Col>
        <Col md={3}>
          <StatCard delay={0.15} label="REDIS"
            value={gLoading ? '...' : gateway?.redis ?? '—'}
            color="var(--green)"
            sub="Cache + queue" />
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col md={5}>
          <motion.div {...fadeUp(0.2)}>
            <Card className="p-3 h-100">
              <div className="card-label">SERVICE HEALTH</div>
              {hLoading ? (
                <div className="d-flex justify-content-center py-4"><Spinner size="sm" /></div>
              ) : services.map((svc, i) => (
                <div key={i} className="d-flex align-items-center justify-content-between py-2"
                  style={{ borderBottom: i < services.length - 1 ? '1px solid var(--bs-border-color)' : 'none' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{svc.name}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#55557a', marginTop: 2 }}>
                      {svc.httpStatus ? `HTTP ${svc.httpStatus}` : svc.error}
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    {svc.latencyMs && (
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#7070a0' }}>{svc.latencyMs}ms</span>
                    )}
                    <span className={`badge badge-${svc.status} d-flex align-items-center gap-1 px-2 py-1`}>
                      <span className={`pulse-dot pulse-${svc.status === 'healthy' ? 'green' : 'red'}`} />
                      {svc.status}
                    </span>
                  </div>
                </div>
              ))}
            </Card>
          </motion.div>
        </Col>

        <Col md={7}>
          <motion.div {...fadeUp(0.25)}>
            <Card className="p-3">
              <div className="card-label">REQUEST VOLUME — SIMULATED 24H</div>
              <ResponsiveContainer width="100%" height={175}>
                <AreaChart data={reqData}>
                  <defs>
                    <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c6dfa" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7c6dfa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#252535" />
                  <XAxis dataKey="t" hide />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: '#13131e', border: '1px solid #252535', borderRadius: 6, fontSize: 11 }} />
                  <Area type="monotone" dataKey="v" stroke="#7c6dfa" fill="url(#rg)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>
      </Row>

      <Row className="g-3">
        <Col md={6}>
          <motion.div {...fadeUp(0.3)}>
            <Card className="p-3">
              <div className="card-label">LATENCY (MS)</div>
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={latData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#252535" />
                  <XAxis dataKey="t" hide />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: '#13131e', border: '1px solid #252535', borderRadius: 6, fontSize: 11 }} />
                  <Line type="monotone" dataKey="v" stroke="#10d9a0" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>
        <Col md={6}>
          <motion.div {...fadeUp(0.35)}>
            <Card className="p-3">
              <div className="card-label">ERROR RATE (%)</div>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={errData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#252535" />
                  <XAxis dataKey="t" hide />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: '#13131e', border: '1px solid #252535', borderRadius: 6, fontSize: 11 }} />
                  <Bar dataKey="v" fill="#f43f5e" opacity={0.8} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  )
}
