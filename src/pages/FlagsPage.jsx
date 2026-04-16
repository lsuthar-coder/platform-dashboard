import React, { useState } from 'react'
import { Row, Col, Card, Table, Badge, Button, Form, Alert, Spinner, Tab, Nav } from 'react-bootstrap'
import { motion, AnimatePresence } from 'framer-motion'
import { useGetFlagsQuery, useCreateFlagMutation } from '../store/api'

const typeColor = { boolean: 'green', string: 'blue', number: 'amber', multivariate: 'purple' }
const typeBadgeClass = { boolean: 'badge-healthy', string: 'badge-active', number: 'badge-queued', multivariate: 'badge-type' }

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay, ease: 'easeOut' }
})

export default function FlagsPage() {
  const { data: flags = [], isLoading, isError } = useGetFlagsQuery(undefined, { pollingInterval: 60000 })
  const [createFlag, { isLoading: creating }] = useCreateFlagMutation()
  const [tab, setTab] = useState('list')
  const [form, setForm] = useState({ name: '', flag_type: 'boolean', description: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name) { setError('Flag name is required'); return }
    setError(''); setSuccess('')
    try {
      await createFlag(form).unwrap()
      setSuccess(`Flag "${form.name}" created successfully`)
      setForm({ name: '', flag_type: 'boolean', description: '' })
      setTab('list')
    } catch (err) {
      setError(err?.data?.error || 'Failed to create flag')
    }
  }

  return (
    <div>
      <Nav variant="tabs" className="mb-4" activeKey={tab} onSelect={setTab}>
        <Nav.Item><Nav.Link eventKey="list">Flags {isLoading ? '' : `(${flags.length})`}</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="create">+ New Flag</Nav.Link></Nav.Item>
      </Nav>

      <AnimatePresence mode="wait">
        {tab === 'list' && (
          <motion.div key="list" {...fadeUp(0)}>
            <Card className="p-3">
              {isLoading ? (
                <div className="d-flex justify-content-center py-5"><Spinner /></div>
              ) : isError ? (
                <Alert variant="danger">Failed to load flags</Alert>
              ) : flags.length === 0 ? (
                <div className="text-center py-5" style={{ color: '#55557a', fontFamily: 'var(--mono)', fontSize: 12 }}>
                  No flags yet. Create your first flag.
                </div>
              ) : (
                <Table hover responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>TYPE</th>
                      <th>ENVIRONMENT</th>
                      <th>VARIANTS</th>
                      <th>ENABLED</th>
                      <th>CREATED</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flags.map((flag, i) => (
                      <motion.tr key={flag.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{flag.name}</div>
                          {flag.description && (
                            <div style={{ fontSize: 11, color: '#55557a', marginTop: 2 }}>{flag.description}</div>
                          )}
                        </td>
                        <td><span className={`badge ${typeBadgeClass[flag.flag_type] || 'badge-type'} px-2 py-1`}>{flag.flag_type}</span></td>
                        <td><span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#7070a0' }}>{flag.environment}</span></td>
                        <td><span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{flag.variants?.length ?? 0}</span></td>
                        <td>
                          <span className={`badge ${flag.enabled ? 'badge-healthy' : 'badge-expired'} px-2 py-1`}>
                            {flag.enabled ? 'on' : 'off'}
                          </span>
                        </td>
                        <td><span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#55557a' }}>
                          {new Date(flag.created_at).toLocaleDateString()}
                        </span></td>
                      </motion.tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card>

            {/* Variant breakdown for multivariate flags */}
            {flags.filter(f => f.variants?.length > 0).length > 0 && (
              <motion.div {...fadeUp(0.15)} className="mt-3">
                <Card className="p-3">
                  <div className="card-label mb-3">VARIANT WEIGHTS</div>
                  <Row className="g-3">
                    {flags.filter(f => f.variants?.length > 0).map(flag => (
                      <Col key={flag.id} md={4}>
                        <div style={{ background: 'var(--bs-secondary-bg)', borderRadius: 8, padding: 14 }}>
                          <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 10 }}>{flag.name}</div>
                          {flag.variants.map((v, i) => (
                            <div key={i} className="mb-2">
                              <div className="d-flex justify-content-between mb-1">
                                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#7070a0' }}>{v.key}</span>
                                <span style={{ fontFamily: 'var(--mono)', fontSize: 10 }}>{v.weight}%</span>
                              </div>
                              <div style={{ height: 4, background: 'var(--bs-border-color)', borderRadius: 2 }}>
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${v.weight}%` }}
                                  transition={{ duration: 0.6, delay: i * 0.1 }}
                                  style={{ height: '100%', background: 'var(--accent)', borderRadius: 2 }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}

        {tab === 'create' && (
          <motion.div key="create" {...fadeUp(0)}>
            <Card className="p-4" style={{ maxWidth: 520 }}>
              <Card.Body>
                {error && <Alert variant="danger" className="py-2" style={{ fontSize: 12, fontFamily: 'var(--mono)' }}>{error}</Alert>}
                {success && <Alert variant="success" className="py-2" style={{ fontSize: 12, fontFamily: 'var(--mono)' }}>{success}</Alert>}
                <Form onSubmit={handleCreate}>
                  <Form.Group className="mb-3">
                    <Form.Label>FLAG NAME</Form.Label>
                    <Form.Control placeholder="e.g. dark-mode, audio-codec"
                      value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>TYPE</Form.Label>
                    <Form.Select value={form.flag_type} onChange={e => setForm(f => ({ ...f, flag_type: e.target.value }))}>
                      <option value="boolean">boolean</option>
                      <option value="string">string</option>
                      <option value="number">number</option>
                      <option value="multivariate">multivariate</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>DESCRIPTION</Form.Label>
                    <Form.Control placeholder="Optional description"
                      value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                  </Form.Group>
                  <div className="d-flex gap-2">
                    <Button type="submit" disabled={creating}
                      style={{ background: 'var(--accent)', border: 'none', fontWeight: 600 }}>
                      {creating ? <><Spinner size="sm" className="me-2" />Creating...</> : 'Create Flag'}
                    </Button>
                    <Button variant="outline-secondary" onClick={() => setTab('list')}>Cancel</Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
