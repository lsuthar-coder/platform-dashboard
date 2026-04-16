import { useState, useEffect, useCallback } from 'react';
import './index.css';

const API_URL = 'https://api.lsuthar.in';
const FLAGS_URL = 'https://flags.lsuthar.in';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');
  const [flags, setFlags] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [newFlag, setNewFlag] = useState({ name: '', flag_type: 'boolean', description: '' });
  const [showCreateFlag, setShowCreateFlag] = useState(false);

  const fetchHealth = useCallback(async () => {
    try {
      const [api, flags] = await Promise.all([
        fetch(`${API_URL}/health`).then(r => r.json()),
        fetch(`${FLAGS_URL}/health`).then(r => r.json()),
      ]);
      setHealth({ api, flags });
    } catch (e) {
      setHealth(null);
    }
  }, []);

  const fetchFlags = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/flags`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401) { logout(); return; }
      const data = await res.json();
      setFlags(Array.isArray(data) ? data : []);
    } catch (e) {
      setError('Failed to fetch flags');
    }
  }, [token]);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  useEffect(() => {
    if (token) {
      setView('dashboard');
      fetchFlags();
    }
  }, [token, fetchFlags]);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
        setToken(data.accessToken);
        setUser({ email: loginForm.email });
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (e) {
      setError('Connection failed');
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setFlags([]);
    setView('login');
  };

  const toggleFlag = async (flag) => {
    try {
      const res = await fetch(`${API_URL}/flags/${flag.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ enabled: !flag.enabled })
      });
      if (res.ok) fetchFlags();
    } catch (e) {
      setError('Failed to update flag');
    }
  };

  const createFlag = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/flags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newFlag)
      });
      if (res.ok) {
        setNewFlag({ name: '', flag_type: 'boolean', description: '' });
        setShowCreateFlag(false);
        fetchFlags();
      }
    } catch (e) {
      setError('Failed to create flag');
    }
    setLoading(false);
  };

  const deleteFlag = async (id) => {
    if (!confirm('Delete this flag?')) return;
    try {
      await fetch(`${API_URL}/flags/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFlags();
    } catch (e) {
      setError('Failed to delete flag');
    }
  };

  if (view === 'login') {
    return (
      <div className="login-page">
        <div className="login-bg">
          <div className="grid-lines" />
          <div className="orb orb-1" />
          <div className="orb orb-2" />
        </div>
        <div className="login-card">
          <div className="login-brand">
            <div className="brand-mark">P</div>
            <div>
              <h1 className="brand-name">Platform</h1>
              <p className="brand-sub">Internal Control Plane</p>
            </div>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={login} className="login-form">
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="admin@lsuthar.in"
                required
              />
            </div>
            <div className="field">
              <label>Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <div className="login-footer">
            <span className="dot dot-green" /> Cluster online · Mumbai
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">P</div>
          <span>Platform</span>
        </div>
        <nav className="sidebar-nav">
          <button className={`nav-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
            <span className="nav-icon">⬡</span> Overview
          </button>
          <button className={`nav-item ${view === 'flags' ? 'active' : ''}`} onClick={() => { setView('flags'); fetchFlags(); }}>
            <span className="nav-icon">⚑</span> Feature Flags
          </button>
          <button className={`nav-item ${view === 'services' ? 'active' : ''}`} onClick={() => setView('services')}>
            <span className="nav-icon">◈</span> Services
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">{user?.email?.[0]?.toUpperCase() || 'U'}</div>
            <div className="user-email">{user?.email || 'User'}</div>
          </div>
          <button className="btn-logout" onClick={logout}>↩</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <h2 className="page-title">
              {view === 'dashboard' && 'Overview'}
              {view === 'flags' && 'Feature Flags'}
              {view === 'services' && 'Services'}
            </h2>
          </div>
          <div className="topbar-right">
            {health && (
              <div className="health-pills">
                <span className={`pill ${health.api?.status === 'ok' ? 'pill-green' : 'pill-red'}`}>
                  Gateway {health.api?.routes_loaded ?? '?'} routes
                </span>
                <span className={`pill ${health.flags?.status === 'ok' ? 'pill-green' : 'pill-red'}`}>
                  Flags
                </span>
              </div>
            )}
          </div>
        </header>

        <div className="content">
          {error && <div className="alert alert-error">{error} <button onClick={() => setError('')}>×</button></div>}

          {view === 'dashboard' && (
            <div className="dashboard-view">
              <div className="stat-grid">
                <div className="stat-card">
                  <div className="stat-label">Routes Loaded</div>
                  <div className="stat-value">{health?.api?.routes_loaded ?? '—'}</div>
                  <div className="stat-sub">API Gateway</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Feature Flags</div>
                  <div className="stat-value">{flags.length}</div>
                  <div className="stat-sub">{flags.filter(f => f.enabled).length} enabled</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">JWT Auth</div>
                  <div className="stat-value">{health?.api?.jwt_key_loaded ? '✓' : '✗'}</div>
                  <div className="stat-sub">RS256 keys loaded</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Redis</div>
                  <div className="stat-value stat-green">{health?.api?.redis === 'ok' ? 'OK' : '—'}</div>
                  <div className="stat-sub">Cache layer</div>
                </div>
              </div>

              <div className="section">
                <h3 className="section-title">Recent Flags</h3>
                <div className="flags-list">
                  {flags.slice(0, 5).map(flag => (
                    <div key={flag.id} className="flag-row">
                      <div className="flag-info">
                        <span className="flag-name">{flag.name}</span>
                        <span className={`badge badge-${flag.flag_type}`}>{flag.flag_type}</span>
                      </div>
                      <div className={`toggle ${flag.enabled ? 'on' : 'off'}`} onClick={() => toggleFlag(flag)}>
                        <div className="toggle-thumb" />
                      </div>
                    </div>
                  ))}
                  {flags.length === 0 && <div className="empty">No flags yet</div>}
                </div>
              </div>

              <div className="section">
                <h3 className="section-title">Infrastructure</h3>
                <div className="infra-grid">
                  {[
                    { name: 'Civo K8s', detail: '2 × Large nodes · Mumbai', status: 'running' },
                    { name: 'Neon PostgreSQL', detail: 'ap-southeast-1 · 10 migrations', status: 'running' },
                    { name: 'AWS EC2', detail: 't2.micro · Audio service', status: 'running' },
                    { name: 'Cloudflare Workers', detail: '8 workers deployed', status: 'running' },
                    { name: 'Azure Pipelines', detail: '3 CI/CD pipelines', status: 'running' },
                    { name: 'Grafana', detail: 'grafana.lsuthar.in', status: 'running' },
                  ].map(item => (
                    <div key={item.name} className="infra-card">
                      <div className="infra-dot" />
                      <div className="infra-info">
                        <div className="infra-name">{item.name}</div>
                        <div className="infra-detail">{item.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === 'flags' && (
            <div className="flags-view">
              <div className="view-header">
                <p className="view-desc">Manage feature flags across services</p>
                <button className="btn btn-primary" onClick={() => setShowCreateFlag(!showCreateFlag)}>
                  {showCreateFlag ? 'Cancel' : '+ New Flag'}
                </button>
              </div>

              {showCreateFlag && (
                <div className="create-card">
                  <h3>Create Flag</h3>
                  <form onSubmit={createFlag} className="create-form">
                    <div className="field-row">
                      <div className="field">
                        <label>Name</label>
                        <input
                          value={newFlag.name}
                          onChange={e => setNewFlag({ ...newFlag, name: e.target.value })}
                          placeholder="my-feature-flag"
                          required
                        />
                      </div>
                      <div className="field">
                        <label>Type</label>
                        <select value={newFlag.flag_type} onChange={e => setNewFlag({ ...newFlag, flag_type: e.target.value })}>
                          <option value="boolean">Boolean</option>
                          <option value="string">String</option>
                          <option value="number">Number</option>
                          <option value="multivariate">Multivariate</option>
                        </select>
                      </div>
                    </div>
                    <div className="field">
                      <label>Description</label>
                      <input
                        value={newFlag.description}
                        onChange={e => setNewFlag({ ...newFlag, description: e.target.value })}
                        placeholder="What does this flag control?"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Creating...' : 'Create Flag'}
                    </button>
                  </form>
                </div>
              )}

              <div className="flags-table">
                <div className="table-header">
                  <span>Name</span>
                  <span>Type</span>
                  <span>Environment</span>
                  <span>Variants</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>
                {flags.map(flag => (
                  <div key={flag.id} className="table-row">
                    <div className="flag-name-cell">
                      <span className="flag-name">{flag.name}</span>
                      {flag.description && <span className="flag-desc">{flag.description}</span>}
                    </div>
                    <span className={`badge badge-${flag.flag_type}`}>{flag.flag_type}</span>
                    <span className="env-badge">{flag.environment}</span>
                    <span className="variants-count">{flag.variants?.length ?? 0}</span>
                    <div className={`toggle ${flag.enabled ? 'on' : 'off'}`} onClick={() => toggleFlag(flag)}>
                      <div className="toggle-thumb" />
                    </div>
                    <button className="btn-delete" onClick={() => deleteFlag(flag.id)}>✕</button>
                  </div>
                ))}
                {flags.length === 0 && <div className="empty">No flags found</div>}
              </div>
            </div>
          )}

          {view === 'services' && (
            <div className="services-view">
              <div className="services-grid">
                {[
                  { name: 'API Gateway', url: 'https://api.lsuthar.in', desc: 'JWT auth · Rate limiting · Circuit breaker · Canary routing', icon: '⬡' },
                  { name: 'Feature Flag Service', url: 'https://flags.lsuthar.in', desc: 'Boolean · String · Multivariate flags with weighted variants', icon: '⚑' },
                  { name: 'Auth Service', url: null, desc: 'RS256 JWT · Refresh tokens · Role-based access control', icon: '◉' },
                  { name: 'Audio Service', url: 'http://13.200.223.160:3001', desc: 'ffmpeg extraction · S3 storage · Redis job queue', icon: '◈' },
                  { name: 'Grafana', url: 'https://grafana.lsuthar.in', desc: 'Prometheus metrics · K8s dashboards · Node exporter', icon: '◇' },
                  { name: 'Health Aggregator', url: 'https://health-aggregator.leeladharsuthar62.workers.dev', desc: 'Cloudflare Worker · Aggregates all service health', icon: '○' },
                ].map(svc => (
                  <div key={svc.name} className="service-card">
                    <div className="service-icon">{svc.icon}</div>
                    <div className="service-info">
                      <div className="service-name">{svc.name}</div>
                      <div className="service-desc">{svc.desc}</div>
                      {svc.url && (
                        <a href={svc.url} target="_blank" rel="noopener noreferrer" className="service-link">
                          {svc.url.replace('https://', '').replace('http://', '')} ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
