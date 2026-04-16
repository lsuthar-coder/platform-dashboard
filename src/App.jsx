import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { selectAuth, logout } from './features/auth/authSlice'
import { selectPage, setPage } from './features/auth/uiSlice'
import LoginPage from './pages/LoginPage'
import OverviewPage from './pages/OverviewPage'
import FlagsPage from './pages/FlagsPage'
import RoutesPage from './pages/RoutesPage'
import JobsPage from './pages/JobsPage'
import WorkersPage from './pages/WorkersPage'

const NAV = [
  { id: 'overview', label: 'Overview', dot: 'var(--green)' },
  { id: 'flags', label: 'Feature Flags', dot: 'var(--accent)' },
  { id: 'routes', label: 'Gateway Routes', dot: 'var(--blue)' },
  { id: 'jobs', label: 'Audio Jobs', dot: 'var(--amber)' },
  { id: 'workers', label: 'CF Workers', dot: '#f97316' },
]

const PAGE_INFO = {
  overview: { title: 'Overview', sub: 'Platform health and live metrics' },
  flags: { title: 'Feature Flags', sub: 'Manage feature flags and variants' },
  routes: { title: 'Gateway Routes', sub: 'API Gateway routing and middleware' },
  jobs: { title: 'Audio Jobs', sub: 'Extraction job queue and history' },
  workers: { title: 'Serverless Workers', sub: 'Cloudflare Worker deployments' },
}

const PAGES = { overview: OverviewPage, flags: FlagsPage, routes: RoutesPage, jobs: JobsPage, workers: WorkersPage }

export default function App() {
  const dispatch = useDispatch()
  const { token, email } = useSelector(selectAuth)
  const page = useSelector(selectPage)

  if (!token) return <LoginPage />

  const PageComponent = PAGES[page]

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <motion.aside
        className="sidebar"
        initial={{ x: -230 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--bs-border-color)' }}>
          <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.5px' }}>Platform</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#55557a', marginTop: 3 }}>lsuthar.in · ops dashboard</div>
        </div>

        <nav style={{ padding: '8px 0', flex: 1 }}>
          {NAV.map(item => (
            <div key={item.id}
              className={`nav-link-custom${page === item.id ? ' active' : ''}`}
              onClick={() => dispatch(setPage(item.id))}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: item.dot, flexShrink: 0 }} />
              {item.label}
            </div>
          ))}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--bs-border-color)' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#55557a', marginBottom: 4 }}>SIGNED IN AS</div>
          <div style={{ fontSize: 12, color: '#7070a0', wordBreak: 'break-all' }}>{email}</div>
          <div style={{ marginTop: 10, cursor: 'pointer', fontSize: 11, color: 'var(--red)', fontFamily: 'var(--mono)' }}
            onClick={() => dispatch(logout())}>
            Sign out
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>
        {/* Header */}
        <motion.div
          key={page + '-header'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          style={{ marginBottom: 28 }}>
          <div style={{ fontWeight: 700, fontSize: 26, letterSpacing: '-1px' }}>{PAGE_INFO[page].title}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#55557a', marginTop: 4 }}>{PAGE_INFO[page].sub}</div>
        </motion.div>

        {/* Page content with transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}>
            <PageComponent />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
