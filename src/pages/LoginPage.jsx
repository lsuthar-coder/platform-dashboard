import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useLoginMutation } from '../store/api'
import { setCredentials } from '../features/auth/authSlice'

export default function LoginPage() {
  const dispatch = useDispatch()
  const [login, { isLoading }] = useLoginMutation()
  const [email, setEmail] = useState('leeladhar@lsuthar.in')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const result = await login({ email, password }).unwrap()
      if (result.accessToken) {
        dispatch(setCredentials({ token: result.accessToken, email, role: 'user' }))
      }
    } catch (err) {
      setError(err?.data?.error || 'Login failed. Check credentials.')
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: 'var(--bs-body-bg)' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ width: 380 }}
      >
        <div className="mb-4 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-1.5px' }}>Platform</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#55557a', marginTop: 4 }}>
              internal operations dashboard · lsuthar.in
            </div>
          </motion.div>
        </div>

        <Card className="p-4">
          <Card.Body>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Alert variant="danger" className="py-2 px-3" style={{ fontSize: 12, fontFamily: 'var(--mono)' }}>
                  {error}
                </Alert>
              </motion.div>
            )}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>EMAIL</Form.Label>
                <Form.Control
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@lsuthar.in"
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>PASSWORD</Form.Label>
                <Form.Control
                  type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </Form.Group>
              <Button
                type="submit" className="w-100 py-2"
                disabled={isLoading}
                style={{ background: 'var(--accent)', border: 'none', fontWeight: 600 }}
              >
                {isLoading ? <><Spinner size="sm" className="me-2" />Authenticating...</> : 'Sign in →'}
              </Button>
            </Form>
            <div className="mt-3 text-center" style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#55557a' }}>
              RS256 JWT · Auth Service · Civo K8s
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </div>
  )
}
